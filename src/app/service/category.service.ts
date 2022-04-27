import { Category } from './../dto/category';
import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SortRequest } from '../dto/sort-request';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private httpClient: HttpClient) { }

  getListCategory() {
    return this.httpClient.get<Category[]>(environment.baseUrl + 'category/get-all')
  }

  getListCategorySorting(sort: SortRequest) {
    return this.httpClient.post<Category[]>(environment.baseUrl + 'category/get-all-sorting', sort)
  }

  searchCategoryByName(name : string, sort: SortRequest) {
    return this.httpClient.post<Category[]>(environment.baseUrl + 'category/search/' + name, sort)
  }

  getCategoryById(id: number) {
    return this.httpClient.get<Category>(environment.baseUrl + 'category/get-category-info/' + id)
  }

  createCategory(category: Category) {
    return this.httpClient.post(environment.baseUrl + 'category/create', category);
  }

  updateCategory(category: Category) {
    return this.httpClient.put(environment.baseUrl + 'category/update', category);
  }

  deleteCategory(id: number){
    return this.httpClient.delete<number>(environment.baseUrl + 'category/delete/' + id);
  }

  checkExistCategoryById(id: number) {
    return this.httpClient.get<boolean>(environment.baseUrl + 'category/check-id-existed/' + id)
  }

  checkExistCategoryByName(name: string) {
    return this.httpClient.get<boolean>(environment.baseUrl + 'category/check-name-existed/' + name)
  }

}
