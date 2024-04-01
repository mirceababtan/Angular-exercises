import { HttpClient, HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { Store } from '../models/store';

@Injectable({
  providedIn: 'root'
})

export class StoresService{
    private apiUrl = 'https://localhost:44388/api/Stores';

    constructor(private http: HttpClient){}

    getAllStores():Observable<Store[]>{
        return this.http.get<Store[]>(`${this.apiUrl}/all`);
    }

    addStore(store: Store):Observable<Store>{
      return this.http.post<Store>(`${this.apiUrl}/add-store`,store);
    }

    deleteStore(id: string):Observable<Store>
    {
      return this.http.delete<Store>(`${this.apiUrl}/delete-store/${id}`);
    }

    editStore(store: Store):Observable<Store>{
      return this.http.put<Store>(`${this.apiUrl}/edit-store/${store.id}`,store);
    }

    orderByIncomeAsc(): Observable<Store[]>
    {
      return this.http.get<Store[]>(`${this.apiUrl}/sort-by-income-asc`);
    }

    orderByIncomeDesc(): Observable<Store[]>
    {
      return this.http.get<Store[]>(`${this.apiUrl}/sort-by-income-desc`);
    }

    getOldestStore(): Observable<Store>
    {
      return this.http.get<Store>(`${this.apiUrl}/oldestStore`);
    }

    search(searchInput: Observable<string>)
    {
      return searchInput.pipe(
        debounceTime(250),
        distinctUntilChanged(),
        switchMap(term => this.searchProductByKeyword(term)));
    }

    searchProductByKeyword(keyword:string) : Observable<Store[]>
    {
      if(keyword)
        return this.http.get<Store[]>(`${this.apiUrl}/searchStore?keyword=${keyword}`);
      return this.getAllStores();
    }
}