import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  menus = [
    {
      title: 'chung',
      type: 'header'
    },
    {
      title: 'Quản lý sách',
      icon: 'fa fa-book',
      open: true,
      type: 'dropdown',
      submenus: [
        {
          title: 'Thêm mới',
          routeLink: '/create-book'
        },
        {
          title: 'Xem danh sách',
          routeLink: '/book-dashboard'
        }
      ]
    },
    {
      title: 'Thể loại',
      icon: 'fa fa-tags',
      open: false,
      type: 'dropdown',
      submenus: [
        {
          title: 'Thêm mới',
          routeLink: '/create-category'
        },
        {
          title: 'Xem chi tiết',
          routeLink: '/category-detail/3'
        },
        {
          title: 'Xem danh sách',
          routeLink: '/category-dashboard'
        }
      ]
    },
    {
      title: 'quản lý',
      type: 'header'
    },
    {
      title: 'Kho',
      icon: 'fa fa-list',
      open: false,
      type: 'dropdown',
      submenus: [
        {
          title: 'Quản lý kho',
          routeLink: '/inventory'
        },
        {
          title: 'Nhập kho',
          routeLink: '/import-book'
        },
        {
          title: 'Xuất kho',
          routeLink: '/export-book'
        }
      ]
    },
    {
      title: 'Thống kê',
      icon: 'fa fa-bar-chart',
      routeLink: 'statistic',
      open: false,
      type: 'simple'
    },
    // {
    //   title: 'cá nhân',
    //   type: 'header'
    // },
    // {
    //   title: 'Hồ sơ cá nhân',
    //   icon: 'fa fa-user',
    //   open: false,
    //   type: 'dropdown',
    //   submenus: [
    //     {
    //       title: 'Xem thông tin',
    //       routeLink: 'account/my-account',
    //     },
    //     {
    //       title: 'Chỉnh sửa thông tin',
    //       routeLink: 'account/edit',
    //     },
    //     {
    //       title: 'Đổi mật khẩu',
    //       routeLink: 'account/change-password',
    //     }
    //   ]
    // },
    // {
    //   title: 'Đăng xuất',
    //   icon: 'fa fa-sign-out',
    //   routeLink: '/sign-out',
    //   type: 'simple'
    // }
  ];
  constructor() { }

  getMenuList() {
    return this.menus;
  }
  
}
