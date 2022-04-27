import { MessageValidateService } from '../../service/message-validator.service';
import { Component, Input } from '@angular/core';


@Component({
  selector: 'message-validator',
  template: `<div class="invalid-message" *ngIf="errorMessage !== null">{{errorMessage}}</div>`
})
export class MessageValidatorComponent {
  @Input() control: any;
  @Input() field!: string;

  constructor() { }

  get errorMessage() {
    for (let propertyName in this.control.errors) {
      if (this.control.errors.hasOwnProperty(propertyName)) {
        return MessageValidateService.getValidatorMessage(this.field, propertyName, this.control.errors[propertyName]);
      }
    }
    return null;
  }
}