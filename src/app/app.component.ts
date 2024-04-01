import { Component, OnInit } from '@angular/core';
import { ProductsService } from './services/products.service';
import { Product } from './models/product';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

  emptyProduct: Product = { id: undefined, name: '', description: '', ratings: [], createdOn: new Date };
  product: Product = { ...this.emptyProduct };
  products: Product[] = [];
  productToBeEdited: Product = {...this.emptyProduct};
  showProductForm: boolean = false;
  showEditForm: boolean = false;
  searchInput = new Subject<string>();
  productRatingsInput:string = '';

  constructor(private productsService: ProductsService) { }

  ngOnInit() {
    this.getAllProducts();
    // console.log(this.product);
    this.searchProduct();
  }
  getAllProducts() {
    this.productsService.getAllProducts().
      subscribe(products => {
        this.products = products;
      });
  }

  toggleProductForm() {
    this.showProductForm = !this.showProductForm;
    this.showEditForm = false;
    this.productRatingsInput = '';
  }

  toggleEditForm(currentProduct : Product)
  {
    this.showEditForm = !this.showEditForm;
    this.showProductForm = false;
    this.productToBeEdited = {...currentProduct};
    this.productRatingsInput = currentProduct.ratings.toString();
  }

  createProduct() {
    let productRatings:number[] = [];
    this.productRatingsInput.trim().split(',').forEach(item => {
      productRatings.push(+item);
    })
    this.product.ratings = productRatings;
    this.productsService.addProduct(this.product).
      subscribe(() => this.getAllProducts());
  }

  deleteProduct(id?: string) {
    this.productsService.deleteProduct(id).subscribe(() => { this.getAllProducts() });
  }

  editProduct(productToBeEdited: Product){
    this.showEditForm = !this.showEditForm;
    let productRatings:number[] = [];
    this.productRatingsInput.trim().split(',').forEach(item => {
      productRatings.push(+item);
    });
    productToBeEdited.ratings = productRatings;
    this.productsService.editProduct(productToBeEdited).
      subscribe(()=>{
        this.getAllProducts();
      });
  }

  searchProduct(){
    this.productsService.search(this.searchInput).
      subscribe(products => this.products = products);

  }

  OrderProductsAsc(){
    this.productsService.orderProductsAsc().
      subscribe(products => {
        this.products = products;
      });
  }

  OrderProductsDesc(){
    this.productsService.orderProductsDesc().
      subscribe(products => {
        this.products = products;
      });
  }

  MostRecentProduct()
  {
    this.productsService.mostRecentProduct().
      subscribe(product => {
        this.products = [product];
      });
  }

}
