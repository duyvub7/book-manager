import { Injectable } from "@angular/core";
import Swal from 'sweetalert2';

@Injectable({
  providedIn: "root"
})
export class SweetAlertService {

  constructor() { }
  
  ShowToastSuccess(text: string) {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })
    
    Toast.fire({
      icon: 'success',
      title: text
    })
  }

  Success(text: string, methodInner?: any) {
    Swal.fire({
      icon: 'success',
      title: text
    }).then((result) => {
      if (result.isConfirmed) {
        if(methodInner) {
          methodInner()
        }
      }
    })
  }

  Fail(text: string) {
    Swal.fire({
      icon: 'error',
      title: text
    })
  }

  Error() {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Đã có lỗi xảy ra!'
    })
  }

  Warning(title: string, text: string, btnAccept: string, method: any) {
    Swal.fire({
      title: title,
      text: text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: btnAccept,
      cancelButtonColor: 'rgb(141 137 137)',
      cancelButtonText: 'Hủy'
    }).then((result) => {
      if (result.isConfirmed) {
        method()
      }
    })
  }

}