export default class ApiClient {
  constructor(options = {}) {
    this.options = {
      baseUrl: 'http://localhost',
      headers: {
        Authentication: 'Bearer 108bcb96-44f6-439c-a011-15e7192f69f4',
        'Content-Type': 'application/json',
      },
      method: 'GET',
      ...options,
    };
  }

  fetch(path, options = {}) {
    console.log(Object.assign(this.options, options));
    return fetch(
      `${this.options.baseUrl}/${path}`,
      Object.assign(this.options, options),
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

  getUserInfo(callback = (p) => p) {
    return this.fetch('users/me').then(callback);
  }

  setUserInfo(data, callback = (p) => p) {
    return this.fetch('users/me', {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
      .then(callback);
  }

  getCards(callback = (p) => p) {
    return this.fetch('cards').then(callback);
  }

  addCard(data, callback = (p) => p) {
    return this.fetch('cards', {
      method: 'POST',
      body: JSON.stringify(data),
    })
      .then(callback);
  }
}
