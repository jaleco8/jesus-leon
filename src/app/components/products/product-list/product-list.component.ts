import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css',
})
export class ProductListComponent implements OnInit {
  constructor(private router: Router, private productService: ProductService) {}

  listProducts: any;

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.productService.getProducts().subscribe({
      next: (data: any) => {
        this.listProducts = data;
      },
      error: () => {
        console.log('error');
      },
    });
  }

  addProduct() {
    this.router.navigate(['/crear-producto']);
  }
}
