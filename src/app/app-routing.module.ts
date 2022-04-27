import { PageNotFoundComponent } from './component/common/page-not-found/page-not-found.component';
import { CategoryDetailComponent } from './component/category/category-detail/category-detail.component';
import { BookDashboardComponent } from './component/book/book-dashboard/book-dashboard.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoryDashboardComponent } from './component/category/category-dashboard/category-dashboard.component';
import { StatisticComponent } from './component/statistic/statistic.component';
import { BookDetailComponent } from './component/book/book-detail/book-detail.component';
import { CreateBookComponent } from './component/book/create-book/create-book.component';
import { CreateCategoryComponent } from './component/category/create-category/create-category.component';
import { UpdateBookComponent } from './component/book/update-book/update-book.component';
import { CanDeactivateGuard } from './component/common/can-deactivate/can-deactivate.guard';
import { UpdateCategoryComponent } from './component/category/update-category/update-category.component';
import { CanDeactivateFormUpdateGuard } from './component/common/can-deactivate/can-deactivate-form-update..guard';
import { InventoryComponent } from './component/inventory/inventory/inventory.component';

const routes: Routes = [
  { path: '', redirectTo: 'book-dashboard', pathMatch: 'full' },
  { path: 'book-dashboard', component: BookDashboardComponent },
  { path: 'category-dashboard', component: CategoryDashboardComponent },
  { path: 'create-book', component: CreateBookComponent, canDeactivate: [CanDeactivateGuard] },
  { path: 'update-book/:id', component: UpdateBookComponent, canDeactivate: [CanDeactivateFormUpdateGuard] },
  { path: 'book-detail/:id', component: BookDetailComponent },
  { path: 'create-category', component: CreateCategoryComponent, canDeactivate: [CanDeactivateGuard] },
  { path: 'update-category/:id', component: UpdateCategoryComponent, canDeactivate: [CanDeactivateFormUpdateGuard] },
  { path: 'category-detail/:id', component: CategoryDetailComponent },
  { path: 'inventory', component: InventoryComponent },
  { path: 'statistic', component: StatisticComponent },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
