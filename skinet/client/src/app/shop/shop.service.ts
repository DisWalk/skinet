import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pagination } from '../shared/models/pagination';
import { Product } from '../shared/models/product';
import { Brand } from '../shared/models/brand';
import { Type } from '../shared/models/type';
import { ShopParams } from '../shared/models/shopParams';
import { Observable, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root'  //root means Appmodule
})
export class ShopService {
  baseUrl = 'https://localhost:5001/api/'
  products: Product[] = []; //for caching
  brands: Brand[] = [];
  types: Type[] = [];
  pagination?: Pagination<Product[]>;
  shopParams = new ShopParams();
  productCache = new Map<string, Pagination<Product[]>>();

  constructor(private http: HttpClient) { }
   
  getProducts(useCache = true):Observable<Pagination<Product[]>> { 

    if (!useCache) this.productCache = new Map();

    //cache logic
    if (this.productCache.size > 0 && useCache) {
      if (this.productCache.has(Object.values(this.shopParams).join('-'))) {
        this.pagination = this.productCache.get(Object.values(this.shopParams).join('-'));
        console.log(this.productCache);
        if (this.pagination) return of(this.pagination);
      }
    }

    let params = new HttpParams();
    if (this.shopParams.brandId>0) params = params.append('brandId', this.shopParams.brandId)
    if (this.shopParams.typeId>0) params = params.append('typeId',this.shopParams.typeId)
    params = params.append('sort', this.shopParams.sort)
    
    params = params.append('pageSize',this.shopParams.pageSize)
    params = params.append('pageIndex',this.shopParams.pageNumber)
    if(this.shopParams.search) params = params.append('search',this.shopParams.search)

    return this.http.get<Pagination<Product[]>>(this.baseUrl + 'products', { params }).pipe(map(
      response => {
        // this.products = response.data;
        //append api result to list
        // this.products = [...this.products, ...response.data];
        this.productCache.set(Object.values(this.shopParams).join('-'),response);
        this.pagination = response;
        return response;
      }
    ));
  }

  setShopParams(params: ShopParams) {
    this.shopParams = params;
  }

  getShopParams() {
    return this.shopParams;
  }
 
  getBrands() {
    if (this.brands.length > 0) return of(this.brands);

    return this.http.get<Brand[]>(this.baseUrl + 'products/brands').pipe(
      map(brands => this.brands = brands)
    )
  }

  getType() {
    if (this.types.length > 0) return of(this.types);

    return this.http.get<Type[]>(this.baseUrl + 'products/types').pipe(
      map(types => this.types = types)
    )
  }

  getProduct(id: number) {  //return product from the cached products list

    // const product = [...this.productCache.values()];

    //find product from the cache values
    const product = [...this.productCache.values()]
      .reduce((acc, paginatedResult) => {
        return {...acc, ...paginatedResult.data.find(x => x.id===id)}
      }, {} as Product)
    
    console.log(product);

    // const product = this.products.find(p => p.id === id);

    if (Object.keys(product).length!==0) return of(product);
    //of returns observable

    return this.http.get<Product>(this.baseUrl + 'products/' + id);
  }
  
}
