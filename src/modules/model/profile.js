export default class Profile {
    constructor (container, initialize) {
        this.container = container;
        this.selectors = {
            avatar: '.user-info__photo',
            name: '.user-info__name',
            about: '.user-info__job'
        };
        this.renderers = {
            avatar: this.renderImg,
            name: this.renderTxt,
            about: this.renderTxt
        };
        this.userInfo = Object.defineProperties({}, {
            avatar: {
                enumerable: true,
                writable: true,
                value: ''
            },
            name: {
                enumerable: true,
                writable: true,
                value: ''
            },
            about: {
                enumerable: true,
                writable: true,
                value: ''
            },
            _id: {
                enumerable: true,
                writable: true,
                value: ''
            }
        });
        
        initialize && initialize(this);
    }

    renderImg (selector, url) {
        this.container
            .querySelector(selector)
            .style.backgroundImage = `url(${url})`;
    }

    renderTxt (selector, content) {
        this.container.querySelector(selector).textContent = content;
    }

    render () {
        Object.keys(this.selectors).forEach((fieldName) => {
            if (fieldName in this.selectors && fieldName in this.userInfo) {
                const rederer = fieldName in this.renderers ? this.renderers[fieldName] : this.renderTxt;

                rederer.call(this, this.selectors[fieldName], this.userInfo[fieldName]);
            }
        });
    }
}
