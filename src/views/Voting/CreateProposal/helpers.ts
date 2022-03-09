import { ContextApi } from 'contexts/Localization/types'
import { format, parseISO, isValid } from 'date-fns'
import { FormState } from './types'

export const combineDateAndTime = (date: Date, time: Date) => {
  if (!isValid(date) || !isValid(time)) {
    return null
  }

  const dateStr = format(date, 'yyyy-MM-dd')
  const timeStr = format(time, 'HH:mm:ss')

  return parseISO(`${dateStr}T${timeStr}`).getTime() / 1e3
}

export const getFormErrors = (formData: FormState, t: ContextApi['t']) => {
  const { name, body, endDate, endTime, snapshot } = formData
  const errors: { [key: string]: string[] } = {}

  if (!name) {
    errors.name = [t('%field% is required', { field: 'Title' })]
  }

  if (!body) {
    errors.body = [t('%field% is required', { field: 'Body' })]
  }

  if (!isValid(endDate)) {
    errors.endDate = [t('Please select a valid date')]
  }

  if (!isValid(endTime)) {
    errors.endTime = [t('Please select a valid time')]
  }

  const startDateTimestamp = combineDateAndTime(new Date(), new Date())
  const endDateTimestamp = combineDateAndTime(endDate, endTime)

  if (endDateTimestamp < startDateTimestamp) {
    errors.endDate = Array.isArray(errors.endDate)
      ? [...errors.endDate, t('End date must be after the start date')]
      : (errors.endDate = [t('End date must be after the start date')])
  }

  if (snapshot === 0) {
    errors.snapshot = [t('Invalid snapshot')]
  }

  return errors
}
