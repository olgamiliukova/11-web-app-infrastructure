import { Subscriber } from "../core"

export default class Popup extends Subscriber {
    constructor (popupElement, initialize) {
        super();

        this.popupElement = popupElement;

        this.addHandler(this.onClose);
        
        initialize && initialize(this);
    }

    onClose () {
        const closeButton = this.popupElement.querySelector('.popup__close');

        if (null !== closeButton) {
            closeButton.addEventListener('click', (event) => {
                event.preventDefault();

                this.close.call(this)
            });
        }
    }

    open (callback) {
        callback && callback(this);

        this.popupElement.classList.add('popup_is-opened');
    }

    close (callback) {
        callback && callback(this);

        this.popupElement.classList.remove('popup_is-opened');
    }
}
