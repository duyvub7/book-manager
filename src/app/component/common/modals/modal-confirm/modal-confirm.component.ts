import { Input, Component, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ngbd-modal-confirm',
  template: `
    <div class="modal-header">
      <h4 class="modal-title">{{title}}</h4>
      <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss('Cross click')">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
      <p>{{quesText}}</p>
      <p class="text-primary word-break">{{name}}</p>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-outline-dark" (click)="activeModal.close('Close click')">
        {{ btnCancel? btnCancel: 'Hủy'}}
      </button>
      <button type="button" class="btn btn-outline-{{btnAcceptColor? btnAcceptColor : 'danger'}}" 
        (click)="deleteItem()">
        {{ btnAccept? btnAccept: 'Xóa'}}
      </button>
    </div>
  `,
  styles: [`
    .word-break {
      word-break: break-all;
    }
  `]
})
export class NgbdModalConfirm {
  @Input() title: any;
  @Input() quesText: any;
  @Input() name: any;
  @Input() btnCancel: any;
  @Input() btnAcceptColor: any;
  @Input() btnAccept: any;
  @Output() confirmEvent: EventEmitter<number> = new EventEmitter<number>();

  constructor(public activeModal: NgbActiveModal) {}

  deleteItem() {
    this.confirmEvent.emit()
    this.activeModal.close('Close click')
  }
}