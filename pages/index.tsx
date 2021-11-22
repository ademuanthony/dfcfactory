import Layout from '../components/Layout'

import WalletConnectProvider from '@walletconnect/web3-provider'
import { Contract, providers, BigNumber } from 'ethers'
import { useCallback, useEffect, useReducer, useState } from 'react'
import Web3Modal from 'web3modal'
import { ellipseAddress } from '../lib/utilities'
import contractAbi from '../abi/contract.json'
import dfcAbi from '../abi/dfcToken.json'

import { reducer, initialState } from '../store/index'

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider, // required
    options: {
      rpc: {
        56: 'https://bsc-dataseed.binance.org',
        97: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
      },
    },
  },
}

let web3Modal
if (typeof window !== 'undefined') {
  web3Modal = new Web3Modal({
    network: 'mainnet', // optional
    cacheProvider: true,
    providerOptions, // required
  })
}

export const Home = (): JSX.Element => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const { provider, web3Provider, address, contract, dfcToken } = state

  const contractAddress = '0x74789d27d3bd969f2b61d64796f50f77d0d93776'

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

    const contract = new Contract(contractAddress, contractAbi, signer)

    const dfcToken = new Contract(
      '0x651b6adf55249f285100dcf0fc29ee5b192583ac',
      dfcAbi,
      signer
    )

    dispatch({
      type: 'SET_WEB3_PROVIDER',
      provider,
      web3Provider,
      contract,
      dfcToken,
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

  const [amount, setAmount] = useState<number>(100000000)
  const [referral, setReferral] = useState<string>('')

  const invest = useCallback(
    async function (e) {
      e.preventDefault()
      if (!contract) {
        alert('please connect your wallet to continue')
        return
      }
      const inputAmount = BigNumber.from(amount)
      if (inputAmount.lt(BigNumber.from('100000000'))) {
        window.alert('Please enter 100000000 and above')
        return
      }

      const balance = await dfcToken.balanceOf(address)

      if (inputAmount.gt(balance)) {
        window.alert('Insufficient balance')
      }

      // if the user had not approve the amount to be spent, approve then invest
      const allowance = await dfcToken.allowance(address, contractAddress)
      if (inputAmount.gt(allowance)) {
        window.alert(`Please approve ${amount} DFC to continue`)
        await dfcToken.approve(contractAddress, inputAmount)
      }

      await contract.invest(0, referral, inputAmount)
      alert('Invested')
    },
    [contract, dfcToken]
  )

  return (
    <Layout>
      <header>
        <nav className="navbar navbar-expand-sm navbar-toggleable-sm navbar-light bg-white border-bottom box-shadow mb-3">
          <div className="container">
            <a
              className="navbar-brand"
              asp-area=""
              asp-controller="Home"
              asp-action="Index"
            >
              DFCFactor
            </a>
            <button
              className="navbar-toggler"
              type="button"
              data-toggle="collapse"
              data-target=".navbar-collapse"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="navbar-collapse collapse d-sm-inline-flex flex-sm-row-reverse">
              {web3Provider && (
                <ul className="navbar-nav">
                  <li className="nav-item">
                    <a
                      className="nav-link text-dark"
                      asp-area="Identity"
                      title="Manage"
                    >
                      Connected to: {ellipseAddress(address)}
                    </a>
                  </li>
                  <li className="nav-item">
                    <button
                      onClick={disconnect}
                      className="btn btn-outline-dark"
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              )}

              {!web3Provider && (
                <ul className="navbar-nav">
                  <li className="nav-item">
                    <button onClick={connect} className="btn btn-outline-dark">
                      Login
                    </button>
                  </li>
                </ul>
              )}
            </div>
          </div>
        </nav>
      </header>

      <div className="container">
        <main role="main" className="pb-3">
          <section className="container-fluid">
            <article className="jumbotron">
              <p>
                Supported: <button className="btn btn-dark">DFC</button>
              </p>
              <section className="row">
                <article className="col-md-8">
                  <div className="card">
                    <div className="card-body">
                      <h2>
                        Stake: <strong>DFC</strong>
                      </h2>
                      <div className="table-responsive">
                        <table className="table table-bordered">
                          <thead>
                            <tr>
                              <th>Days</th>
                              <th>%Daily</th>
                              <th>Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>30</td>
                              <td>5%</td>
                              <td>150%</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <br />
                      <form
                        className="form"
                        onSubmit={(e) => invest(e)}
                        style={{ border: '1px solid #dee2e6;', padding: 20 }}
                      >
                        <article className="row">
                          <div className="col-md-4 col-sm-6 col-xs-12">
                            <div className="form-group mb-2">
                              <label>
                                <strong>Invest (DFC)</strong>
                              </label>
                            </div>
                            <div
                              className="form-group mx-sm-3 mb-2"
                              style={{ marginLeft: '0 !important' }}
                            >
                              <input
                                value={amount}
                                onChange={(e) =>
                                  setAmount(parseFloat(e.target.value))
                                }
                                type="number"
                                min="100000000"
                                className="form-control"
                                id="invest-input"
                                placeholder="Amount"
                              />
                            </div>
                          </div>
                          <div
                            className="col-md-4 col-sm-6 col-xs-12"
                            style={{ marginLeft: '0 !important' }}
                          >
                            <div className="form-group mb-2">
                              <label>
                                <strong>
                                  Referral ID{' '}
                                  <small style={{ color: 'red' }}>
                                    (Optional)
                                  </small>
                                </strong>
                              </label>
                            </div>
                            <div
                              className="form-group mx-sm-3 mb-2 ml-0"
                              style={{ marginLeft: '0 !important' }}
                            >
                              <input
                                value={referral}
                                onChange={(e) => setReferral(e.target.value)}
                                type="text"
                                className="form-control"
                                id="invest-input"
                                placeholder="Ref ID"
                              />
                            </div>
                          </div>
                          <div
                            className="col-md-4 col-sm-6 col-xs-12"
                            style={{ marginLeft: '0 !important' }}
                          >
                            <label className="mb-3">
                              <strong>&nbsp;</strong>
                            </label>
                            <div>
                              <button
                                type="submit"
                                className="btn btn-dark mb-2"
                              >
                                Confirm
                              </button>
                            </div>
                          </div>
                        </article>
                      </form>
                    </div>
                  </div>
                  <br />
                  <div className="card">
                    <div className="card-body">
                      <h2>Read before you invest</h2>
                      <p>
                        The principal deposit cannot be withdrawn, the only
                        return users can get are daily dividends and referral
                        rewards. Payments is possible only if contract balance
                        have enough <strong>DFC</strong>. Please analyze the
                        transaction history and balance of the smart contract
                        before investing. High risk - high profit, DYOR
                      </p>
                    </div>
                  </div>
                </article>
                <article className="col-md-4">
                  <aside className="card">
                    <div className="card-body">
                      <h2>Your Farm</h2>
                      <p>DFC to Harvest</p>
                      <p>
                        <strong>0.0000000 DFC</strong>
                      </p>
                      <p>
                        <strong>$0.0000000</strong>{' '}
                        <button className="btn btn-dark">Harvest</button>
                      </p>
                      <hr />
                      <p>DFC in Wallet</p>
                      <p>
                        <strong>0.0000000 DFC</strong>
                      </p>
                      <p>
                        <strong>$0.0000000</strong>{' '}
                        <button
                          className="btn btn-outline-dark"
                          data-toggle="modal"
                          data-target="#historyModal"
                        >
                          History
                        </button>
                      </p>
                    </div>
                  </aside>
                  <br />
                  <aside className="card">
                    <div className="card-body">
                      <h2>Affiliate Program</h2>
                      <p>
                        <strong>1 LVL (your invited user) - 7%</strong>
                      </p>

                      <p>
                        <strong>2 LVL (user invited by your 1 lvl) - 3%</strong>
                      </p>

                      <p>
                        <strong>3 LVL - 1.5%</strong>
                      </p>

                      <p>
                        <strong>4 LVL - 1%</strong>
                      </p>

                      <p>
                        <strong>5 LVL - 0.5%</strong>
                      </p>
                      <div className="jumbotron">
                        <p>
                          <strong>Your Referral Link</strong>
                        </p>
                        <div className="input-group mb-3">
                          <input
                            type="text"
                            className="form-control"
                            defaultValue="https://www.example.com/637687267438"
                            aria-describedby="basic-addon2"
                          />
                          <div className="input-group-append">
                            <button
                              className="input-group-text btn"
                              id="basic-addon2"
                            >
                              Copy
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </aside>
                </article>
              </section>
            </article>
          </section>

          <section
            className="modal fade"
            id="historyModal"
            role="dialog"
            aria-labelledby="historyModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel">
                    History
                  </h5>
                  <button
                    type="button"
                    className="close"
                    data-dismiss="modal"
                    aria-label="Close"
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  <div className="table-responsive">
                    <table className="table table-striped">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Action</th>
                          <th>Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>--</td>
                          <td>--</td>
                          <td>--</td>
                        </tr>
                      </tbody>
                      <tfoot>
                        <tr>
                          <th>Total Deposit</th>
                          <td>&nbsp;</td>
                          <th>Total Withdrawal</th>
                        </tr>
                        <tr>
                          <th>0.0000000DFC</th>
                          <td>&nbsp;</td>
                          <th>0.0000000DFC</th>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>

      <footer className="border-top footer text-muted">
        <div className="container">
          &copy; 2021 - DFCFactor -{' '}
          <a asp-area="" asp-controller="Home" asp-action="Privacy">
            Privacy
          </a>
        </div>
      </footer>
    </Layout>
  )
}

export default Home
