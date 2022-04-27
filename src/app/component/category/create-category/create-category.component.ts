import { Location } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Category } from 'src/app/dto/category';
import { CategoryService } from 'src/app/service/category.service';
import { Message } from 'src/app/service/message.service';
import { ToastService } from 'src/app/service/toast.service';
import { FormCanDeactivate } from '../../common/form-can-deactivate/form-can-deactivate';

@Component({
  selector: 'app-create-category',
  templateUrl: './create-category.component.html',
  styleUrls: ['./create-category.component.css']
})
export class CreateCategoryComponent extends FormCanDeactivate implements OnInit {

  category: Category = new Category()
  formValue!: FormGroup;
  isExistedName: boolean = false
  formUsed = false

  @ViewChild('categoryName') categoryNameRef!: ElementRef;
  @ViewChild('finalBtn') finalBtnRef!: ElementRef;
  @ViewChild('form') form!: NgForm;

  constructor(
    private formBuilder: FormBuilder,
    private categoryService: CategoryService,
    private toastService: ToastService,
    private location: Location
  ) { 
    super()
  }

  ngOnInit() {
    for(var toast of this.toastService.toasts) {
      this.toastService.remove(toast)
    }

    this.formValue = this.formBuilder.group({
      name: [null, [Validators.required, Validators.maxLength(100)]],
      description: [null, [Validators.maxLength(1000)]]
    });
  }

  clearToast() {
    for(var toast of this.toastService.toasts) {
      this.toastService.remove(toast)
    }
  }

  setStartValue() {
    Object.keys(this.formValue.controls).forEach(key => {
      if(this.formValue.controls[key].value === null) {
        this.formValue.controls[key].setValue('')
      }
    });
  }

  isValid(key: string) {
    return this.formValue.controls[key].valid
      && (this.formValue.controls[key].dirty || this.formValue.controls[key].touched)
  }

  isInvalid(key: string) {
    return (this.formValue.controls[key].invalid
            && (this.formValue.controls[key].dirty || this.formValue.controls[key].touched))
          || (this.formValue.controls[key].invalid && this.formUsed)
  }

  addBook() {
      this.category.name = this.formValue.value.name
      this.category.description = this.formValue.value.description
      
      this.categoryService.createCategory(this.category).subscribe(() => {
        this.toastService.success(Message.DELETE_CATEGORY_SUCCESS);
        this.formValue.reset()
        this.formUsed = false
      }, error => this.toastService.fail(Message.DELETE_CATEGORY_FAIL))
  }

  submitFormAdd() {
    this.formUsed = true
    if(this.formValue.valid) {
      this.categoryService.checkExistCategoryByName(this.formValue.value.name).subscribe(data => {
        this.isExistedName = data
        if(data === true) {
          this.clearToast() 
          this.toastService.fail(Message.DUPLICATE_CATEGORY_NAME)
        } else {
          this.addBook()
        }
      }, error => {
        console.log(error)
      })
    }
    this.setStartValue()
  }

  resetForm() {
    this.formValue.reset()
    this.formUsed = false
  }
  
  onTabFinalButton() {
    this.categoryNameRef.nativeElement.focus();
  }

  onShiftTabInputName() {
    this.finalBtnRef.nativeElement.focus();
  }

  goBack() {
    this.location.back()
  }

}
