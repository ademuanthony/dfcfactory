import Layout from '../components/Layout'

export const Home = (): JSX.Element => {


  return (
    <Layout>
      
      <section className="container-fluid">
          <article className="jumbotron">
              <p>Supported: <button className="btn btn-dark">DFC</button></p>
              <section className="row">
                  <article className="col-md-8">
                      <div className="card">
                          <div className="card-body">
                              <h2>Stake: <strong>DFC</strong></h2>
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
                              <form className="form-inline">
                                  <div className="form-group mb-2">
                                      <label><strong>Invest (DFC)</strong></label>
                                  </div>
                                  <div className="form-group mx-sm-3 mb-2">
                                      <input type="number" className="form-control" id="invest-input" placeholder="Amount"/>
                                  </div>
                                  <button type="button" className="btn btn-dark mb-2">Confirm</button>
                              </form>
                          </div>
                      </div>
                      <br />
                      <div className="card">
                          <div className="card-body">
                              <h2>Read before you invest</h2>
                              <p>
                                  The principal deposit cannot be withdrawn, the only return users can get are daily dividends and referral rewards. Payments is possible only if contract balance have enough <strong>DFC</strong>. Please analyze the transaction history and balance of the smart contract before investing. High risk - high profit, DYOR
                              </p>
                          </div>
                      </div>
                  </article>
                  <article className="col-md-4">
                      <aside className="card">
                          <div className="card-body">
                              <h2>Your Farm</h2>
                              <p>DFC to Harvest</p>
                              <p><strong>0.0000000 DFC</strong></p>
                              <p><strong>$0.0000000</strong> <button className="btn btn-dark">Harvest</button></p>
                              <hr />
                              <p>DFC in Wallet</p>
                              <p><strong>0.0000000 DFC</strong></p>
                              <p><strong>$0.0000000</strong> <button className="btn btn-outline-dark" data-toggle="modal" data-target="#historyModal">History</button></p>
                          </div>
                      </aside>
                      <br />
                      <aside className="card">
                          <div className="card-body">
                              <h2>Affiliate Program</h2>
                              <p><strong>1 LVL (your invited user) - 7%</strong></p>

                              <p><strong>2 LVL (user invited by your 1 lvl) - 3%</strong></p>

                              <p><strong>3 LVL - 1.5%</strong></p>

                              <p><strong>4 LVL - 1%</strong></p>

                              <p><strong>5 LVL - 0.5%</strong></p>
                              <div className="jumbotron">
                                  <p><strong>Your Referral Link</strong></p>
                                  <div className="input-group mb-3">
                                      <input type="text" className="form-control" defaultValue="https://www.example.com/637687267438" aria-describedby="basic-addon2"/>
                                      <div className="input-group-append">
                                          <button className="input-group-text btn" id="basic-addon2">Copy</button>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </aside>
                  </article>
              </section>

          </article>

          <div data-controller="home">
              <input data-hello-target="name" type="text"/>

              <button data-action="click->home#greet">Greet</button>

              <span data-hello-target="output"></span>
          </div>

      </section>

    <section className="modal fade" id="historyModal" role="dialog" aria-labelledby="historyModalLabel" aria-hidden="true">
        <div className="modal-dialog" role="document">
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLabel">History</h5>
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
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


    </Layout>
  )
}

export default Home
