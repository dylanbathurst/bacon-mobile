export const syncAccounts = (accounts) => {
  return {
    type: 'SYNC_ACCOUNTS',
    accounts
  }
}

export const updateAccountBalance = (privateKey, amount) => {
  return {
    type: 'UPDATE_ACCOUNT_BALANCE',
    privateKey: privateKey,
    amount: amount
  }
}
