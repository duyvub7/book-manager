import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Book } from 'src/app/dto/book';
import { BookService } from 'src/app/service/book.service';
import { Message } from 'src/app/service/message.service';
import { ToastService } from 'src/app/service/toast.service';
import { NgbdModalConfirm } from '../../common/modals/modal-confirm/modal-confirm.component';

@Component({
  selector: 'app-book-detail',
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.css']
})
export class BookDetailComponent implements OnInit {

  id: number = -1;
  book: Book = new Book()

  constructor(
    private bookService: BookService,
    private routeActive: ActivatedRoute,
    private toastService: ToastService,
    private modalService: NgbModal,
    private router: Router
  ) { }

  ngOnInit() {
    this.id = this.routeActive.snapshot.params['id']
    this.getBook(this.id)
  }

  getBook(id: number) {
    this.bookService.getBookById(id).subscribe(
      data => {
        this.book = data
      }, error => console.log(error)
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

  onClickDelete(id: number) {
    this.bookService.checkExistBookById(id).subscribe(
      data => {
        if(data === false) {
          this.openModalConfirmReload()
        } else {
          this.openModalConfirmDelete(id)
        }
      }
    )
  }

  openModalConfirmDelete(id: number) {
    const modalRef = this.modalService.open(NgbdModalConfirm)
    modalRef.componentInstance.title = 'Xác nhận xóa'
    modalRef.componentInstance.quesText = 'Bạn muốn xóa sách này?'
    modalRef.componentInstance.confirmEvent.subscribe(() =>
      this.bookService.deleteBook(id).subscribe(() => {
        this.openModalConfirmLeave()
      },error => {
        this.toastService.fail(Message.DELETE_BOOK_FAIL),
        console.log(error)
        
      })
    )
  }

  openModalConfirmLeave() {
    const modalRef = this.modalService.open(NgbdModalConfirm)
    modalRef.componentInstance.title = 'Xóa thành công'
    modalRef.componentInstance.quesText = Message.QUES_AFTER_DELETE_BOOK_DETAIL
      modalRef.componentInstance.btnCancel = 'Ở lại';
    modalRef.componentInstance.btnAcceptColor = 'primary';
    modalRef.componentInstance.btnAccept = 'Rời đi';
    modalRef.componentInstance.confirmEvent.subscribe(() =>
      this.router.navigate(['/book-dashboard'])
    )
  }

  openModalConfirmReload() {
    const modalRef = this.modalService.open(NgbdModalConfirm)
    modalRef.componentInstance.title = 'Sách đã bị xóa'
    modalRef.componentInstance.quesText = Message.QUES_NOT_EXISTED_BOOK_DETAIL
    modalRef.componentInstance.btnAcceptColor = 'primary';
    modalRef.componentInstance.btnAccept = 'Đồng ý';
    modalRef.componentInstance.confirmEvent.subscribe(() =>
      this.router.navigate(['/book-dashboard'])
    )
  }

  goToList() {
    this.router.navigate(['/book-dashboard'])
  }

}
