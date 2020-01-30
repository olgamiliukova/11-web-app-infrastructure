export default class ApiClient {
  constructor(options) {
    this.options = {
      baseUrl: 'http://localhost',
      headers: {
        Authentication: 'Bearer 108bcb96-44f6-439c-a011-15e7192f69f4',
        'Content-Type': 'application/json',
      },
      method: 'GET',
      ...options || {},
    };
  }

  fetch(path, options) {
    return fetch(
      `${this.options.baseUrl}/${path}`,
      Object.assign(this.options, options || {}),
    )
      .then((result) => {
        if (result.ok) {
          return result.json();
        }

        return Promise.reject(
          new Error(`Error ${result.message}: ${result.status}`),
        );
      })
      .catch((err) => {
        console.error(err);
      });
  }

  getUserInfo(callback) {
    return this.fetch('users/me').then(callback || ((d) => d));
  }

  setUserInfo(data, callback) {
    return this.fetch('users/me', {
      method: 'PATCH',
      body: JSON.stringify(data),
    }).then(callback || ((d) => d));
  }

  getCards(callback) {
    return this.fetch('cards').then(callback || ((d) => d));
  }

  addCard(data, callback) {
    return this.fetch('cards', {
      method: 'POST',
      body: JSON.stringify(data),
    }).then(callback || ((d) => d));
  }
}
