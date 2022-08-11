import { Component, OnInit } from '@angular/core';
import { Product } from './../../models/product.model';
import { ProductsService } from './../../services/products.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];

  constructor(private _productsService: ProductsService) {}

  ngOnInit(): void {
    this.getAllProducts();
  }

  getAllProducts() {
    this._productsService.getAllsSimple().subscribe((products) => {
      this.products = products;
    });
  }
}
