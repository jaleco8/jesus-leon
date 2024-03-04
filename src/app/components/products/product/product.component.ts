import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../models/product.model';
import { map } from 'rxjs';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, CommonModule],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css',
})
export class ProductComponent {
  productForm: FormGroup;
  messageAlert: string = 'Sin mensaje';
  showAlert: boolean = false;
  colorAlert: string = 'danger';

  constructor(private productService: ProductService, private router: Router) {
    this.productForm = new FormGroup({
      id: new FormControl('', {
        validators: [Validators.required],
        asyncValidators: [this.onVerificationId()],
        updateOn: 'blur',
      }),

      name: new FormControl('', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(100),
      ]),
      description: new FormControl('', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(200),
      ]),
      logo: new FormControl('', Validators.required),
      date_release: new FormControl('', Validators.required),
      date_revision: new FormControl('', Validators.required),
    });
  }

  onVerificationId() {
    return (ctrl: AbstractControl) => {
      return this.productService
        .getProductById(ctrl.value)
        .pipe(map((isTaken) => (isTaken ? { idExists: true } : null)));
    };
  }

  agregarProducto() {
    if (this.validForm()) {
      let product = this.getProductFrom();
      this.productService.createProduct(product).subscribe({
        next: (data: any) => {
          if (data) {
            this.showMsjAlert('Producto creado con éxito 👍', 'success');
            this.productForm.reset();
            setTimeout(() => {
              this.router.navigate(['/']);
            }, 2500);
          } else {
            this.showMsjAlert('Disculpe, hubo un error inesperado 👋');
          }
        },
        error: () => {
          this.showMsjAlert('Disculpe, hubo un error inesperado 👋');
        },
      });
    }
  }

  getProductFrom(): Product {
    return {
      id: this.productForm.get('id')?.value,
      name: this.productForm.get('name')?.value,
      description: this.productForm.get('description')?.value,
      logo: this.productForm.get('logo')?.value,
      date_release: this.productForm.get('date_release')?.value,
      date_revision: this.productForm.get('date_revision')?.value,
    } as Product;
  }

  validForm() {
    if (!this.productForm.valid) {
      return false;
    }

    const dateReleaseControl = this.productForm.get('date_release');
    if (
      dateReleaseControl &&
      !this.dateReleaseValidator(dateReleaseControl as FormControl)
    ) {
      this.showMsjAlert(
        'Disculpe, la Fecha de liberación debe ser igual o mayor a la fecha actual 👋'
      );
      return false;
    }

    const dateRevisionControl = this.productForm.get('date_revision');
    if (
      dateRevisionControl &&
      !this.dateRevisionValidator(dateRevisionControl as FormControl)
    ) {
      this.showAlert = true;
      this.messageAlert =
        'Disculpe, la Fecha revisión debe ser exactamente un año posterior al la fecha de liberación 👋';
      setTimeout(() => {
        this.showAlert = false;
      }, 5000);
      return false;
    }

    return true;
  }

  dateReleaseValidator(control: FormControl): boolean {
    const dateValue = new Date(control.value);
    const today = new Date(this.dateCurrent());
    if (dateValue >= today) {
      return true;
    }
    return false;
  }

  dateRevisionValidator(control: FormControl): boolean {
    const revisionDate = new Date(`${control.value}T00:00:00`);
    const releaseControl = this.productForm.get('date_release');
    if (releaseControl) {
      const releaseDate = new Date(`${releaseControl.value}T00:00:00`);
      const releaseDateFormated = this.dateFormat(releaseDate);
      const oneYearLater = new Date(`${releaseDateFormated}T00:00:00`);
      if (revisionDate.getTime() === oneYearLater.getTime()) {
        return true;
      }
    }
    return false;
  }

  dateCurrent() {
    let fechaActual = new Date();
    let ano = fechaActual.getFullYear();
    let mes = (fechaActual.getMonth() + 1).toString().padStart(2, '0');
    let dia = fechaActual.getDate().toString().padStart(2, '0');
    let fechaFormateada = ano + '-' + mes + '-' + dia;

    return fechaFormateada;
  }

  dateFormat(releaseDate: Date) {
    let fechaActual = new Date(releaseDate);
    let ano = fechaActual.getFullYear() + 1;
    let mes = (fechaActual.getMonth() + 1).toString().padStart(2, '0');
    let dia = fechaActual.getDate().toString().padStart(2, '0');
    let fechaFormateada = ano + '-' + mes + '-' + dia;

    return fechaFormateada;
  }

  showMsjAlert(message: string, color: string = 'danger', duration: number = 5000) {
    this.showAlert = true;
    this.messageAlert = message;
    this.colorAlert = color;
    setTimeout(() => {
      this.showAlert = false;
    }, duration);
  }
}
