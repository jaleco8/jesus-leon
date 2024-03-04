import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, CommonModule],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css',
})
export class ProductComponent {
  productForm: FormGroup;
  messageAlert: string = '';
  showAlert: boolean = false;

  constructor() {
    this.productForm = new FormGroup({
      id: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(10),
      ]),
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

  agregarProducto() {
    // Validar que el formulario sea válido
    if (this.validForm()) {
      // Enviar el formulario
      console.log(this.productForm.value);
    } else {
      // Mostrar mensaje de error
      console.log('Formulario inválido');
    }
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
      this.showAlert = true;
      this.messageAlert =
        'Disculpe, la Fecha de liberación debe ser igual o mayor a la fecha actual 👋';
      setTimeout(() => {
        this.showAlert = false;
      }, 5000);
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
}
