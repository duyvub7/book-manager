import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { FormCanDeactivate } from '../form-can-deactivate/form-can-deactivate';
import { ComponentCanDeactivate } from './can-deactivate';

@Injectable({
  providedIn: "root"
})
export class CanDeactivateGuard implements CanDeactivate<ComponentCanDeactivate> {
  canDeactivate(component: FormCanDeactivate): boolean {
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