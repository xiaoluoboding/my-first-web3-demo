import { defineStore } from 'pinia'

type AccountState = {
  account: string
}

export const useAccountStore = defineStore({
  id: 'account',

  state: (): AccountState => ({
    account: ''
  }),

  getters: {
    shortAccount: (state) => {
      return `${state.account.substring(0, 5)}...${state.account.substring(
        state.account.length - 4
      )}`
    }
  },

  actions: {
    setAccountState(payload: AccountState) {
      Object.assign(this, payload)
    }
  }
})
