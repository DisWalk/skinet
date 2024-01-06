import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pagination } from '../shared/models/pagination';
import { Product } from '../shared/models/product';
import { Brand } from '../shared/models/brand';
import { Type } from '../shared/models/type';
import { ShopParams } from '../shared/models/shopParams';

@Injectable({
  providedIn: 'root'  //root means Appmodule
})
export class ShopService {
  baseUrl='https://localhost:5001/api/'

  constructor(private http: HttpClient) { }
   
  // getProducts(brandId?: number, typeId?: number,sort?: string) { //we are just returning an observable ; will subscribe in components
  getProducts(shopParams:ShopParams) { //we are just returning an observable ; will subscribe in components
    let params = new HttpParams();
    // let x = 0
    // if(1) console.log('trueeeeeeeeeeeeeeeeeeeeee')
    // else console.log('falseeeeeeeeeeeeeeeeeeeeee')
    if (shopParams.brandId>0) params = params.append('brandId', shopParams.brandId)
    if (shopParams.typeId>0) params = params.append('typeId',shopParams.typeId)
    params = params.append('sort', shopParams.sort)
    
    params = params.append('pageSize',shopParams.pageSize)
    params = params.append('pageIndex',shopParams.pageNumber)
    if(shopParams.search) params = params.append('search',shopParams.search)

    return this.http.get<Pagination<Product[]>>(this.baseUrl + 'products', {params});
  }
 
  getBrands() {
    return this.http.get<Brand[]>(this.baseUrl + 'products/brands');
  }

  getType() {
    return this.http.get<Type[]>(this.baseUrl + 'products/types');
  }

  getProduct(id: number) {
    return this.http.get<Product>(this.baseUrl + 'products/' + id);
  }
  
}
