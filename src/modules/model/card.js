export default class Card {
  constructor(name, link) {
    this.cardElement = Card.createCardElement({ name, link });
  }

  static createCardElement({ name, link }) {
    const cardElement = document.createElement('div');
    cardElement.classList.add('place-card');

    const cardImageElement = document.createElement('div');
    cardImageElement.classList.add('place-card__image');
    cardImageElement.setAttribute('style', `background-image:url(${link})`);

    const deleteIconButtonElement = document.createElement('button');
    deleteIconButtonElement.classList.add('place-card__delete-icon');

    const cardDescriptionElement = document.createElement('div');
    cardDescriptionElement.classList.add('place-card__description');

    const cardNameElement = document.createElement('h3');
    cardNameElement.classList.add('place-card__name');
    cardNameElement.textContent = name;

    const likeIconButtonElement = document.createElement('button');
    likeIconButtonElement.classList.add('place-card__like-icon');

    cardElement.appendChild(cardImageElement);
    cardImageElement.appendChild(deleteIconButtonElement);
    cardElement.appendChild(cardDescriptionElement);
    cardDescriptionElement.appendChild(cardNameElement);
    cardDescriptionElement.appendChild(likeIconButtonElement);

    return cardElement;
  }

  getImage() {
    return this.cardElement
      .querySelector('.place-card__image')
      .style.backgroundImage.replace(/^url\(\\"(.+)\\"\)$/, '$1');
  }

  like() {
    this.cardElement
      .querySelector('.place-card__like-icon')
      .classList.toggle('place-card__like-icon_liked');
  }

  remove() {
    this.cardElement.remove();
  }
}
