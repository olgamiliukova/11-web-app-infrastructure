export default class ApiClient {
  constructor(options = {}) {
    this.options = {
      baseUrl: 'http://localhost',
      mode: 'cors',
      headers: {
        'content-type': 'application/json',
      },
      method: 'GET',
      ...options,
    };
  }

  fetch(path, options = {}) {
    return fetch(
      `${this.options.baseUrl}/${path}`, {
        ...this.options,
        ...options,
      },
    )
      .then((result) => {
        if (result.ok) {
          return result.json();
        }

        throw new Error(`Error ${result.message}: ${result.status}`);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  authorize(email, password, callback = (p) => p) {
    return this.fetch('signin', {
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
      }),
    })
      .then(callback);
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

  deleteCard(id, callback = (p) => p) {
    return this.fetch(`cards/${id}`, {
      method: 'DELETE',
    })
      .then(callback);
  }

  likeCard(id, callback = (p) => p) {
    return this.fetch(`cards/${id}/likes`, {
      method: 'PUT',
    })
      .then(callback);
  }

  unlikeCard(id, callback = (p) => p) {
    return this.fetch(`cards/${id}/likes`, {
      method: 'DELETE',
    })
      .then(callback);
  }
}
