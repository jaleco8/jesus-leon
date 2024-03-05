import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ProductListComponent } from './product-list.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductListComponent, HttpClientTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crearse', () => {
    expect(component).toBeTruthy();
  });

  it('debería tener la lista de productos definida después de ngOnInit', () => {
    component.ngOnInit();
    expect(component.listProducts).toBeDefined();
  });

  it('debería tener la lista de productos no vacía después de ngOnInit', fakeAsync(() => {
    component.ngOnInit();
    tick();
    expect(component.listProducts.length).toBeGreaterThan(0);
  }));

  it('debería tener el primer producto en la lista de productos con una propiedad "name"', fakeAsync(() => {
    component.ngOnInit();
    tick();
    expect(component.listProducts.length).toBeGreaterThan(0);
    expect(component.listProducts[0].name).toBeDefined();
  }));

  it('debería renderizar la lista de productos en el DOM', fakeAsync(() => {
    component.ngOnInit();
    tick();
    fixture.detectChanges();
    const productElements = fixture.debugElement.queryAll(By.css('.table'));
    expect(productElements.length).toBeGreaterThan(0);
  }));
});
