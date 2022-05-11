import {
    Connection,
    Keypair,
    PublicKey,
    clusterApiUrl,
    SYSVAR_RENT_PUBKEY,
    SystemProgram,
    Transaction,
} from '@solana/web3.js'
import axios from 'axios'
import { Token, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID, AccountLayout } from '@solana/spl-token'
import { Metadata } from '@metaplex-foundation/mpl-token-metadata'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { Program, Provider, web3, BN } from '@project-serum/anchor'
import idl from '../../../config/abi-solana/solana_anchor.json'
import CONSTANT from '../../../config/constants/solana_contract'
import { BRIDGE_BACKEND } from '../../../config/constants/endpoints'

const programID = new PublicKey(CONSTANT.programID.dev)

// TODO: Should be read from config or wallet adapter
const network = WalletAdapterNetwork.Devnet
const endpoint = () => clusterApiUrl(network)
const opts = {
    preflightCommitment: 'recent',
}
const AccountState = {
    Uninitialized: 0,
    Initialized: 1,
    Frozen: 2,
}

const getClusterURL = endpoint

export const connection = new Connection(getClusterURL(), opts.preflightCommitment)
// TODO: move to util
async function okToFailAsync(callback, args, wantObject = false) {
    try {
        // mandatory await here, can't just pass down (coz we need to catch error in this scope)
        return await callback(...args)
    } catch (e) {
        console.error(`Oh no! ${callback.name} called with ${args} blew up!`)
        console.error('Full error:', e)
        return wantObject ? {} : undefined
    }
}
// TODO: move to util
// get the list of NFTs which users own
export async function getTokensByOwner(owner) {
    const tokens = await connection.getParsedTokenAccountsByOwner(owner, {
        programId: TOKEN_PROGRAM_ID,
    })

    // initial filter - only tokens with 0 decimals & of which 1 is present in the wallet
    return tokens.value
        .filter((to) => {
            const amount = to.account.data.parsed.info.tokenAmount
            return amount.decimals === 0 && amount.uiAmount === 1
        })
        .map((to) => ({
            address: new PublicKey(to.pubkey),
            mint: new PublicKey(to.account.data.parsed.info.mint),
        }))
}

// TODO: move to util
function createAssociatedTokenAccountInstruction(
    payer,
    associatedToken,
    owner,
    mint,
    programId = TOKEN_PROGRAM_ID,
    associatedTokenProgramId = ASSOCIATED_TOKEN_PROGRAM_ID,
) {
    const keys = [
        { pubkey: payer, isSigner: true, isWritable: true },
        { pubkey: associatedToken, isSigner: false, isWritable: true },
        { pubkey: owner, isSigner: false, isWritable: false },
        { pubkey: mint, isSigner: false, isWritable: false },
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
        { pubkey: programId, isSigner: false, isWritable: false },
        { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },
    ]

    return {
        keys,
        programId: associatedTokenProgramId,
        data: Buffer.alloc(0),
    }
}
// TODO: move to util
async function getAccountInfo(address, commitment, programId = TOKEN_PROGRAM_ID) {
    const info = await connection.getAccountInfo(address, commitment)
    if (!info) throw new Error('TokenAccountNotFoundError')
    if (!info.owner.equals(programId)) throw new Error('TokenInvalidAccountOwnerError')
    if (info.data.length !== AccountLayout.span) throw new Error('TokenInvalidAccountSizeError')

    const rawAccount = AccountLayout.decode(Buffer.from(info.data))

    return {
        address,
        mint: rawAccount.mint,
        owner: rawAccount.owner,
        amount: rawAccount.amount,
        delegate: rawAccount.delegateOption ? rawAccount.delegate : null,
        delegatedAmount: rawAccount.delegatedAmount,
        isInitialized: rawAccount.state !== AccountState.Uninitialized,
        isFrozen: rawAccount.state === AccountState.Frozen,
        isNative: !!rawAccount.isNativeOption,
        rentExemptReserve: rawAccount.isNativeOption ? rawAccount.isNative : null,
        closeAuthority: rawAccount.closeAuthorityOption ? rawAccount.closeAuthority : null,
    }
}
// TODO: move to util
async function getOrCreateAssociatedTokenAccount(
    payer,
    mint,
    owner,
    signTransaction,
    allowOwnerOffCurve = false,
    commitment,
    programId = TOKEN_PROGRAM_ID,
    associatedTokenProgramId = ASSOCIATED_TOKEN_PROGRAM_ID,
) {
    const associatedToken = await getAssociatedTokenAddress(
        mint,
        owner,
        allowOwnerOffCurve,
        programId,
        associatedTokenProgramId,
    )

    // This is the optimal logic, considering TX fee, client-side computation, RPC roundtrips and guaranteed idempotent.
    // Sadly we can't do this atomically.
    let account
    try {
        account = await getAccountInfo(associatedToken, commitment, programId)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error) {
        // TokenAccountNotFoundError can be possible if the associated address has already received some lamports,
        // becoming a system account. Assuming program derived addressing is safe, this is the only case for the
        // TokenInvalidAccountOwnerError in this code path.
        if (error.message === 'TokenAccountNotFoundError' || error.message === 'TokenInvalidAccountOwnerError') {
            // As this isn't atomic, it's possible others can create associated accounts meanwhile.
            try {
                const transaction = new Transaction().add(
                    createAssociatedTokenAccountInstruction(
                        payer,
                        associatedToken,
                        owner,
                        mint,
                        programId,
                        associatedTokenProgramId,
                    ),
                )

                const blockHash = await connection.getRecentBlockhash()
                transaction.feePayer = await payer
                transaction.recentBlockhash = await blockHash.blockhash
                const signed = await signTransaction(transaction)

                const signature = await connection.sendRawTransaction(signed.serialize())

                await connection.confirmTransaction(signature)
            } catch (err) {
                // Ignore all errors; for now there is no API-compatible way to selectively ignore the expected
                // instruction error if the associated account exists already.
            }

            // Now this should always succeed
            account = await getAccountInfo(associatedToken, commitment, programId)
        } else {
            throw error
        }
    }

    if (!account.mint.equals(mint.toBuffer())) throw Error('TokenInvalidMintError')
    if (!account.owner.equals(owner.toBuffer())) throw new Error('TokenInvalidOwnerError')

    return account
}
// TODO: move to util
async function getAssociatedTokenAddress(
    mint,
    owner,
    allowOwnerOffCurve = false,
    programId = TOKEN_PROGRAM_ID,
    associatedTokenProgramId = ASSOCIATED_TOKEN_PROGRAM_ID,
) {
    if (!allowOwnerOffCurve && !PublicKey.isOnCurve(owner.toBuffer())) throw new Error('TokenOwnerOffCurveError')

    const [address] = await PublicKey.findProgramAddress(
        [owner.toBuffer(), programId.toBuffer(), mint.toBuffer()],
        associatedTokenProgramId,
    )

    return address
}

export async function approveNFT(wallet, minter, account) {
    const mint = new PublicKey(minter)
    const provider = new Provider(connection, wallet, Provider.defaultOptions())
    const program = new Program(idl, programID, provider)
    const senderATA = await getOrCreateAssociatedTokenAccount(
        wallet.publicKey,
        mint,
        wallet.publicKey,
        wallet.signTransaction,
    )
    const receiverATA = await getOrCreateAssociatedTokenAccount(
        wallet.publicKey,
        mint,
        programID,
        wallet.signTransaction,
    )

    const uint8array = new TextEncoder().encode(account)
    const tx = program.transaction.transferIn(uint8array, {
        accounts: {
            from: senderATA.address,
            to: receiverATA.address,
            mint,
            owner: wallet.publicKey,
            tokenProgram: TOKEN_PROGRAM_ID,
        },
        signers: [],
    })

    tx.feePayer = wallet.publicKey
    tx.recentBlockhash = (await connection.getRecentBlockhash()).blockhash
    const signedTx = await wallet.signTransaction(tx)
    try {
        const txId = await connection.sendRawTransaction(signedTx.serialize())
        await connection.confirmTransaction(txId)
        return true
    } catch {
        console.error('transaction error!')
        return false
    }
}
// TODO: move to util
async function getMetadataByMint(mint, metadataPDA, metadataOnchain) {
    const pda = metadataPDA ?? (await Metadata.getPDA(mint))
    const onchain = metadataOnchain ?? (await Metadata.load(connection, pda)).data
    const metadataExternal = (await axios.get(onchain.data.uri)).data
    return {
        metadataPDA: pda,
        metadataOnchain: onchain,
        metadataExternal,
    }
}

const fetchStates = async () => {
    // Send GET request to 'states/all' endpoint
    let result = []
    try {
        const response = await axios.get(BRIDGE_BACKEND)
        result = response.data
    } catch (err) {
        console.error(`There was an error retrieving: ${err}`)
    }
    return result
}

export async function tokensToEnrichedNFTs(wallet) {
    let tokens = await getTokensByOwner(wallet.publicKey)
    const tokensOwnedByProgram = await getTokensByOwner(programID)
    const stateData = await fetchStates()
    const filteredData = stateData.filter((d) => d.owner.toString() === wallet.publicKey.toString())
    let tokensOwnedByUser = tokensOwnedByProgram.filter((t) => {
        // eslint-disable-next-line no-restricted-syntax
        for (const d of filteredData) {
            if (t.mint.toString() === d.mint.toString()) {
                return true
            }
        }
        return false
    })
    tokens = tokens.map((t) => ({ ...t, approved: false }))
    tokensOwnedByUser = tokensOwnedByUser.map((t) => ({ ...t, approved: true }))
    return Promise.all(
        [...tokensOwnedByUser, ...tokens].map(async (t) => ({
            mint: t.mint,
            address: t.address,
            isApproved: t.approved,
            ...(await okToFailAsync(getMetadataByMint, [t.mint, t.metadataPDA, t.metadataOnchain], true)),
        })),
    )
}
