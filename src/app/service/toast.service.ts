import { Injectable, TemplateRef } from '@angular/core';

@Injectable({ 
  providedIn: 'root' 
})
export class ToastService {
  toasts: any[] = [];

  success(textOrTpl: string | TemplateRef<any>) {
    const options_success={classname: 'bg-success text-light', delay: 4000}
    this.toasts.push({ textOrTpl, ...options_success });
  }
  fail(textOrTpl: string | TemplateRef<any>) {
    const options_fail={classname: 'bg-danger text-light', delay: 4000}
    this.toasts.push({ textOrTpl, ...options_fail });
  }
  warning(textOrTpl: string | TemplateRef<any>) {
    const options_fail={classname: 'bg-danger text-light', delay: 4000}
    this.toasts.push({ textOrTpl, ...options_fail });
  }
  info(textOrTpl: string | TemplateRef<any>) {
    const options_fail={classname: 'bg-info text-light', delay: 4000}
    this.toasts.push({ textOrTpl, ...options_fail });
  }
  remove(toast: any) {
    this.toasts = this.toasts.filter(t => t !== toast);
  }
}
