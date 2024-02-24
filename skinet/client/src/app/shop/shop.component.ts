import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Product } from '../shared/models/product';
import { ShopService } from './shop.service';
import { Brand } from '../shared/models/brand';
import { Type } from '../shared/models/type';
import { HttpParams } from '@angular/common/http';
import { ShopParams } from '../shared/models/shopParams';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.scss'
})
export class ShopComponent implements OnInit{

  @ViewChild('searchID') searchVar?: ElementRef;

  products: Product[] = []
  brands: Brand[] = []
  types: Type[] = []
  shopParams: ShopParams;
  sortOptions = [
    { name: 'Alphabetical', value: 'name' },
    { name: 'Price: Low to High', value: 'priceAsc' },
    { name: 'Price: High to Low', value: 'priceDesc' },
  ]
  totalCount=0
  
  constructor(private shopService: ShopService) {
    this.shopParams = shopService.getShopParams();
    //getting params from 
  }

  ngOnInit(): void {
    this.getProducts();
    this.getBrands();
    this.getType();
  }

  getProducts() {
    this.shopService.getProducts().subscribe({
      next: response => {
        this.products = response.data;
        this.totalCount = response.count;
      },
      error: error => console.log(error)
    })
  }

  getBrands() {
    this.shopService.getBrands().subscribe({
      next: response => this.brands = [{id: 0,name:'All'},...response],
      error: error => console.log(error)
    })
  }

  getType() {
    this.shopService.getType().subscribe({
      next: response => this.types = [{id: 0,name:'All'},...response],
      error: error => console.log(error)    
    })
  }

  onBrandSelected(brandId: number) {
    const params = this.shopService.getShopParams();
    params.brandId = brandId
    params.pageNumber = 1; //to display first page after filter
    this.shopService.setShopParams(params);
    this.shopParams = params;
    this.getProducts()  //get filtered products
  }

  onTypeSelected(typeId: number) {
    const params = this.shopService.getShopParams();
    params.typeId = typeId
    params.pageNumber = 1; //to display first page after filter
    this.shopService.setShopParams(params);
    this.shopParams = params;
    this.getProducts()  //get filtered products
  }

  onSortSelected(event: any) {
    const params = this.shopService.getShopParams();
    params.sort = event.target.value;
    this.shopService.setShopParams(params);
    this.shopParams = params;
    this.getProducts()
  }

  onPageChanged(event: any) {
    const params = this.shopService.getShopParams();
    if (params.pageNumber !== event) {
      params.pageNumber = event;
      this.shopService.setShopParams(params);
      this.shopParams = params;
      this.getProducts();
    }
  }
  
  onSearch() {
    const params = this.shopService.getShopParams();
    params.search = this.searchVar?.nativeElement.value;
    params.pageNumber = 1; //to display first page after filter
    //gettijg value of input text
    this.shopService.setShopParams(params);
    this.shopParams = params;
    this.getProducts();
  }

  onReset() {
    if (this.searchVar) this.searchVar.nativeElement.value = '';
    this.shopParams = new ShopParams(); //will reset all param vals ; so api call will be simple getproduct
    this.shopService.setShopParams(this.shopParams);
    this.getProducts();
  }

}
