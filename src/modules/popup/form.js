import Form from '../form';
import Popup from './base';

export default class FormPopup extends Popup {
  constructor(popupElement, initialize) {
    super(popupElement, initialize);

    this.popupForm = new Form(popupElement.querySelector('form'));
  }

  close(callback) {
    super.close(callback || (() => this.popupForm.resetForm()));
  }
}
