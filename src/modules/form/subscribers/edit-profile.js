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

      const userInfo = Object.keys(this.profile.userInfo).reduce(
        (info, fieldName) => (
          fieldName in formElement.elements
            ? { ...info, [fieldName]: this.profile.userInfo[fieldName] }
            : info
        ),
        {},
      );

      this.apiClient.setUserInfo(userInfo, (info) => {
        this.profile.userInfo = info;
        this.profile.render();

        buttonElement.classList.remove('load');

        this.callback.call();
      });
    });
  }
}
