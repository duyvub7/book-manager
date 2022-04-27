import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { Book } from 'src/app/dto/book';
import { SortRequest } from 'src/app/dto/sort-request';
import { BookService } from 'src/app/service/book.service';
import { Message } from 'src/app/service/message.service';
import { NgbdModalConfirm } from '../../common/modals/modal-confirm/modal-confirm.component';
import { SpinnerService } from '../../common/sprinner/spinner.service';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent implements OnInit {

  listBook: Book[] = []

  page = 1
  pageSize = 5
  isValidPaginatinInput = true

  sortColumnName = 'name'
  sortDesc = true

  @ViewChild('searchInput') seachInputRef!: ElementRef

  constructor(
    private bookService: BookService,
    private modalService: NgbModal,
    private spinnerService: SpinnerService,
    private router: Router
  ) { }

  ngOnInit() {
    this.spinnerService.showSpinner()
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

  getListBookSearching() {
    this.bookService.searchBookByName(this.seachInputRef.nativeElement.value, new SortRequest(
      this.sortColumnName, this.sortDesc)).subscribe(
      data => {
        this.listBook = data
      }, error => console.log(error)
    )
  }

  getListBook() {
    this.bookService.getListBookSorting(new SortRequest(
      this.sortColumnName, this.sortDesc)).subscribe(
      data => {
        this.listBook = data
      }, error => console.log(error)
    )
  }

  refreshPage() {
    this.spinnerService.showSpinner()
    this.seachInputRef.nativeElement.value = ''
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
