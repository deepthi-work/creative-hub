import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ProductModel } from '../../../models/product model';
import { Subscription, switchMap } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product',
  imports: [FormsModule],
  templateUrl: './product.html',
  styleUrl: './product.css',
})
export class Product implements OnInit {

  product?: ProductModel;
  selectedImage = '';
  private subscription?: Subscription;
  quantity: any = 1;

  increment(){
    this.quantity++;
  }
  decrement(){
    this.quantity--;
  }

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');

    this.http.get<ProductModel[]>('/products.json')
      .subscribe(products => {
        this.product = products.find(p => p.id === productId);
        if (this.product) {
          this.selectedImage = this.product.images[0];
        }
      });
  }

  selectImage(image: string): void {
    this.selectedImage = image;
  }
}
