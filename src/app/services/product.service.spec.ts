import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ProductService } from './product.service';
import { Product } from '../models/product.model';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductService],
    });

    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debería crearse', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve products with authorId header', () => {
    const dummyProducts = [
      { id: 'trj-crd-1', name: 'Tarjeta de Credito 1' },
      { id: 'trj-crd-2', name: 'Tarjeta de Crédito 2' },
    ];

    service.getProducts().subscribe((products) => {
      expect(products.length).toBe(2);
      expect(products).toEqual(dummyProducts);
    });

    const req = httpMock.expectOne(service.baseUrl + '/bp/products');
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('authorId')).toBe(service.Id);
    req.flush(dummyProducts);
  });

  it('should retrieve a product by id with authorId header', () => {
    const dummyProduct = { id: 'trj-crd-1', name: 'Tarjeta de Credito 1' };

    service.getProductById('trj-crd-1').subscribe((product) => {
      expect(product).toEqual(dummyProduct);
    });

    const req = httpMock.expectOne(
      service.baseUrl + '/bp/products/verification?id=trj-crd-1'
    );
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('authorId')).toBe(service.Id);
    req.flush(dummyProduct);
  });

  /* it('should create a product with authorId header', () => {
    const dummyProduct: Product = { id: '1', name: 'Product 1' };

    service.createProduct(dummyProduct).subscribe((product) => {
      expect(product).toEqual(dummyProduct);
    });

    const req = httpMock.expectOne(service.baseUrl + '/bp/products');
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('authorId')).toBe(service.Id);
    req.flush(dummyProduct);
  }); */
});
