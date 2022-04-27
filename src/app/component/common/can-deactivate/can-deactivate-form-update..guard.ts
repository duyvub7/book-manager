import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { FormUpdateCanDeactivate } from '../form-can-deactivate/form-update-can-deactivate';
import { ComponentCanDeactivate } from './can-deactivate';

@Injectable({
  providedIn: "root"
})
export class CanDeactivateFormUpdateGuard implements CanDeactivate<ComponentCanDeactivate> {
  canDeactivate(component: FormUpdateCanDeactivate): boolean {
    if(!component.canDeactivate()){
        if (confirm("Thao tác của bạn chưa được lưu. Bạn chắc chắn muốn rời đi?")) {
          return true;
        } else {
          return false;
        }
    }
    return true;
  }
}