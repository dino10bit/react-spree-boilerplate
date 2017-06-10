import {
  Pages,
  Products
} from "./endpoints"

export default class ApiClient {
  static TOKEN_HEADER = "X-Spree-Token"

  constructor(url, token) {
    this.url = url
    this.token = token
    this.pages = new Pages(this)
    this.products = new Products(this)
  }

  fetch(url, options = {}) {
    const { TOKEN_HEADER } = this.constructor
    const headers = options.headers || {}
    const token = this.token || options.token
    if(token && !(TOKEN_HEADER in headers)) {
      headers[TOKEN_HEADER] = token
    }
    return fetch(url, { ...options, headers })
  }
}