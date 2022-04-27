import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { Book } from 'src/app/dto/book';
import { Category } from 'src/app/dto/category';
import { SortRequest } from 'src/app/dto/sort-request';
import { BookService } from 'src/app/service/book.service';
import { CategoryService } from 'src/app/service/category.service';
import { Message } from 'src/app/service/message.service';
import { ToastService } from 'src/app/service/toast.service';
import { NgbdModalConfirm } from '../../common/modals/modal-confirm/modal-confirm.component';
import { SpinnerService } from '../../common/sprinner/spinner.service';

@Component({
  selector: 'app-category-detail',
  templateUrl: './category-detail.component.html',
  styleUrls: ['./category-detail.component.css']
})
export class CategoryDetailComponent implements OnInit {

  currentId = -1
  listBook: Book[] = []
  listCategory: Category[] = []

  page = 1
  pageSize = 5
  isValidPaginatinInput = true

  sortColumnName = 'name'
  sortDesc = true

  @ViewChild('searchInput') seachInputRef!: ElementRef

  constructor(
    private categoryService: CategoryService,
    private bookService: BookService,
    private toastService: ToastService,
    private modalService: NgbModal,
    private spinnerService: SpinnerService,
    private routeActive: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.spinnerService.showSpinner()
    for(var toast of this.toastService.toasts) {
      this.toastService.remove(toast)
    }
    this.currentId = this.routeActive.snapshot.params['id']
    this.getListCategory()
    this.getListBook(this.routeActive.snapshot.params['id'])
  }

  ngAfterViewInit() {
    if(this.seachInputRef) {
      fromEvent(this.seachInputRef.nativeElement, 'input')
        .pipe(
          map((event: any) => (<HTMLInputElement>event.target).value.trim()),
          debounceTime(500),
          distinctUntilChanged()
        ).subscribe(
          () => {
            this.spinnerService.showSpinner()
            this.searchByName()
          }
        )
    }
  }

  getListCategory() {
    this.categoryService.getListCategory().subscribe(
      data => {
        this.listCategory = data
      }, error => console.log(error)
    )
  }

  getListBookSearching() {
    this.bookService.searchBookByName(this.seachInputRef.nativeElement.value, new SortRequest(
      this.sortColumnName, this.sortDesc)).subscribe(
      data => {
        this.listBook = data
      }, error => console.log(error)
    )
  }

  getListBook(id: number) {
    this.bookService.getListBookSortingByCategory(id, new SortRequest(
      this.sortColumnName, this.sortDesc)).subscribe(
      data => {
        this.listBook = data
      }, error => console.log(error)
    )
  }

  refreshPage() {
    this.spinnerService.showSpinner()
    this.seachInputRef.nativeElement.value = ''
    // this.page = 1
    // this.pageSize = 5
    // this.sortColumnName = 'id'
    this.getListCategory()
  }

  checkSort(value: string) {
    return value === this.sortColumnName
  }

  sortByColumn(value: string) {
    console.log(this.sortDesc);
    
    if(this.sortColumnName === value) {
      this.sortDesc = !this.sortDesc
    } else {
      this.sortColumnName = value
    }
    this.searchByName()
    
  }

  searchByName() {
    if(this.seachInputRef.nativeElement.value.trim() == '') {
      this.getListBook(this.currentId)
    } else {
      this.getListBookSearching()
    }
  }

  onChangeCategory(value: string) {
    this.router.navigate(['/category-detail/' + parseInt(value)])
    this.currentId = parseInt(value)
    this.getListBook(parseInt(value))
  }

  onClickDetail(id: number) {
    this.bookService.checkExistBookById(id).subscribe(
      data => {
        if(data === false) {
          this.openModalConfirmReload()
        } else {
          this.router.navigate(['/book-detail/'+id])
        }
      }
    )
  }

  onClickEdit(id: number) {
    this.bookService.checkExistBookById(id).subscribe(
      data => {
        if(data === false) {
          this.openModalConfirmReload()
        } else {
          this.router.navigate(['/update-book/'+id])
        }
      }
    )
  }

  onClickDelete(id: number, name: string) {
    this.bookService.checkExistBookById(id).subscribe(
      data => {
        if(data === false) {
          this.openModalConfirmReload()
        } else {
          this.openModalConfirmDelete(id, name)
        }
      }
    )
  }

  openModalConfirmDelete(id: number, name: string) {
    const modalRef = this.modalService.open(NgbdModalConfirm)
    modalRef.componentInstance.title = 'Xác nhận xóa'
    modalRef.componentInstance.quesText = 'Bạn muốn xóa thể loại này?'
    modalRef.componentInstance.name = name
    modalRef.componentInstance.confirmEvent.subscribe(() =>
      this.categoryService.deleteCategory(id).subscribe(() => {
        this.toastService.success(Message.DELETE_BOOK_SUCCESS)
        this.refreshPage()
      },error => {
        this.toastService.fail(Message.DELETE_BOOK_FAIL),
        console.log(error)
      })
    )
  }

  openModalConfirmReload() {
    const modalRef = this.modalService.open(NgbdModalConfirm)
    modalRef.componentInstance.title = 'Sách đã bị xóa'
    modalRef.componentInstance.quesText = Message.QUES_NOT_EXISTED_BOOK
    modalRef.componentInstance.btnAcceptColor = 'primary';
    modalRef.componentInstance.btnAccept = 'Tải lại';
    modalRef.componentInstance.confirmEvent.subscribe(() =>
      this.refreshPage()
    )
  }

  openModalConfirmLeave() {
    const modalRef = this.modalService.open(NgbdModalConfirm)
    modalRef.componentInstance.title = 'Rời khỏi trang'
    modalRef.componentInstance.quesText = Message.QUES_CONFIRM_EXIT_FORM
    modalRef.componentInstance.btnCancel = 'Ở lại';
    modalRef.componentInstance.btnAccept = 'Rời đi';
    modalRef.componentInstance.confirmEvent.subscribe(() =>
      this.refreshPage()
    )
  }

  checkIsInteger(value: string) {
    if(value.match(/^[0-9]{1,}$/)) {
      return true
    } else {
      return false
    }
  }

  checkInputNavigation(value: string, size: number) {
    if(value === '' || this.checkIsInteger(value) 
        && parseInt(value) > 0 && parseInt(value) <= size) {
      this.isValidPaginatinInput = true
    } else {
      this.isValidPaginatinInput = false
    }
  }

  changePage(pageNumber: string) {
    if(this.isValidPaginatinInput) {
      if(pageNumber == '') {
        this.page = 1
      } else {
        this.page = parseInt(pageNumber)
      }
    }
  }

  goToList() {
    this.router.navigate(['/category-dashboard'])
  }

}
