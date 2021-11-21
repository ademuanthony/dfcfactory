import WalletConnectProvider from '@walletconnect/web3-provider'
import { providers } from 'ethers'
import Head from 'next/head'
import { useCallback, useEffect, useReducer } from 'react'
import Web3Modal from 'web3modal'
import { ellipseAddress } from '../lib/utilities'

import {reducer, initialState} from '../store/index'

const providerOptions = {
    walletconnect: {
      package: WalletConnectProvider, // required
      options: {
        rpc: {
          56: 'https://bsc-dataseed.binance.org',
          97: 'https://data-seed-prebsc-1-s1.binance.org:8545/'
        }
      },
    }
}
  
  let web3Modal
  if (typeof window !== 'undefined') {
    web3Modal = new Web3Modal({
      network: 'mainnet', // optional
      cacheProvider: true,
      providerOptions, // required
    })
  }

const Layout = ({ children }: {
    children: React.ReactNode;
}): JSX.Element => {
    const [state, dispatch] = useReducer(reducer, initialState)
    const { provider, web3Provider, address } = state
  
    const connect = useCallback(async function () {
      // This is the initial `provider` that is returned when
      // using web3Modal to connect. Can be MetaMask or WalletConnect.
      const provider = await web3Modal.connect()
  
      // We plug the initial `provider` into ethers.js and get back
      // a Web3Provider. This will add on methods from ethers.js and
      // event listeners such as `.on()` will be different.
      const web3Provider = new providers.Web3Provider(provider)
  
      const signer = web3Provider.getSigner()
      const address = await signer.getAddress()
  
      const network = await web3Provider.getNetwork()
  
      dispatch({
        type: 'SET_WEB3_PROVIDER',
        provider,
        web3Provider,
        address,
        chainId: network.chainId,
      })
    }, [])
  
    const disconnect = useCallback(
      async function () {
        await web3Modal.clearCachedProvider()
        if (provider?.disconnect && typeof provider.disconnect === 'function') {
          await provider.disconnect()
        }
        dispatch({
          type: 'RESET_WEB3_PROVIDER',
        })
      },
      [provider]
    )
  
    // Auto connect to the cached provider
    useEffect(() => {
      if (web3Modal.cachedProvider) {
        connect()
      }
    }, [connect])
  
    // A `provider` should come with EIP-1193 events. We'll listen for those events
    // here so that when a user switches accounts or networks, we can update the
    // local React state with that new information.
    useEffect(() => {
      if (provider?.on) {
        const handleAccountsChanged = (accounts: string[]) => {
          // eslint-disable-next-line no-console
          console.log('accountsChanged', accounts)
          dispatch({
            type: 'SET_ADDRESS',
            address: accounts[0],
          })
        }
  
        // https://docs.ethers.io/v5/concepts/best-practices/#best-practices--network-changes
        const handleChainChanged = (_hexChainId: string) => {
          window.location.reload()
        }
  
        const handleDisconnect = (error: { code: number; message: string }) => {
          // eslint-disable-next-line no-console
          console.log('disconnect', error)
          disconnect()
        }
  
        provider.on('accountsChanged', handleAccountsChanged)
        provider.on('chainChanged', handleChainChanged)
        provider.on('disconnect', handleDisconnect)
  
        // Subscription Cleanup
        return () => {
          if (provider.removeListener) {
            provider.removeListener('accountsChanged', handleAccountsChanged)
            provider.removeListener('chainChanged', handleChainChanged)
            provider.removeListener('disconnect', handleDisconnect)
          }
        }
      }
    }, [provider, disconnect])
  
    return (
        <div>
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>@ViewData["Title"] - DFCFactor</title>
                <link rel="stylesheet" href="/lib/bootstrap/dist/css/bootstrap.min.css" />
                <link rel="stylesheet" href="/css/site.css" />
            </Head>

            <header>
                <nav className="navbar navbar-expand-sm navbar-toggleable-sm navbar-light bg-white border-bottom box-shadow mb-3">
                    <div className="container">
                        <a className="navbar-brand" asp-area="" asp-controller="Home" asp-action="Index">DFCFactor</a>
                        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target=".navbar-collapse" aria-controls="navbarSupportedContent"
                                aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="navbar-collapse collapse d-sm-inline-flex flex-sm-row-reverse">
                            {web3Provider && (
                                 <ul className="navbar-nav">
                                     <li className="nav-item">
                                        <a  className="nav-link text-dark" asp-area="Identity" 
                                         title="Manage">Connected to: {ellipseAddress(address)}</a>
                                    </li>
                                    <li className="nav-item">
                                        <button onClick={disconnect} className="btn btn-outline-dark">Logout</button>
                                    </li>
                                </ul>
                            )}

                            {!web3Provider && (
                                 <ul className="navbar-nav">
                                     <li className="nav-item">
                                        <button onClick={connect} className="btn btn-outline-dark">Login</button>
                                    </li>
                                </ul>
                            )}
                        </div>
                    </div>
                </nav>
            </header>

            <div className="container">
                <main role="main" className="pb-3">
                    {children}
                </main>
            </div>

            <footer className="border-top footer text-muted">
                <div className="container">
                    &copy; 2021 - DFCFactor - <a asp-area="" asp-controller="Home" asp-action="Privacy">Privacy</a>
                </div>
            </footer>

            <script src="/lib/jquery/dist/jquery.min.js"></script>
            <script src="/lib/bootstrap/dist/js/bootstrap.bundle.min.js"></script>
        </div>
    )
}

export default Layout
