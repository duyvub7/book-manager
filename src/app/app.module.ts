import { MessageValidatorComponent } from './component/message-validator/message-validator.component';
import { CreateCategoryComponent } from './component/category/create-category/create-category.component';
import { CreateBookComponent } from './component/book/create-book/create-book.component';
import { NgModule } from '@angular/core';
import { TopNavbarComponent } from './component/top-navbar/top-navbar.component';
import { BookDashboardComponent } from './component/book/book-dashboard/book-dashboard.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxSpinnerModule } from 'ngx-spinner';

import { AppComponent } from './app.component';
import { SidebarComponent } from './component/sidebar/sidebar.component';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { CategoryDashboardComponent } from './component/category/category-dashboard/category-dashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AutoFocusDirective } from './component/book/create-book/auto-focus.directive';
import { ToastsComponent } from './component/common/toast/toast.component';
import { NgbdModalConfirm } from './component/common/modals/modal-confirm/modal-confirm.component';
import { UpdateBookComponent } from './component/book/update-book/update-book.component';
import { CommonModule } from '@angular/common';
import { UpdateCategoryComponent } from './component/category/update-category/update-category.component';
import { BookDetailComponent } from './component/book/book-detail/book-detail.component';
import { CategoryDetailComponent } from './component/category/category-detail/category-detail.component';
import { NgxCurrencyModule } from 'ngx-currency';
import { InventoryComponent } from './component/inventory/inventory/inventory.component';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

@NgModule({
  declarations: [	
    AppComponent,
    SidebarComponent,
    TopNavbarComponent,
    BookDashboardComponent,
    CreateBookComponent,
    UpdateBookComponent,
    BookDetailComponent,
    CategoryDashboardComponent,
    CreateCategoryComponent,
    UpdateCategoryComponent,
    CategoryDetailComponent,
    InventoryComponent,
    MessageValidatorComponent,
    AutoFocusDirective,
    NgbdModalConfirm,
    ToastsComponent
   ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NgbModule,
    NgxCurrencyModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    PerfectScrollbarModule,
    NgxPaginationModule,
    NgxSpinnerModule
  ],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
