import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { CommonModule } from '@angular/common';
import { Product } from '../../../models/product.model';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, NgxSkeletonLoaderModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css',
})
export class ProductListComponent implements OnInit {
  constructor(private router: Router, private productService: ProductService) {}

  listProducts: Product[] = [];
  filteredProducts: Product[] = [];

  rowsPerPage: number = 5;
  currentPage: number = 1;
  totalPages: number = Math.ceil(this.listProducts.length / this.rowsPerPage);
  isLoading: boolean = true;

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.productService.getProducts().subscribe({
      next: (data: Product[]) => {
        this.listProducts = data;
        this.filteredProducts = data;
        this.totalPages = Math.ceil(
          this.listProducts.length / this.rowsPerPage
        );
        this.updatePagination();
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        console.log('error');
      },
    });
  }

  addProduct() {
    this.router.navigate(['/crear-producto']);
  }

  isValidUrl(url: string): boolean {
    const pattern = new RegExp(
      '^(https?:\\/\\/)?' +
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' +
        '((\\d{1,3}\\.){3}\\d{1,3}))' +
        '(\\:\\d+)?' +
        '(\\/[-a-z\\d%_.~+]*)*' +
        '(\\?[;&a-z\\d%_.~+=-]*)?' +
        '(\\#[-a-z\\d_]*)?$',
      'i'
    );
    return !!pattern.test(url);
  }

  filterProducts(event: any) {
    if (!event.target.value) {
      this.filteredProducts = this.listProducts;
      this.totalPages = Math.ceil(this.listProducts.length / this.rowsPerPage);
      this.updatePagination();
    } else {
      if (event.target.value.length > 3) {
        this.filteredProducts = this.listProducts.filter((product) =>
          product.name.toLowerCase().includes(event.target.value.toLowerCase())
        );
      }
    }
  }

  updateRows(event: any) {
    this.rowsPerPage = Number(event.target.value);
    this.totalPages = Math.ceil(this.listProducts.length / this.rowsPerPage);
    this.currentPage = 1;
    this.updatePagination();
  }

  updatePagination() {
    const start = (this.currentPage - 1) * this.rowsPerPage;
    const end = start + this.rowsPerPage;
    this.filteredProducts = this.listProducts.slice(start, end);
  }
}
