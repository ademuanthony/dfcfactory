import { Controller } from 'stimulus'
import { onConnect, onInit } from '../services/blockchain'

export default class extends Controller {
  static get targets () {
    return [
      'navbar'
    ]
  }

  initialize () {
    onInit()
    fetchDa
  }

  connectWallet () {
    onConnect()
  }
}
