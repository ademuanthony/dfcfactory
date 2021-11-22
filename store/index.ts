export type History = {
  date?: string
  action?: string
  amount?: number
}
export type StateType = {
  provider?: any
  web3Provider?: any
  contract?: any
  dfcToken?: any
  address?: string
  chainId?: number
  histories?: History[]
  totalDeposit?: number
  totalWithdrawal?: number
}

export type ActionType =
  | {
      type: 'SET_WEB3_PROVIDER'
      provider?: StateType['provider']
      web3Provider?: StateType['web3Provider']
      contract?: StateType['contract']
      dfcToken?: StateType['dfcToken']
      address?: StateType['address']
      chainId?: StateType['chainId']
    }
  | {
      type: 'SET_ADDRESS'
      address?: StateType['address']
    }
  | {
      type: 'SET_CHAIN_ID'
      chainId?: StateType['chainId']
    }
  | {
      type: 'RESET_WEB3_PROVIDER'
    }

export const initialState: StateType = {
  provider: null,
  web3Provider: null,
  contract: null,
  dfcToken: null,
  address: null,
  chainId: null,
  histories: [
    { date: '2021-08-05 10:17:21', action: 'Withdrawal', amount: 1000000 },
    { date: '2021-08-10 18:17:21', action: 'Deposit', amount: 12000000 },
    { date: '2021-08-15 08:17:21', action: 'Withdrawal', amount: 7000000 },
    { date: '2021-09-03 19:17:21', action: 'Deposit', amount: 10000000 },
    { date: '2021-10-21 05:17:21', action: 'Withdrawal', amount: 14000000 },
  ],
  totalDeposit: 0.0,
  totalWithdrawal: 0.0,
}

export function reducer(state: StateType, action: ActionType): StateType {
  switch (action.type) {
    case 'SET_WEB3_PROVIDER':
      return {
        ...state,
        provider: action.provider,
        web3Provider: action.web3Provider,
        contract: action.contract,
        dfcToken: action.dfcToken,
        address: action.address,
        chainId: action.chainId,
      }
    case 'SET_ADDRESS':
      return {
        ...state,
        address: action.address,
      }
    case 'SET_CHAIN_ID':
      return {
        ...state,
        chainId: action.chainId,
      }
    case 'RESET_WEB3_PROVIDER':
      return initialState
    default:
      throw new Error()
  }
}
