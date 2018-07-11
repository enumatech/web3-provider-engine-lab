const chalk = require('chalk')
const Web3 = require('web3')

const hookedWalletFunctions = {
  getAccounts: cb => {
    const acc = '0x132bbee10eab0fafea1964fc11eea3643b904209'
    cb(null, [acc])
  },

  signTransaction: (txData, cb) => {
    console.debug()
    console.debug(chalk.green.bold('Signing Transaction'))
    console.debug(txData)

    cb(null, {
      messageHash: Web3.utils.randomHex(64),
      v: '0x27',
      r: Web3.utils.randomHex(64),
      s: Web3.utils.randomHex(64),
      rawTransaction: Web3.utils.randomHex(64)
    })
  }
}

module.exports = hookedWalletFunctions
