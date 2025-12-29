import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Header } from '../header/header';
import { Router, NavigationEnd } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ProductModel } from '../../../models/product model';
import { Subscription, filter } from 'rxjs';

@Component({
  selector: 'app-store',
  imports: [FormsModule, Header],
  templateUrl: './store.html',
  styleUrl: './store.css',
})
export class Store implements OnInit, OnDestroy {

  products: ProductModel[] = [];
  categories = ['All', 'Clay', 'Crochet', 'Glass Paintings', 'Jharokhas', 'Lippan Art', 'Canvases', 'Resin Art'];

  selectedCategory = 'All';
  filteredProducts: ProductModel[] = [];

  sortOption = 'default';
  private routerSubscription?: Subscription;

  constructor(
    private router: Router,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.http.get<ProductModel[]>('/products.json').subscribe(products => {
        this.products = products;
        this.applyFiltersAndSort();
      });
      
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  private loadProducts(): void {
    this.http.get<ProductModel[]>('/products.json').subscribe({
      next: (products) => {
        this.products = products;
        this.applyFiltersAndSort();
      }
    });
  }

  getProductCategory(product: ProductModel): string {
    const name = product.name.toLowerCase();
    if (name.includes('clay')) return 'Clay';
    if (name.includes('crochet')) return 'Crochet';
    if (name.includes('glass')) return 'Glass Paintings';
    if (name.includes('jharokha')) return 'Jharokhas';
    if (name.includes('lippan')) return 'Lippan Art';
    if (name.includes('canvas') || name.includes('painting')) return 'Canvases';
    if (name.includes('resin')) return 'Resin Art';
    return 'All';
  }

  filterByCategory(cat: string) {
    this.selectedCategory = cat;
    this.applyFiltersAndSort();
  }

  sortImages() {
    this.applyFiltersAndSort();
  }

  private applyFiltersAndSort(): void {
    // First apply category filter
    let result: ProductModel[];
    if (this.selectedCategory === 'All') {
      result = [...this.products];
    } else {
      result = this.products.filter(product => 
        this.getProductCategory(product) === this.selectedCategory
      );
    }

    // Then apply sorting
    if (this.sortOption === 'asc') {
      this.filteredProducts = result.sort((a, b) =>
        a.name.localeCompare(b.name)
      );
    } else if (this.sortOption === 'desc') {
      this.filteredProducts = result.sort((a, b) =>
        b.name.localeCompare(a.name)
      );
    } else {
      // Default: no sorting, just use filtered results
      this.filteredProducts = result;
    }
  }

  openProduct(product: ProductModel) {
    this.router.navigate(['/store', product.id]);
  }

  getThumbnail(product: ProductModel): string {
    return product.images[0] || '';
  }

}