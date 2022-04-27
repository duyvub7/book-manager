import { BookService } from '../../../service/book.service';
import { CategoryService } from '../../../service/category.service';
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Category } from '../../../dto/category';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Book } from 'src/app/dto/book';
import { ToastService } from 'src/app/service/toast.service';
import { Location } from '@angular/common';
import { FormCanDeactivate } from '../../common/form-can-deactivate/form-can-deactivate';
import { Message } from 'src/app/service/message.service';
import { Constant } from '../../common/constant/constant';

@Component({
  selector: 'app-create-book',
  templateUrl: './create-book.component.html',
  styleUrls: ['./create-book.component.css']
})
export class CreateBookComponent extends FormCanDeactivate implements OnInit {
  book: Book = new Book()
  formValue!: FormGroup;
  listCategory: Category[] = []
  currentYear= new Date().getFullYear();
  isExistedBookName: boolean = false
  formUsed = false

  @ViewChild('bookName') bookNameRef!: ElementRef;
  @ViewChild('finalBtn') finalBtnRef!: ElementRef;
  @ViewChild('form') form!: NgForm;

  constructor(
    private formBuilder: FormBuilder,
    private bookService: BookService,
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
    this.getListCategory()

    this.formValue = this.formBuilder.group({
      name: [null, [Validators.required, Validators.maxLength(100)]],
      categoryId: [null, [Validators.required]],
      author: [null, [Validators.required, Validators.pattern(Constant.REGEX_UTF8_HAS_COMMA), Validators.maxLength(100)]],
      price: [null, [Validators.required, Validators.pattern(/^[0-9]{0,}$/), Validators.min(1), Validators.max(2000000000)]],
      publishYear: [null, [Validators.required, Validators.pattern(/^[0-9]{0,}$/), Validators.min(1), Validators.max(this.currentYear)]],
      publisher: [null,[Validators.required, Validators.pattern(Constant.REGEX_UTF8), Validators.maxLength(100)] ],
      description: [null, [Validators.maxLength(1000)]]
    });   
    
  }

  clearToast() {
    for(var toast of this.toastService.toasts) {
      this.toastService.remove(toast)
    }
  }

  getListCategory() {
    this.categoryService.getListCategory().subscribe(
      data => {
        this.listCategory = data
      }, error => console.log(error)
    )
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
      this.book.name = this.formValue.value.name
      this.book.categoryId = this.formValue.value.categoryId
      this.book.author = this.formValue.value.author
      this.book.price = this.formValue.value.price
      this.book.publishYear = this.formValue.value.publishYear
      this.book.publisher = this.formValue.value.publisher
      this.book.description = this.formValue.value.description
      
      this.bookService.createBook(this.book).subscribe(() => {
        this.toastService.success(Message.ADD_BOOK_SUCCESS);
        this.formValue.reset()
        this.formUsed = false
      }, error => this.toastService.fail(Message.ADD_BOOK_FAIL))
  }

  submitFormAdd() {
    this.formUsed = true
    if(this.formValue.valid) {
      this.bookService.checkExistBookByName(this.formValue.value.name).subscribe(data => {
        this.isExistedBookName = data
        if(data === true) {
          this.clearToast() 
          this.toastService.fail(Message.DUPLICATE_BOOK_NAME)
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
    this.bookNameRef.nativeElement.focus();
  }

  onShiftTabInputName() {
    this.finalBtnRef.nativeElement.focus();
  }

  goBack() {
    this.location.back()
  }

}
