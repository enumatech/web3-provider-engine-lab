const chalk = require('chalk')
const Web3 = require('web3')

const ProviderEngine = require('web3-provider-engine')
const RpcSubprovider = require('web3-provider-engine/subproviders/rpc')
const HookedWalletSubprovider = require(
  'web3-provider-engine/subproviders/hooked-wallet'
)

const { waitForGeth } = require('./utils')
const walletFunctions = require('./hooked-wallet')

const GETH_HOST = 'http://localhost:8545'

async function main () {
  await waitForGeth(GETH_HOST)

  /*
   * SETUP WEB3 SUBPROVIDERS
   */

  const engine = new ProviderEngine()
  const web3 = new Web3(engine)

  // identity management service
  const walletSubprovider = new HookedWalletSubprovider(walletFunctions)
  engine.addProvider(walletSubprovider)

  // "zero client" RPC service
  const rpcSubprovider = new RpcSubprovider({rpcUrl: GETH_HOST})
  engine.addProvider(rpcSubprovider)

  engine.start()

  /*
   * EXERCISING THE HOOKED WALLET
   */

  console.log(chalk.green.bold('Accounts retrieved'))
  const accounts = await web3.eth.getAccounts()
  console.log(accounts)

  const tx = {
    from: accounts[0],
    to: '0x000000000000000000000000000000000000dEaD',
    value: '1',
    gas: 2000000,
    gasPrice: '10',
    nonce: 0,
    chainId: 1337
  }

  const signedTx = await web3.eth.signTransaction(tx)

  console.log()
  console.log(chalk.green.bold('Result from signTransaction'))
  console.log(signedTx)

  engine.stop()
}

main().catch(console.error)
