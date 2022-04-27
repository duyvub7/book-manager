import { NgbdModalConfirm } from '../../common/modals/modal-confirm/modal-confirm.component';
import { Book } from '../../../dto/book';
import { BookService } from '../../../service/book.service';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ToastService } from 'src/app/service/toast.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { fromEvent } from 'rxjs';
import { debounceTime,  distinctUntilChanged, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { SortRequest } from 'src/app/dto/sort-request';
import { SpinnerService } from '../../common/sprinner/spinner.service';
import { Message } from 'src/app/service/message.service';
import { SweetAlertService } from '../../common/sweet-alert/sweet-alert.service';

@Component({
  selector: 'app-book-dashboard',
  templateUrl: './book-dashboard.component.html',
  styleUrls: ['./book-dashboard.component.css']
})
export class BookDashboardComponent implements OnInit, AfterViewInit {

  listBook: Book[] = []

  page = 1
  pageSize = 5
  isValidPaginatinInput = true

  sortColumnName = 'id'
  sortDesc = true

  @ViewChild('searchInput') seachInputRef!: ElementRef

  constructor(
    private bookService: BookService,
    private toastService: ToastService,
    private sweetAlertService: SweetAlertService,
    private modalService: NgbModal,
    private spinnerService: SpinnerService,
    private router: Router
  ) { }

  ngOnInit() {
    this.spinnerService.showSpinner()
    for(var toast of this.toastService.toasts) {
      this.toastService.remove(toast)
    }
    this.getListBook()
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

  getListBook() {
    this.bookService.getListBookSorting(new SortRequest(
      this.sortColumnName, this.sortDesc)).subscribe(
      data => {
        this.listBook = data
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

  refreshPage() {
    this.spinnerService.showSpinner()
    this.seachInputRef.nativeElement.value = ''
    // this.page = 1
    // this.pageSize = 5
    // this.sortColumnName = 'id'
    this.getListBook()
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
      this.getListBook()
    } else {
      this.getListBookSearching()
    }
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
          this.sweetAlertService.Warning(
            'Xác nhận xóa',
            'Bạn muốn xóa sách này: '+ name,
            'Xóa',
            () => this.deleteBook(id)
          )
        }
      }
    )
  }

  deleteBook(id: number) {
    this.bookService.deleteBook(id).subscribe(() => {
      this.sweetAlertService.Success(
        Message.DELETE_BOOK_SUCCESS,
        () => this.refreshPage()
      )
    },error => {
      this.sweetAlertService.Error()
    })
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

}

