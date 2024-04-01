import { Component, OnInit } from '@angular/core';
import { StoresService } from '../services/stores.service';
import { Store } from '../models/store';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-stores',
  templateUrl: './stores.component.html',
  styleUrl: './stores.component.scss'
})
export class StoresComponent implements OnInit {
  showEditForm: boolean = false;
  showAddForm: boolean = false;
  emptyStore: Store = { id: '', name: '', city: '', country: '', ownerName: '', monthlyIncome: 0, activeSince: new Date() };
  store: Store = { ...this.emptyStore };
  storesList: Store[] = [];
  storeToBeEdited: Store = {...this.emptyStore};
  searchInput = new Subject<string>();

  constructor(private storeService: StoresService){}

  ngOnInit(): void {
    this.getAllStores();
    this.searchStore();
  }

  revealAddForm(): void {
    this.showAddForm = !this.showAddForm;
  }

  revealEditForm(currentStore: Store): void{
    this.showEditForm = !this.showEditForm;
    this.storeToBeEdited = { ...currentStore };
  }

  getAllStores(): void{
    this.storeService.getAllStores().
      subscribe(stores => this.storesList = stores);
  }

  addStore(){
    this.storeService.addStore(this.store).
      subscribe(() => this.getAllStores());
  }

  deleteStore(id: string) {
    this.storeService.deleteStore(id).subscribe(() => { console.log('deleted store');this.getAllStores() });
  }

  editStore(storeToBeEdited: Store){
    this.showEditForm = !this.showEditForm;
    this.storeService.editStore(storeToBeEdited).
      subscribe(() => {
        this.getAllStores();
      });
  }

  orderByIncomeAsc()
  {
    this.storeService.orderByIncomeAsc().
      subscribe(stores => this.storesList = stores);
  }

  orderByIncomeDesc()
  {
    this.storeService.orderByIncomeDesc().
      subscribe(stores => this.storesList = stores);
  }

  getOldestStore()
  {
    this.storeService.getOldestStore().
      subscribe(store => this.storesList = [store]);
  }

  searchStore()
  {
    this.storeService.search(this.searchInput).
    subscribe(stores => this.storesList = stores);
  }

}
