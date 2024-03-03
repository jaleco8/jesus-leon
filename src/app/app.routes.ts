import { Routes } from '@angular/router';
import { LayoutComponent } from './components/layout/layout.component';
import { ProductListComponent } from './components/products/product-list/product-list.component';
import { ProductComponent } from './components/products/product/product.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        component: ProductListComponent
      },
      {
        path: 'crear-producto',
        component: ProductComponent
      }
    ],
  }
];
