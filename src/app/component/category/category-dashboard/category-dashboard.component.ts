import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { Category } from 'src/app/dto/category';
import { SortRequest } from 'src/app/dto/sort-request';
import { BookService } from 'src/app/service/book.service';
import { CategoryService } from 'src/app/service/category.service';
import { ToastService } from 'src/app/service/toast.service';
import { NgbdModalConfirm } from '../../common/modals/modal-confirm/modal-confirm.component';
import { SpinnerService } from '../../common/sprinner/spinner.service';
import { Message } from 'src/app/service/message.service';

@Component({
  selector: 'app-category-dashboard',
  templateUrl: './category-dashboard.component.html',
  styleUrls: ['./category-dashboard.component.css']
})
export class CategoryDashboardComponent implements OnInit, AfterViewInit {

  listCategory: Category[] = []

  page = 1
  pageSize = 5
  isValidPaginatinInput = true

  sortColumnName = 'id'
  sortDesc = true

  @ViewChild('searchInput') seachInputRef!: ElementRef

  constructor(
    private categoryService: CategoryService,
    private bookService: BookService,
    private toastService: ToastService,
    private modalService: NgbModal,
    private spinnerService: SpinnerService,
    private router: Router
  ) { }

  ngOnInit() {
    this.spinnerService.showSpinner()
    for(var toast of this.toastService.toasts) {
      this.toastService.remove(toast)
    }
    this.getListCategory()
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
    this.categoryService.getListCategorySorting(new SortRequest(
      this.sortColumnName, this.sortDesc)).subscribe(
      data => {
        this.listCategory = data
      }, error => console.log(error)
    )
  }

  getListCategorySearching() {
    this.categoryService.searchCategoryByName(this.seachInputRef.nativeElement.value, new SortRequest(
      this.sortColumnName, this.sortDesc)).subscribe(
      data => {
        this.listCategory = data
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
      this.getListCategory()
    } else {
      this.getListCategorySearching()
    }
  }

  onClickDetail(id: number) {
    this.categoryService.checkExistCategoryById(id).subscribe(
      data => {
        if(data === false) {
          this.openModalConfirmReload()
        } else {
          this.router.navigate(['/category-detail/'+id])
        }
      }
    )
  }

  onClickEdit(id: number) {
    this.categoryService.checkExistCategoryById(id).subscribe(
      data => {
        if(data === false) {
          this.openModalConfirmReload()
        } else {
          this.router.navigate(['/update-category/'+id])
        }
      }
    )
  }

  onClickDelete(id: number, name: string) {
    this.categoryService.checkExistCategoryById(id).subscribe(
      data => {
        if(data === false) {
          this.openModalConfirmReload()
        } else {
          this.checkExistedBook(id, name)
        }
      }
    )
  }

  checkExistedBook(id: number, name: string) {
    this.bookService.checkExistBookByCategoryId(id).subscribe(
      data => {
        if(data === true) {
          this.openDialogExistedBook(id, name)
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
        this.toastService.success(Message.DELETE_CATEGORY_SUCCESS)
        this.refreshPage()
      },error => {
        this.toastService.fail(Message.DELETE_CATEGORY_FAIL),
        console.log(error)
      })
    )
  }

  openDialogExistedBook(id: number, name: string) {
    const modalRef = this.modalService.open(NgbdModalConfirm)
    modalRef.componentInstance.title = 'Không thể xóa'
    modalRef.componentInstance.quesText = Message.QUES_VIEW_BOOK_BY_CATEGORY
    modalRef.componentInstance.btnAcceptColor = 'primary';
    modalRef.componentInstance.btnAccept = 'Xem';
    modalRef.componentInstance.confirmEvent.subscribe(() =>
      this.router.navigate(['/category-detail/'+id])
    )
  }

  openModalConfirmReload() {
    const modalRef = this.modalService.open(NgbdModalConfirm)
    modalRef.componentInstance.title = 'Thể loại đã bị xóa'
    modalRef.componentInstance.quesText = Message.QUES_NOT_EXISTED_CATEGORY
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
