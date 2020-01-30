export default class Form {
  constructor(formElement) {
    this.formElement = formElement;
  }

  activateForm() {
    const popupButton = this.formElement.querySelector('.popup__button');
    const isFullFilled = Array.from(this.formElement.querySelectorAll('input')).reduce((acc, el) => acc && el.validity.valid, true);

    if (!isFullFilled) {
      popupButton.setAttribute('disabled', true);
      popupButton.classList.remove('popup__button_active');
    } else {
      popupButton.removeAttribute('disabled');
      popupButton.classList.add('popup__button_active');
    }
  }

  validateForm() {
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

  populateForm(data) {
    const { elements } = this.formElement;

    Object.keys(data).forEach((key) => {
      if (key in elements) {
        elements[key].value = data[key];
      }
    });
  }

  resetForm() {
    this.formElement.reset();
  }
}
