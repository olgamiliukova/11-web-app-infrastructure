class Card {
  constructor (name, link) {
    this.cardElement = this.createCardElement({name, link});
  }

  createCardElement ({name, link}) {
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

  getImage () {
    return this.cardElement
      .querySelector('.place-card__image')
      .style.backgroundImage.replace(/^url\(\"(.+)\"\)$/, '$1')
  }

  like () {
    this.cardElement
      .querySelector('.place-card__like-icon')
      .classList.toggle('place-card__like-icon_liked');
  }

  remove () {
    this.cardElement.remove();
  }
}

class CardList {
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

class Profile {
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

class Subscriber {
  constructor (handlers = []) {
    this.handlers = handlers;
  }

  addHandler (handler) {
    this.handlers.push(handler);
  }

  subscribe () {
    this.handlers.forEach((handler) => handler.call(this, this));
  }
}

class Popup extends Subscriber {
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

class Form {
  constructor (formElement) {
    this.formElement = formElement;
  }

  activateForm () {
    const popupButton = this.formElement.querySelector('.popup__button');
    const isFullFilled = Array.from(this.formElement.querySelectorAll('input')).reduce((acc, el) => {
      return acc && el.validity.valid;
    }, true);

    if (!isFullFilled) {
      popupButton.setAttribute('disabled', true);
      popupButton.classList.remove('popup__button_active');
    } else {
      popupButton.removeAttribute('disabled');
      popupButton.classList.add('popup__button_active');
    }
  }

  validateForm () {    
    Array.from(this.formElement.querySelectorAll('input')).forEach((el) => {
      const error = el.nextElementSibling;
      if (!el.validity.valid) {
        if (el.validity.valueMissing) {
          error.textContent = 'Это обязательное поле';
        }

        if (el.validity.tooShort || el.validity.toLong) {
          error.textContent = 'Должно быть от 2 до 30 символов';
        }

        if (el.validity.typeMismatch) {
          error.textContent = 'Здесь должна быть ссылка';
        }
      } else {
        error.textContent = '';
      }
    });
  }

  populateForm (data) {
    const elements = this.formElement.elements;

    Object.keys(data).forEach((key) => {
      if (key in elements) {
        elements[key].value = data[key];
      }
    });
  }

  resetForm () {
    this.formElement.reset();
  }
}

class FormSubscriber extends Subscriber {
  constructor (targetForm) {
    super();

    this.targetForm = targetForm;

    this.addHandler(this.onInput);
  }

  onInput () {
    const {formElement} = this.targetForm;

    formElement.addEventListener('input', () => {
      this.targetForm.validateForm();
      this.targetForm.activateForm();
    });
  }
}

class AddCardFormSubscriber extends FormSubscriber  {
  constructor (targetForm, apiClient, cardList, callback) {
    super(targetForm);

    this.apiClient = apiClient;
    this.cardList = cardList;
    this.callback = callback;

    this.addHandler(this.onSubmit);
  }

  onSubmit () {
    const {formElement} = this.targetForm;

    formElement.addEventListener('submit', (event) => {
      event.preventDefault();

      const buttonElement = formElement.querySelector('.button');
      
      buttonElement.classList.add('load');
  
      const name = formElement.elements.name.value;
      const link = formElement.elements.link.value;

      this.apiClient.addCard({name, link}, (card) => {
        this.cardList.addCard(card);
        this.cardList.render();
  
        buttonElement.classList.remove('load');
  
        this.callback.call();
      });
    });
  }
}

class EditProfileFormSubscriber extends FormSubscriber {
  constructor (targetForm, apiClient, profile, callback) {
    super(targetForm);

    this.apiClient = apiClient;
    this.profile = profile;
    this.callback = callback;

    this.addHandler(this.onSubmit);
  }

  onSubmit () {
    const {formElement} = this.targetForm;

    formElement.addEventListener('submit', (event) => {
      event.preventDefault();

      const buttonElement = formElement.querySelector('.button');
      
      buttonElement.classList.add('load');
  
      Object.keys(this.profile.userInfo).forEach((fieldName) => {
        if (fieldName in formElement.elements) {
          const field = formElement.elements[fieldName];

          this.profile.userInfo[fieldName] = field.value;
        }
      });
      
      this.apiClient.setUserInfo(this.profile.userInfo, (userInfo) => {
        this.profile.userInfo = userInfo;
        this.profile.render();
  
        buttonElement.classList.remove('load');

        this.callback.call();
      });
    });
  }
}

class FormPopup extends Popup {
  constructor (popupElement, initialize) {
    super(popupElement, initialize);

    this.popupForm = new Form(popupElement.querySelector('form'));
  }

  close (callback) {
    super.close(callback ? callback : () => this.popupForm.resetForm());
  }
}

/**
 * Инициализация объектов
 */
const apiClient = new ApiClient();

const cardList = new CardList(document.querySelector('.places-list'), (cardList) => {
  const imagePopup = new Popup(document.querySelector('.popup__image'));

  imagePopup.subscribe();

  cardList.container.addEventListener('click', (event) => {
    const cardElement = event.target.closest('.place-card');

    if ((null !== cardElement) && cardList.cards.has(cardElement)) {
      const card = cardList.cards.get(cardElement);

      if (event.target.classList.contains('place-card__like-icon')) {
        card.like();
      }

      if (event.target.classList.contains('place-card__delete-icon')) {
        cardList.cards.delete(cardElement);
        card.remove();
      }

      if (event.target.classList.contains('place-card__image')) {
        imagePopup.open(({popupElement}) => {
          popupElement
            .querySelector('.popup__image-bg')
            .setAttribute('src', card.getImage());
        });
      }
    }
  });

  apiClient.getCards((cardListData) => {
    cardListData.forEach(cardList.addCard.bind(cardList));

    cardList.render();
  });
});

const addCardPopup = new FormPopup(document.querySelector('.popup__card-add'), (addCardPopup) => {
  addCardPopup.addHandler(({popupForm}) => {
    const addButton = document.querySelector('.user-info__button-add');

    addButton.addEventListener('click', (event) => {
      event.preventDefault();
  
      addCardPopup.open(() => popupForm.activateForm());
    });
  });

  addCardPopup.addHandler(({popupForm}) => {
    (new AddCardFormSubscriber(
      popupForm,
      apiClient,
      cardList, 
      addCardPopup.close.bind(addCardPopup)
    )).subscribe();
  });
});

addCardPopup.subscribe();

const profile = new Profile(document.querySelector('.profile'), (profile) => {
  apiClient.getUserInfo((userInfo) => {
    profile.userInfo = userInfo;
    profile.render();
  });
});

const editProfilePopup = new FormPopup(document.querySelector('.popup__profile-edit'), (editProfilePopup) => {
  editProfilePopup.addHandler(({popupForm}) => {
    const editButton = document.querySelector('.user-info__button-edit');
    editButton.addEventListener('click', (event) => {
      event.preventDefault();
  
      editProfilePopup.open(() => {
        popupForm.populateForm(profile.userInfo);
        popupForm.activateForm();
      });
    });
  });

  editProfilePopup.addHandler(({popupForm}) => {
    (new EditProfileFormSubscriber(
      popupForm,
      apiClient, 
      profile,
      editProfilePopup.close.bind(editProfilePopup)
    )).subscribe();
  });
});

editProfilePopup.subscribe();
