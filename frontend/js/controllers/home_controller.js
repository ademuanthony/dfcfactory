import { Controller } from 'stimulus'
import { fetchAccountData, onConnect, onInit } from '../services/blockchain'

export default class extends Controller {
  static get targets () {
    return [
      'navbar'
    ]
  }

  initialize () {
    onInit()
  }

  connectWallet () {
    onConnect(fetchAccountData)
  }
}
