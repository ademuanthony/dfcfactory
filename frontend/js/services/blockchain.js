import Web3Modal from 'web3modal'
import WalletConnectProvider from '@walletconnect/web3-provider'
import Web3 from 'web3'
import ABI from './abi/abi.json'

export const bnb = 1e18
export const dfc = 1e8

// Web3modal instance
let web3Modal

// Chosen wallet provider given by the dialog window
let provider

export const onInit = () => {
  // Tell Web3modal what providers we have available.
  // Built-in web browser provider (only one can exist as a time)
  // like MetaMask, Brave or Opera is added automatically by Web3modal
  const providerOptions = {
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        rpc: {
          56: 'https://bsc-dataseed.binance.org',
          97: 'https://data-seed-prebsc-1-s1.binance.org:8545'
        }
      }
    }
  }

  web3Modal = new Web3Modal({
    cacheProvider: false, // optional
    providerOptions // required
  })
}

/**
 * Connect wallet button pressed.
 */
export const onConnect = async (prepare) => {
  console.log('Opening a dialog', web3Modal)
  try {
    provider = await web3Modal.connect()
  } catch (e) {
    console.log('Could not get a wallet connection', e)
    return
  }

  // Subscribe to accounts change
  provider.on('accountsChanged', (accounts) => {
    console.log(accounts)
    if (prepare) {
      prepare()
    }
  })

  // Subscribe to chainId change
  provider.on('chainChanged', (chainId) => {
    if (prepare) {
      prepare()
    }
  })

  // Subscribe to networkId change
  provider.on('networkChanged', (networkId) => {
    if (prepare) {
      prepare()
    }
  })

  if (prepare) {
    prepare()
  }
}

export const onDisconnect = async () => {
  console.log('Killing the wallet connection', provider)

  // TODO: Which providers have close method?
  if (provider.close) {
    await provider.close()

    // If the cached provider is not cleared,
    // WalletConnect will default to the existing session
    // and does not allow to re-scan the QR code with a new wallet.
    // Depending on your use case you may want or want not his behavir.
    await web3Modal.clearCachedProvider()
    provider = null
  }
}

/**
 * Kick in the UI action after Web3modal dialog has chosen a provider
 */
export const fetchAccountData = async () => {

  // Get a Web3 instance for the wallet
  const web3 = new Web3(provider);

  // Get list of accounts of the connected wallet
  const accounts = await web3.eth.getAccounts();

  // MetaMask does not give you all accounts, only the selected account
  console.log("Got accounts", accounts);
  selectedAccount = accounts[0];

  console.log(selectedAccount)

  // Because rendering account does its own RPC commucation
  // with Ethereum node, we do not want to display any results
  // until data for all accounts is loaded
  await Promise.all(rowResolvers);

  // Display fully loaded UI for wallet data
  document.querySelector("#prepare").style.display = "none";
  document.querySelector("#connected").style.display = "block";
}


