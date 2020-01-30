import FormSubscriber from './base';

export default class AddCardFormSubscriber extends FormSubscriber {
  constructor(targetForm, apiClient, cardList, callback) {
    super(targetForm);

    this.apiClient = apiClient;
    this.cardList = cardList;
    this.callback = callback;

    this.addHandler(this.onSubmit);
  }

  onSubmit() {
    const { formElement } = this.targetForm;

    formElement.addEventListener('submit', (event) => {
      event.preventDefault();

      const buttonElement = formElement.querySelector('.button');

      buttonElement.classList.add('load');

      const name = formElement.elements.name.value;
      const link = formElement.elements.link.value;

      this.apiClient.addCard({ name, link }, (card) => {
        this.cardList.addCard(card);
        this.cardList.render();

        buttonElement.classList.remove('load');

        this.callback.call();
      });
    });
  }
}
