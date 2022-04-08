# Helix Frontend

✅ Helix Swap functionality 

❌ Helix Swap UI 

✅ Helix Liquidity functionality 

❌ Helix Liquidity UI 

🔵 Helix Farms / Pools functionality  


## Code Pointers 

General
- List of majority of the contracts used in UI for mainnet (56) and testnet (97): 

    [src/config/constants/contracts.ts](https://github.com/helixdefi/helix-frontend/blob/develop/src/config/constants/contracts.ts)
    
 - Factory address. Now it's pointing to HelixFactory contract in **testnet**
 
     [src/sdk/constants.ts](https://github.com/helixdefi/helix-frontend/blob/develop/src/sdk/constants.ts#L23)
     
- INIT_CODE_HASH. It can be taken from [HelixLibrary.sol](https://github.com/helixdefi/helix/blob/master/contracts/libraries/HelixLibrary.sol#L22)

    [src/sdk/constants.ts](https://github.com/helixdefi/helix-frontend/blob/develop/src/sdk/constants.ts#L25)

- Router address. Now it's pointing to HelixRouter contract in **testnet**

    [src/config/constants/index.ts](https://github.com/helixdefi/helix-frontend/blob/develop/src/config/constants/index.ts#L7)
    
- Almost all calls to contracts are happening in batches using mutlicall contract in Updater class

    mainnet - '0xfF6FD90A470Aaa0c1B8A54681746b07AcdFedc9B'
    
    testnet - '0x8F3273Fb89B075b1645095ABaC6ed17B2d4Bc576' 

    [src/state/multicall/updater.tsx](https://github.com/helixdefi/helix-frontend/blob/develop/src/state/multicall/updater.tsx#L49)
----

- Helix LP token declaration (be cautions of name string) 

    [src/sdk/entities/pair.ts](https://github.com/helixdefi/helix-frontend/blob/develop/src/sdk/entities/pair.ts#L55)
    [src/views/RemoveLiquidity/index.tsx](https://github.com/helixdefi/helix-frontend/blob/develop/src/views/RemoveLiquidity/index.tsx#L116)
    [src/state/user/hooks/index.tsx](https://github.com/helixdefi/helix-frontend/blob/develop/src/state/user/hooks/index.tsx#L398)

- List of pools displayed on the website

    [src/config/constants/pools.ts](https://github.com/helixdefi/helix-frontend/blob/develop/src/config/constants/pools.ts)
    
 - List of farms displayed on the website

    [src/config/constants/farms.ts](https://github.com/helixdefi/helix-frontend/blob/develop/src/config/constants/farms.ts)


## Documentation

- [Info](doc/Info.md)
- [Cypress tests](doc/Cypress.md)
