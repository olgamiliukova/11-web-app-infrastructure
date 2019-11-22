export default class ApiClient {
    constructor (options) {
        this.options = Object.assign({
            baseUrl: 'http://localhost',
            headers: {
                authorization: '108bcb96-44f6-439c-a011-15e7192f69f4',
                'Content-Type': 'application/json'
            },
            method: 'GET'
        }, options || {});
    }

    fetch (path, options) {
        return fetch(`${this.options.baseUrl}/${path}`, Object.assign(this.options, options || {}))
            .then((result) => {
                if (result.ok) {
                return result.json();
                }

                return Promise.reject(`Error ${result.status}: ${result.status}`);
            })
            .catch((err) => {
                console.err(err);
            });
    }

    getUserInfo (callback) {
        return this.fetch('users/me').then(callback ? callback : data => data);
    }

    setUserInfo (data, callback) {
        return this.fetch('users/me', {
            method: 'PATCH',
            body: JSON.stringify(data)
        }).then(callback ? callback : data => data);
    }

    getCards (callback) {
        return this.fetch('cards').then(callback ? callback : data => data);
    }

    addCard (data, callback) {
        return this.fetch('cards', {
            method: 'POST',
            body: JSON.stringify(data)
        }).then(callback ? callback : data => data);
    }
}
