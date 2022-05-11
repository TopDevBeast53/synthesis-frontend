import React from 'react'
import { OrderState } from './types'

export const YieldPartyContext = React.createContext({
  tableRefresh: undefined,
  setTableRefresh: undefined,
  filterState: OrderState.Active,
})

export const YieldCPartyContext = React.createContext({
  tableRefresh: undefined,
  setTableRefresh: undefined,
  updateMenuIndex: undefined,
})
