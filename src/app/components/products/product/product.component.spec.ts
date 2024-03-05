import {
  ComponentFixture,
  TestBed,
  tick,
  fakeAsync,
} from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ProductComponent } from './product.component';
import { ProductService } from '../../../services/product.service';
import { of, throwError } from 'rxjs';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { Product } from '../../../models/product.model';

describe('ProductComponent', () => {
  let component: ProductComponent;
  let fixture: ComponentFixture<ProductComponent>;
  const productServiceSpy = jasmine.createSpyObj('ProductService', [
    'createProduct',
  ]);
  const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
  let productService: ProductService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductComponent, HttpClientTestingModule],
      providers: [
        { provide: ProductService, useValue: productServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: convertToParamMap({ id: 'trj-crd-1' }) } } }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductComponent);
    component = fixture.componentInstance;
    productService = TestBed.inject(ProductService);
    router = TestBed.inject(Router);
  });

  it('debería crearse', () => {
    expect(component).toBeTruthy();
  });

  it('no debería llamar a createProduct si el formulario no es válido', () => {
    spyOn(component, 'validForm').and.returnValue(false);
    spyOn(productService, 'createProduct');

    component.agregarProducto();

    expect(productService.createProduct).not.toHaveBeenCalled();
  });

  it('debería llamar a createProduct si el formulario es válido', () => {
    spyOn(component, 'validForm').and.returnValue(true);
    spyOn(productService, 'createProduct').and.returnValue(of(true));
    const product = {
      id: 'trj-crd-1',
      name: 'Test',
      description: 'Tarjet',
      logo: '',
      date_release: new Date('2024-02-10'),
      date_revision: new Date('2025-02-10'),
    } as Product;
    spyOn(component, 'getProductFrom').and.returnValue(product);

    component.agregarProducto();

    expect(productService.createProduct).toHaveBeenCalledWith(product);
  });

  it('debería mostrar un mensaje de éxito y navegar a inicio si la creación del producto es exitosa', fakeAsync(() => {
    spyOn(component, 'validForm').and.returnValue(true);
    spyOn(productService, 'createProduct').and.returnValue(of(true));
    const product = {
      id: 'trj-crd-9',
      name: 'Test9',
      description: 'Tarjeta de consumo de la modalidad de credito',
      logo: 'Sin Logo',
      date_release: new Date('2024-02-10'),
      date_revision: new Date('2025-02-10'),
    } as Product;
    spyOn(component, 'getProductFrom').and.returnValue(product);
    spyOn(component, 'showMsjAlert');

    component.agregarProducto();

    tick(2500);

    expect(component.showMsjAlert).toHaveBeenCalledWith(
      'Producto creado con éxito 👍',
      'success'
    );
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  }));

  it('debería mostrar un mensaje de error si la creación del producto falla', () => {
    spyOn(component, 'validForm').and.returnValue(true);
    spyOn(productService, 'createProduct').and.returnValue(throwError('error'));
    const product = {
      id: 'trj-crd-1',
      name: 'Test8',
      description: 'Tarjeta de consumo de la modalidad de credito',
      logo: 'Sin Logo',
      date_release: new Date('2024-02-10'),
      date_revision: new Date('2025-02-10'),
    } as Product;
    spyOn(component, 'getProductFrom').and.returnValue(product);
    spyOn(component, 'showMsjAlert');

    component.agregarProducto();

    expect(component.showMsjAlert).toHaveBeenCalledWith(
      'Disculpe, hubo un error inesperado 👋'
    );
  });
});
