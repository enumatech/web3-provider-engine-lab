const Web3 = require('web3')
const sleep = require('system-sleep')

/**
 * Wait for Geth to start
 * @param host Geth RPC URL
 */
function waitForGeth (host) {
  return new Promise(async resolve => {
    const web3 = new Web3(host)

    while (true) {
      try {
        if (await web3.eth.net.isListening()) {
          resolve(true)
          break
        }
      } catch (err) {}

      sleep(100)
    }
  })
}

module.exports = {
  waitForGeth
}
