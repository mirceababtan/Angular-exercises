import { HttpClient, HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private apiUrl = 'https://localhost:44388/api/Products';

  constructor(private http:HttpClient) { }

  getAllProducts(): Observable<Product[]>{
    return this.http.get<Product[]>(`${this.apiUrl}/all`);
  }

  addProduct(product:Product): Observable<Product>{
    return this.http.post<Product>(`${this.apiUrl}/add-product`,product)
  }

  editProduct(product:Product):Observable<any>{
    return this.http.put<Product>(`${this.apiUrl}/edit-product/${product.id}`,product);
  }

  deleteProduct(id?:string) : Observable<any>
  {
    return this.http.delete(`${this.apiUrl}/delete-product/${id}`);
  }

  search(searchInput: Observable<string>)
  {
    return searchInput.pipe(
      debounceTime(250),
      distinctUntilChanged(),
      switchMap(term => this.searchProductByKeyword(term)));
  }

  searchProductByKeyword(keyword:string) : Observable<Product[]>
  {
    if(keyword)
      return this.http.get<Product[]>(`${this.apiUrl}/search-by-keyword?keyword=${keyword}`);
    return this.getAllProducts();
  }

  orderProductsAsc():Observable<Product[]>
  {
    return this.http.get<Product[]>(`${this.apiUrl}/sort-by-rating-asc`);
  }

  orderProductsDesc():Observable<Product[]>
  {
    return this.http.get<Product[]>(`${this.apiUrl}/sort-by-rating-desc`);
  }

  mostRecentProduct():Observable<Product>
  {
    return this.http.get<Product>(`${this.apiUrl}/most-recent-product`);
  }


}
