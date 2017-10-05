export const initialState = {
  accounts: []
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case 'SYNC_ACCOUNTS': {
      return {...state,
        accounts: [...state.accounts, ...action.accounts]
      }
    }
    case 'UPDATE_ACCOUNT_BALANCE': {
      let updatedAccounts = state.accounts.map((account) => {
        if (account.privateKey == action.privateKey) {
          account.accountAmount = action.amount;
        }

        return account;
      })

      return {...state,
        accounts: updatedAccounts
      }
    }
    default:
      return state;
  }
}
