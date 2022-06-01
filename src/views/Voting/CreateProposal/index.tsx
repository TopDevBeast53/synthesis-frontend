import React, { ChangeEvent, FormEvent, lazy, useEffect, useState, useMemo } from 'react'
import {
  AutoRenewIcon,
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Heading,
  Input,
  LinkExternal,
  Text,
  ArrowBackIcon,
  useModal,
} from 'uikit'
import { useHistory } from 'react-router'
import { Link } from 'react-router-dom'
import { useWeb3React } from '@web3-react/core'
import isEmpty from 'lodash/isEmpty'
import { useInitialBlock } from 'state/block/hooks'
import { SnapshotCommand } from 'state/types'
import useToast from 'hooks/useToast'
import useWeb3Provider from 'hooks/useActiveWeb3React'
import { getEtherScanLink } from 'utils'
import truncateHash from 'utils/truncateHash'
import { signMessage } from 'utils/web3React'
import { useTranslation } from 'contexts/Localization'
import Container from 'components/Layout/Container'
import { DatePicker, TimePicker, DatePickerPortal } from 'views/Voting/components/DatePicker'
import ConnectWalletButton from 'components/ConnectWalletButton'
import ReactMarkdown from 'components/ReactMarkdown'
import { PageMeta } from 'components/Layout/Page'
import { sendSnapshotData, Message, generateMetaData, generatePayloadData } from '../helpers'
import Layout from '../components/Layout'
import { FormErrors, Label, SecondaryLabel } from './styles'
import { combineDateAndTime, getFormErrors } from './helpers'
import { FormState } from './types'
import { ADMINS, CHOICES_PRESET } from '../config'
import VoteDetailsModal from '../components/VoteDetailsModal'

const EasyMde = lazy(() => import('components/EasyMde'))

const CreateProposal = () => {
  const [state, setState] = useState<FormState>({
    name: '',
    body: '',
    endDate: null,
    endTime: null,
    snapshot: 0,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [fieldsState, setFieldsState] = useState<{ [key: string]: boolean }>({})
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const initialBlock = useInitialBlock()
  const { push } = useHistory()
  const { library, connector } = useWeb3Provider()
  const { toastSuccess, toastError } = useToast()
  const [onPresentVoteDetailsModal] = useModal(<VoteDetailsModal />)
  const { name, body, endDate, endTime, snapshot } = state
  const formErrors = getFormErrors(state, t)

  const handleSubmit = async (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault()

    try {
      setIsLoading(true)
      const proposal = JSON.stringify({
        ...generatePayloadData(),
        type: SnapshotCommand.PROPOSAL,
        payload: {
          name,
          body,
          snapshot,
          start: combineDateAndTime(new Date(), new Date()),
          end: combineDateAndTime(endDate, endTime),
          choices: CHOICES_PRESET,
          metadata: generateMetaData(),
          type: 'single-choice',
        },
      })

      const sig = await signMessage(connector, library, account, proposal)

      if (sig) {
        const msg: Message = { address: account, msg: proposal, sig }

        // Save proposal to snapshot
        const data = await sendSnapshotData(msg)

        // Redirect user to newly created proposal page
        push(`/voting/proposal/${data.ipfsHash}`)

        toastSuccess(t('Proposal created!'))
      } else {
        toastError(t('Error'), t('Unable to sign payload'))
      }
    } catch (error) {
      toastError(t('Error'), (error as Error)?.message)
      console.error(error)
      setIsLoading(false)
    }
  }

  const updateValue = (key: string, value: string | Date) => {
    setState((prevState) => ({
      ...prevState,
      [key]: value,
    }))

    // Keep track of what fields the user has attempted to edit
    setFieldsState((prevFieldsState) => ({
      ...prevFieldsState,
      [key]: true,
    }))
  }

  const handleChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const { name: inputName, value } = evt.currentTarget
    updateValue(inputName, value)
  }

  const handleEasyMdeChange = (value: string) => {
    updateValue('body', value)
  }

  const handleDateChange = (key: string) => (value: Date) => {
    updateValue(key, value)
  }

  const options = useMemo(() => {
    return {
      hideIcons:
        account && ADMINS.includes(account.toLowerCase())
          ? []
          : ['guide', 'fullscreen', 'preview', 'side-by-side', 'image'],
    }
  }, [account])

  useEffect(() => {
    if (initialBlock > 0) {
      setState((prevState) => ({
        ...prevState,
        snapshot: initialBlock,
      }))
    }
  }, [initialBlock, setState])

  return (
    <Container py="40px">
      <PageMeta />
      <Box mb="40px">
        <Button as={Link} to="/voting" variant="text" startIcon={<ArrowBackIcon color="primary" width="24px" />} px="0">
          {t('Back to Vote Overview')}
        </Button>
      </Box>
      <form onSubmit={handleSubmit}>
        <Layout>
          <Box>
            <Box mb="24px">
              <Label htmlFor="name">{t('Proposal')}</Label>
              <Input id="name" name="name" value={name} scale="lg" onChange={handleChange} required />
              {formErrors.name && fieldsState.name && <FormErrors errors={formErrors.name} />}
            </Box>
            <Box mb="24px">
              <Label htmlFor="body">{t('Description')}</Label>
              <Text color="textSubtle" mb="8px">
                {t('')}
              </Text>
              <EasyMde
                id="body"
                name="body"
                onTextChange={handleEasyMdeChange}
                value={body}
                options={options}
                required
              />
              {formErrors.body && fieldsState.body && <FormErrors errors={formErrors.body} />}
            </Box>
            {body && (
              <Box mb="24px">
                <Card>
                  <CardHeader>
                    <Heading as="h3" scale="md">
                      {t('Preview')}
                    </Heading>
                  </CardHeader>
                  <CardBody p="0" px="24px">
                    <ReactMarkdown>{body}</ReactMarkdown>
                  </CardBody>
                </Card>
              </Box>
            )}
          </Box>
          <Box>
            <Card>
              <CardHeader>
                <Heading as="h3" scale="md">
                  {t('Actions')}
                </Heading>
              </CardHeader>
              <CardBody>
                <Box mb="24px">
                  <SecondaryLabel>{t('End Date')}</SecondaryLabel>
                  <DatePicker
                    name="endDate"
                    onChange={handleDateChange('endDate')}
                    selected={endDate}
                    placeholderText="YYYY/MM/DD"
                  />
                  {formErrors.endDate && fieldsState.endDate && <FormErrors errors={formErrors.endDate} />}
                </Box>
                <Box mb="24px">
                  <SecondaryLabel>{t('End Time')}</SecondaryLabel>
                  <TimePicker
                    name="endTime"
                    onChange={handleDateChange('endTime')}
                    selected={endTime}
                    placeholderText="00:00"
                  />
                  {formErrors.endTime && fieldsState.endTime && <FormErrors errors={formErrors.endTime} />}
                </Box>
                {account && (
                  <Flex alignItems="center" mb="8px">
                    <Text color="textSubtle" mr="16px">
                      {t('Creator')}
                    </Text>
                    <LinkExternal href={getEtherScanLink(account, 'address')}>{truncateHash(account)}</LinkExternal>
                  </Flex>
                )}
                <Flex alignItems="center" mb="16px">
                  <Text color="textSubtle" mr="16px">
                    {t('Snapshot')}
                  </Text>
                  <LinkExternal href={getEtherScanLink(snapshot, 'block')}>{snapshot}</LinkExternal>
                </Flex>
                {account ? (
                  <>
                    <Button
                      type="submit"
                      width="100%"
                      isLoading={isLoading}
                      endIcon={isLoading ? <AutoRenewIcon spin color="currentColor" /> : null}
                      disabled={!isEmpty(formErrors)}
                      mb="16px"
                    >
                      {t('Publish')}
                    </Button>
                    <Button scale="sm" type="button" variant="text" onClick={onPresentVoteDetailsModal} p={0}>
                      {t('Check voting power')}
                    </Button>
                  </>
                ) : (
                  <ConnectWalletButton width="100%" type="button" />
                )}
              </CardBody>
            </Card>
          </Box>
        </Layout>
      </form>
      <DatePickerPortal />
    </Container>
  )
}

export default CreateProposal
