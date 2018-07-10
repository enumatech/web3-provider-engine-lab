const chalk = require('chalk')
const Web3 = require('web3')

const ProviderEngine = require('web3-provider-engine')
const RpcSubprovider = require('web3-provider-engine/subproviders/rpc')
const HookedWalletSubprovider = require(
  'web3-provider-engine/subproviders/hooked-wallet'
)

const waitForGeth = require('./utils').waitForGeth

const GETH_HOST = 'http://localhost:8545'
const RANDOM_ADDR = Web3.utils.randomHex(20)

async function main () {
  await waitForGeth(GETH_HOST)

  /*
   * SETUP WEB3 SUBPROVIDERS
   */

  const engine = new ProviderEngine()
  const web3 = new Web3(engine)

  const hookedWalletSubprovider = new HookedWalletSubprovider({
    getAccounts: cb => cb(null, [RANDOM_ADDR]),

    signTransaction: (txData, cb) => {
      console.log(chalk.bold('\nSigning Transaction\n'), txData)

      cb(null, {
        messageHash: Web3.utils.randomHex(64),
        v: '0x27',
        r: Web3.utils.randomHex(64),
        s: Web3.utils.randomHex(64),
        rawTransaction: Web3.utils.randomHex(64),
      })
    },
  })

  const rpcSubprovider = new RpcSubprovider({rpcUrl: GETH_HOST})

  engine.addProvider(hookedWalletSubprovider)
  engine.addProvider(rpcSubprovider)
  engine.start()

  /*
   * EXERCISING THE HOOKED WALLET
   */

  console.log()
  console.log(chalk.bold('Accounts retrieved'))
  console.log(`\t${await web3.eth.getAccounts()}`)

  const tx = {
    from: RANDOM_ADDR,
    to: '0x000000000000000000000000000000000000dEaD',
    value: '1',
    gas: 2000000,
    gasPrice: '10',
    nonce: 0,
    chainId: 1337,
  }

  web3.eth.signTransaction(tx, (err, result) => {
    if (err) { throw err }

    console.log()
    console.log(chalk.bold('Result from signTransaction'))
    console.log(result)
  })

}

main().catch(console.error)
