import { Location } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Category } from 'src/app/dto/category';
import { BookService } from 'src/app/service/book.service';
import { CategoryService } from 'src/app/service/category.service';
import { ToastService } from 'src/app/service/toast.service';
import { FormCanDeactivate } from '../../common/form-can-deactivate/form-can-deactivate';
import { Message } from 'src/app/service/message.service';

@Component({
  selector: 'app-update-category',
  templateUrl: './update-category.component.html',
  styleUrls: ['./update-category.component.css']
})
export class UpdateCategoryComponent extends FormCanDeactivate implements OnInit {
  category: Category = new Category()
  categoryRoot: Category = new Category()
  formValue!: FormGroup;
  currentYear= new Date().getFullYear();
  isNameDuplicate: boolean = false

  @ViewChild('name') nameRef!: ElementRef;
  @ViewChild('finalBtn') finalBtnRef!: ElementRef;
  @ViewChild('form') form!: NgForm;

  constructor(
    private formBuilder: FormBuilder,
    private routeActive: ActivatedRoute,
    private categoryService: CategoryService,
    private toastService: ToastService,
    private location: Location
  ) {
    super()
   }

  ngOnInit() {
    this.clearToast()

    this.formValue = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(1000)]]
    });

    this.getCategoryInfo()

    console.log(Message.fail);
    
  }

  clearToast() {
    for(var toast of this.toastService.toasts) {
      this.toastService.remove(toast)
    }
  }

  getCategoryInfo() {
    this.categoryService.getCategoryById(this.routeActive.snapshot.params['id']).subscribe(
      data => {
        this.categoryRoot = data
        this.setStartValue(data) 
      }, error => console.log(error)
    )
  }

  setStartValue(category: Category) {
    this.formValue.controls.name.setValue(category.name)
    this.formValue.controls.description.setValue(category.description)
  }

  isValid(key: string) {
    return this.formValue.controls[key].valid
      && (this.formValue.controls[key].dirty || this.formValue.controls[key].touched)
  }

  isInvalid(key: string) {
    return (this.formValue.controls[key].invalid
            && (this.formValue.controls[key].dirty || this.formValue.controls[key].touched))
  }

  refreshForm() {
    this.getCategoryInfo()
  }

  updateCategory() {
      this.category.id = this.categoryRoot.id
      this.category.name = this.formValue.value.name
      this.category.description = this.formValue.value.description
      this.categoryService.updateCategory(this.category).subscribe(data => {
        this.clearToast()
        this.toastService.success(Message.UPDATE_CATEGORY_SUCCESS);
        this.formValue.reset()
        this.getCategoryInfo()
      }, error => {
        this.clearToast() 
        this.toastService.fail(Message.UPDATE_CATEGORY_FAIL)
      })
  }
  
  submitFormUpdate() {
    if(this.formValue.valid) {
      this.categoryService.checkExistCategoryByName(this.formValue.value.name).subscribe(data => {
        if(data === true && this.formValue.value.name.toLowerCase() != this.categoryRoot.name.toLowerCase() ) {
          this.clearToast() 
          this.toastService.fail(Message.DUPLICATE_CATEGORY_NAME)
          this.isNameDuplicate = true
        } else {
          this.updateCategory()
          this.isNameDuplicate = data && this.formValue.value.name.toLowerCase() !== this.categoryRoot.name.toLowerCase()
        }
      }, error => {
        console.log(error)
      })
    }
  }
  
  onTabFinalButton() {
    this.nameRef.nativeElement.focus();
  }

  onShiftTabInputName() {
    this.finalBtnRef.nativeElement.focus();
  }

  goBack() {
    this.location.back()
  }

}
