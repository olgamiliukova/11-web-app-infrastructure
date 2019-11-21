import Card from "./card"

export default class CardList {
    constructor (container, initialize) {
        this.container = container;
        this.cards = new Map();
        
        initialize && initialize(this);
    }

    addCard ({name, link}) {
        const card = new Card(name, link);

        this.cards.set(card.cardElement, card);
    }

    render () {
        this.cards.forEach(({cardElement}) => {
            this.container.appendChild(cardElement)
        });
    }
}
