import { NgForm } from "@angular/forms";
import { ComponentCanDeactivate } from "../can-deactivate/can-deactivate";

export abstract class FormCanDeactivate extends ComponentCanDeactivate {

  abstract get form(): NgForm;
 
  canDeactivate(): boolean {
    return this.form.submitted || !this.form.dirty || this.checkNotEmpty()
  }

  checkNotEmpty() {
    let check = true
    Object.keys(this.form.value).map(
      item => {
        if(this.form.value[item] !== null
        && (typeof this.form.value[item] === 'object'
        || (typeof this.form.value[item] === 'string' && this.form.value[item].trim() !== '')
        || (typeof this.form.value[item] === 'number' && this.form.value[item] !== 0))) {
          check = false
        }
      })
    return check
  }
}