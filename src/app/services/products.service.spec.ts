import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from 'src/environments/environment';
import {
  CreateProductDTO,
  Product,
  UpdateProductDTO,
} from '../models/product.model';
import { ProductsService } from './products.service';
import {
  generateManyProducts,
  generateOneProduct,
} from './../models/product.mock';
import { HttpStatusCode, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from './../interceptors/token.interceptor';
import { TokenService } from './token.service';

describe('ProductsService', () => {
  let productService: ProductsService;
  let httpController: HttpTestingController;
  let tokenService: TokenService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ProductsService,
        TokenService,
        { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
      ],
    });
    productService = TestBed.inject(ProductsService);
    httpController = TestBed.inject(HttpTestingController);
    tokenService = TestBed.inject(TokenService);
  });

  afterEach(() => {
    httpController.verify();
  });

  it('should be create', () => {
    expect(productService).toBeTruthy();
  });

  describe('tests for GetAllSimple', () => {
    it('should return a product list', (doneFn) => {
      //Arrange
      const mockData: Product[] = generateManyProducts(2);
      spyOn(tokenService, 'getToken').and.returnValue('123');
      //Act
      productService.getAllsSimple().subscribe((data) => {
        //Assert
        expect(data.length).toEqual(mockData.length);
        expect(data).toEqual(mockData);
        doneFn();
      });

      // http config
      const url = `${environment.API_URL}/api/v1/products`;
      const req = httpController.expectOne(url);
      const headers = req.request.headers;
      expect(headers.get('Authorization')).toEqual('Bearer 123');
      req.flush(mockData);
    });
  });

  describe('tests for GetAll', () => {
    it('should return a product list', (doneFn) => {
      //Arrange
      const mockData: Product[] = generateManyProducts(3);
      //Act
      productService.getAll().subscribe((data) => {
        //Assert
        expect(data.length).toEqual(mockData.length);
        doneFn();
      });

      // http config
      const url = `${environment.API_URL}/api/v1/products`;
      const req = httpController.expectOne(url);
      req.flush(mockData);
    });
    it('should return product list with taxes', (doneFn) => {
      //Arrange
      const mockData: Product[] = [
        {
          ...generateOneProduct(),
          price: 100, // 100*.19 = 19
        },
        {
          ...generateOneProduct(),
          price: 200, // 200*.19 = 38
        },
        {
          ...generateOneProduct(),
          price: 0, // 0*.19 = 0
        },
        {
          ...generateOneProduct(),
          price: -100, //  = 0
        },
      ];

      //Act
      productService.getAll().subscribe((data) => {
        //Assert
        expect(data.length).toEqual(mockData.length);
        expect(data[0].taxes).toEqual(19);
        expect(data[1].taxes).toEqual(38);
        expect(data[2].taxes).toEqual(0);
        expect(data[3].taxes).toEqual(0);
        doneFn();
      });

      // http config
      const url = `${environment.API_URL}/api/v1/products`;
      const req = httpController.expectOne(url);
      req.flush(mockData);
    });

    it('should send query params with limit 10 and offset 3', (doneFn) => {
      //Arrange
      const mockData: Product[] = generateManyProducts(3);
      const limit = 10;
      const offset = 3;
      //Act
      productService.getAll(limit, offset).subscribe((data) => {
        //Assert
        expect(data.length).toEqual(mockData.length);
        doneFn();
      });

      // http config
      const url = `${environment.API_URL}/api/v1/products?limit=${limit}&offset=${offset}`;
      const req = httpController.expectOne(url);
      req.flush(mockData);
      const params = req.request.params;
      expect(params.get('limit')).toEqual(`${limit}`);
      expect(params.get('offset')).toEqual(`${offset}`);
    });
  });

  describe('test for create', () => {
    it('should return a new product', (doneFn) => {
      // Arrange
      const mockData = generateOneProduct();
      const dto: CreateProductDTO = {
        title: 'new product',
        price: 100,
        images: ['img'],
        description: 'new product description',
        categoryId: 12,
      };

      // Act
      productService.create({ ...dto }).subscribe((data) => {
        // Assert
        expect(data).toEqual(mockData);
        doneFn();
      });

      // http config
      const url = `${environment.API_URL}/api/v1/products`;
      const req = httpController.expectOne(url);
      req.flush(mockData);
      expect(req.request.body).toEqual(dto);
      expect(req.request.method).toEqual('POST');
    });
  });
  describe('test for update', () => {
    it('should modify a product', (doneFn) => {
      // Arrange

      const mockData = generateOneProduct();
      const dto: UpdateProductDTO = {
        title: 'new product',
      };
      const idProduct = mockData.id;

      // Act
      productService.update(idProduct, { ...dto }).subscribe((data) => {
        // Assert
        expect(data).toEqual(mockData);
        doneFn();
      });

      // http config
      const url = `${environment.API_URL}/api/v1/products/${idProduct}`;
      const req = httpController.expectOne(url);
      expect(req.request.body).toEqual(dto);
      expect(req.request.method).toEqual('PUT');
      req.flush(mockData);
    });
  });

  describe('test for delete', () => {
    it('should delete a product', (doneFn) => {
      // Arrange

      const mockData = true;
      const idProduct = '1';

      // Act
      productService.delete(idProduct).subscribe((data) => {
        // Assert
        expect(data).toEqual(true);
        doneFn();
      });

      // http config
      const url = `${environment.API_URL}/api/v1/products/${idProduct}`;
      const req = httpController.expectOne(url);
      expect(req.request.method).toEqual('DELETE');
      req.flush(mockData);
    });
  });

  describe('test for getOne', () => {
    it('should return a product', (doneFn) => {
      // Arrange

      const mockData: Product = generateOneProduct();
      const idProduct = '1';

      // Act
      productService.getOne(idProduct).subscribe((data) => {
        // Assert
        expect(data).toEqual(mockData);
        doneFn();
      });

      // http config
      const url = `${environment.API_URL}/api/v1/products/${idProduct}`;
      const req = httpController.expectOne(url);
      expect(req.request.method).toEqual('GET');
      req.flush(mockData);
    });

    it('should return the right message when status code is 404', (doneFn) => {
      // Arrange

      const idProduct = '1';
      const msgError = '404 message';
      const mockError = {
        status: HttpStatusCode.NotFound,
        statusText: msgError,
      };

      // Act
      productService.getOne(idProduct).subscribe({
        error: (error) => {
          // assert
          expect(error).toEqual('El producto no existe');
          doneFn();
        },
      });

      // http config
      const url = `${environment.API_URL}/api/v1/products/${idProduct}`;
      const req = httpController.expectOne(url);
      expect(req.request.method).toEqual('GET');
      req.flush(msgError, mockError);
    });

    it('should return the right message when status code is 409', (doneFn) => {
      // Arrange

      const idProduct = '1';
      const msgError = '409 message';
      const mockError = {
        status: HttpStatusCode.Conflict,
        statusText: msgError,
      };

      // Act
      productService.getOne(idProduct).subscribe({
        error: (error) => {
          // assert
          expect(error).toEqual('Algo esta fallando en el server');
          doneFn();
        },
      });

      // http config
      const url = `${environment.API_URL}/api/v1/products/${idProduct}`;
      const req = httpController.expectOne(url);
      expect(req.request.method).toEqual('GET');
      req.flush(msgError, mockError);
    });

    it('should return the right message when status code is 401', (doneFn) => {
      // Arrange

      const idProduct = '1';
      const msgError = '401 message';
      const mockError = {
        status: HttpStatusCode.Unauthorized,
        statusText: msgError,
      };

      // Act
      productService.getOne(idProduct).subscribe({
        error: (error) => {
          // assert
          expect(error).toEqual('No estas permitido');
          doneFn();
        },
      });

      // http config
      const url = `${environment.API_URL}/api/v1/products/${idProduct}`;
      const req = httpController.expectOne(url);
      expect(req.request.method).toEqual('GET');
      req.flush(msgError, mockError);
    });

    it('should return the right message when status code is not specified', (doneFn) => {
      // Arrange

      const idProduct = '1';
      const msgError = '408 message';
      const mockError = {
        status: HttpStatusCode.RequestTimeout,
        statusText: msgError,
      };

      // Act
      productService.getOne(idProduct).subscribe({
        error: (error) => {
          // assert
          expect(error).toEqual('Ups algo salio mal');
          doneFn();
        },
      });

      // http config
      const url = `${environment.API_URL}/api/v1/products/${idProduct}`;
      const req = httpController.expectOne(url);
      expect(req.request.method).toEqual('GET');
      req.flush(msgError, mockError);
    });
  });
});
