const Web3 = require('web3')
const sleep = require('system-sleep');

/**
 * Wait for Geth to start
 * @param host Geth RPC URL
 */
function waitForGeth (host) {
  return new Promise(async resolve => {
    const web3 = new Web3(host)

    while (true) {
      try {
        const ver = await web3.eth.getProtocolVersion()
        if (ver) {
          resolve(true)
          break
        }
      } catch (err) {}

      sleep(20)
    }
  })
}

module.exports = {
  waitForGeth
}
