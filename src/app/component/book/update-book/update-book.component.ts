import { Location } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Book } from 'src/app/dto/book';
import { Category } from 'src/app/dto/category';
import { BookService } from 'src/app/service/book.service';
import { CategoryService } from 'src/app/service/category.service';
import { ToastService } from 'src/app/service/toast.service';
import { Message } from 'src/app/service/message.service';
import { FormUpdateCanDeactivate } from '../../common/form-can-deactivate/form-update-can-deactivate';
import { Constant } from '../../common/constant/constant';
import { SweetAlertService } from '../../common/sweet-alert/sweet-alert.service';

@Component({
  selector: 'app-update-book',
  templateUrl: './update-book.component.html',
  styleUrls: ['./update-book.component.css']
})
export class UpdateBookComponent extends FormUpdateCanDeactivate implements OnInit {
  bookRoot: Book = new Book()
  book: Book = new Book()
  formValue!: FormGroup;
  listCategory: Category[] = []
  currentYear= new Date().getFullYear();
  isBookNameDuplicate: boolean = false

  @ViewChild('bookName') bookNameRef!: ElementRef;
  @ViewChild('finalBtn') finalBtnRef!: ElementRef;
  @ViewChild('form') form!: NgForm;

  constructor(
    private formBuilder: FormBuilder,
    private routeActive: ActivatedRoute,
    private bookService: BookService,
    private categoryService: CategoryService,
    private toastService: ToastService,
    private sweetAlertService: SweetAlertService,
    private location: Location
  ) {
    super()
   }

  ngOnInit() {
    this.clearToast()

    this.formValue = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      categoryId: ['', [Validators.required]],
      author: ['', [Validators.required, Validators.pattern(Constant.REGEX_UTF8_HAS_COMMA), Validators.maxLength(100)]],
      price: ['', [Validators.required, Validators.pattern(/^[0-9]{0,}$/), Validators.min(1), Validators.max(2000000000)]],
      publishYear: ['', [Validators.required, Validators.pattern(/^[0-9]{0,}$/), Validators.min(1), Validators.max(this.currentYear)]],
      publisher: ['',[Validators.required, Validators.pattern(Constant.REGEX_UTF8), Validators.maxLength(100)] ],
      description: ['', [Validators.maxLength(1000)]]
    });

    this.getBookInfo()
    this.getListCategory()

  }

  clearToast() {
    for(var toast of this.toastService.toasts) {
      this.toastService.remove(toast)
    }
  }

  getBookInfo() {
    this.bookService.getBookById(this.routeActive.snapshot.params['id']).subscribe(
      data => {
        this.bookRoot = data
        this.setStartValue(data) 
      }, error => console.log(error)
    )
  }

  getListCategory() {
    this.categoryService.getListCategory().subscribe(
      data => {
        this.listCategory = data
      }, error => console.log(error)
    )
  }

  setStartValue(book: Book) {
    this.formValue.controls.name.setValue(book.name)
    this.formValue.controls.categoryId.setValue(book.categoryId)
    this.formValue.controls.author.setValue(book.author)
    this.formValue.controls.price.setValue(book.price)
    this.formValue.controls.publisher.setValue(book.publisher)
    this.formValue.controls.publishYear.setValue(book.publishYear)
    this.formValue.controls.description.setValue(book.description)
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
    this.getBookInfo()
  }

  updateBook() {
      this.book.id = this.bookRoot.id
      this.book.name = this.formValue.value.name
      this.book.categoryId = this.formValue.value.categoryId
      this.book.author = this.formValue.value.author
      this.book.price = this.formValue.value.price
      this.book.publishYear = this.formValue.value.publishYear
      this.book.publisher = this.formValue.value.publisher
      this.book.description = this.formValue.value.description
      this.bookService.updateBook(this.book).subscribe(data => {
        if(data === true) {
          this.sweetAlertService.Success(Message.UPDATE_BOOK_SUCCESS)
          this.formValue.reset()
          this.getBookInfo()
        } else {
          this.sweetAlertService.Fail(Message.UPDATE_BOOK_FAIL)
        }
      }, error => {
        this.sweetAlertService.Error()
      })
  }
  
  submitFormUpdate() {
    if(this.formValue.valid) {
      this.bookService.checkExistBookByName(this.formValue.value.name).subscribe(data => {
        if(data === true && this.formValue.value.name.toLowerCase() != this.bookRoot.name.toLowerCase() ) {
          this.clearToast() 
          this.toastService.fail(Message.DUPLICATE_BOOK_NAME)
          this.isBookNameDuplicate = true
        } else {
          this.updateBook()
          this.isBookNameDuplicate = data && this.formValue.value.name.toLowerCase() !== this.bookRoot.name.toLowerCase()
        }
      }, error => {
        console.log(error)
      })
    }
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
