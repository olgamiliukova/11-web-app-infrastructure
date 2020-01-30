import './index.css';

import { ApiClient } from './modules/core';
import { CardList, Profile } from './modules/model';
import { Popup, FormPopup } from './modules/popup';
import { AddCardFormSubscriber, EditProfileFormSubscriber } from './modules/form/subscribers';

const apiClient = new ApiClient({
  baseUrl: NODE_ENV === 'development' ? API_URL.replace('https', 'http') : API_URL,
  headers: {
    Authorization: API_TOKEN,
    'Content-Type': 'application/json',
  },
});

const imagePopup = new Popup(document.querySelector('.popup__image'));
imagePopup.subscribe();

const cardList = new CardList(document.querySelector('.places-list'));
cardList.container.addEventListener('click', (event) => {
  const cardElement = event.target.closest('.place-card');

  if ((cardElement !== null) && cardList.cards.has(cardElement)) {
    const card = cardList.cards.get(cardElement);

    if (event.target.classList.contains('place-card__like-icon')) {
      card.like();
    }

    if (event.target.classList.contains('place-card__delete-icon')) {
      cardList.cards.delete(cardElement);
      card.remove();
    }

    if (event.target.classList.contains('place-card__image')) {
      imagePopup.open(({ popupElement }) => {
        popupElement
          .querySelector('.popup__image-bg')
          .setAttribute('src', card.getImage());
      });
    }
  }
});

apiClient.getCards((cardListData = []) => {
  cardListData.forEach(cardList.addCard.bind(cardList));
  cardList.render();
});

const addCardPopup = new FormPopup(document.querySelector('.popup__card-add'));
addCardPopup.addHandler(({ popupForm }) => {
  const addButton = document.querySelector('.user-info__button-add');

  addButton.addEventListener('click', (event) => {
    event.preventDefault();

    addCardPopup.open(() => popupForm.activateForm());
  });
});
addCardPopup.addHandler(({ popupForm }) => {
  (new AddCardFormSubscriber(
    popupForm,
    apiClient,
    cardList,
    addCardPopup.close.bind(addCardPopup),
  )).subscribe();
});
addCardPopup.subscribe();

const profile = new Profile(document.querySelector('.profile'));

apiClient.getUserInfo((userInfo = {}) => {
  profile.userInfo = userInfo;
  profile.render();
});

const editProfilePopup = new FormPopup(document.querySelector('.popup__profile-edit'));
editProfilePopup.addHandler(({ popupForm }) => {
  const editButton = document.querySelector('.user-info__button-edit');
  editButton.addEventListener('click', (event) => {
    event.preventDefault();

    editProfilePopup.open(() => {
      popupForm.populateForm(profile.userInfo);
      popupForm.activateForm();
    });
  });
});
editProfilePopup.addHandler(({ popupForm }) => {
  (new EditProfileFormSubscriber(
    popupForm,
    apiClient,
    profile,
    editProfilePopup.close.bind(editProfilePopup),
  )).subscribe();
});
editProfilePopup.subscribe();
