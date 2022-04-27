import { environment } from './../../environments/environment';
import { Book } from './../dto/book';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SortRequest } from '../dto/sort-request';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  constructor(private httpClient: HttpClient) { }

  getListBook() {
    return this.httpClient.get<Book[]>(environment.baseUrl + 'book/get-all')
  }

  getListBookSorting(sort: SortRequest) {
    return this.httpClient.post<Book[]>(environment.baseUrl + 'book/get-all-sorting', sort)
  }

  getListBookSortingByCategory(id: number, sort: SortRequest) {
    return this.httpClient.post<Book[]>(environment.baseUrl + 'book/get-all-by-category/' + id, sort)
  }

  searchBookByName(name : string, sort: SortRequest) {
    return this.httpClient.post<Book[]>(environment.baseUrl + 'book/search/' + name, sort)
  }

  getBookById(id: number) {
    return this.httpClient.get<Book>(environment.baseUrl + 'book/get-book-info/' + id)
  }

  createBook(book: Book) {
    return this.httpClient.post(environment.baseUrl + 'book/create', book);
  }

  updateBook(book: Book) {
    return this.httpClient.put(environment.baseUrl + 'book/update', book);
  }

  deleteBook(id: number){
    return this.httpClient.put<number>(environment.baseUrl + 'book/delete', id);
  }

  checkExistBookById(id: number) {
    return this.httpClient.get<boolean>(environment.baseUrl + 'book/check-id-existed/' + id)
  }

  checkExistBookByCategoryId(id: number) {
    return this.httpClient.get<boolean>(environment.baseUrl + 'book/check-existed-in-category/' + id)
  }

  checkExistBookByName(name: string) {
    return this.httpClient.get<boolean>(environment.baseUrl + 'book/check-name-existed/' + name)
  }

}
