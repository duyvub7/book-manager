import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appAutoFocus]'
})
export class AutoFocusDirective {

  constructor(private el: ElementRef) { }

  public ngAfterContentInit() {
    this.el.nativeElement.focus();
  }

  @HostListener('submit')
  onFormSubmit() {
    const invalidControl = this.el.nativeElement.querySelector('.ng-invalid');
    if (invalidControl) {
      invalidControl.focus();  
    }
  }

  @HostListener('ngModelChange', ['$event']) 
  onModelChange(value: any) {
    if (!value) {
      this.el.nativeElement.focus();
    }
  }
}
