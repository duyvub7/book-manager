import { NgForm } from "@angular/forms";
import { ComponentCanDeactivate } from "../can-deactivate/can-deactivate";

export abstract class FormUpdateCanDeactivate extends ComponentCanDeactivate {

  abstract get form(): NgForm;
 
  canDeactivate(): boolean {
    return (this.form.submitted || !this.form.dirty)
  }

}