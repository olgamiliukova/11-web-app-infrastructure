import FormSubscriber from './base';

export default class EditProfileFormSubscriber extends FormSubscriber {
  constructor(targetForm, apiClient, profile, callback) {
    super(targetForm);

    this.apiClient = apiClient;
    this.profile = profile;
    this.callback = callback;

    this.addHandler(this.onSubmit);
  }

  onSubmit() {
    const { formElement } = this.targetForm;

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
