import { Subscriber } from "../../core"

export default class FormSubscriber extends Subscriber {
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
