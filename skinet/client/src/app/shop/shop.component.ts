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
  shopParams = new ShopParams()
  sortOptions = [
    { name: 'Alphabetical', value: 'name' },
    { name: 'Price: Low to High', value: 'priceAsc' },
    { name: 'Price: High to Low', value: 'priceDesc' },
  ]
  totalCount=0
  
  constructor(private shopService: ShopService) {}

  ngOnInit(): void {
    this.getProducts();
    this.getBrands();
    this.getType();
  }

  getProducts() {
    this.shopService.getProducts(this.shopParams).subscribe({
      next: response => {
        this.products = response.data;
        this.shopParams.pageNumber = response.pageIndex;
        this.shopParams.pageSize = response.pageSize;
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
    this.shopParams.brandId = brandId
    this.shopParams.pageNumber = 1; //to display first page after filter
    this.getProducts()  //get filtered products
  }

  onTypeSelected(typeId: number) {
    this.shopParams.typeId = typeId
    this.shopParams.pageNumber = 1; //to display first page after filter
    this.getProducts()  //get filtered products
  }

  onSortSelected(event: any) {
    this.shopParams.sort = event.target.value
    this.getProducts()
  }

  onPageChanged(event: any) {
    if (this.shopParams.pageNumber !== event) {
      this.shopParams.pageNumber = event
      this.getProducts();
    }
  }
  
  onSearch() {
    this.shopParams.search = this.searchVar?.nativeElement.value;
    this.shopParams.pageNumber = 1; //to display first page after filter
    //gettijg value of input text
    this.getProducts();
  }

  onReset() {
    if (this.searchVar) this.searchVar.nativeElement.value = '';
    this.shopParams = new ShopParams(); //will reset all param vals ; so api call will be simple getproduct
    this.getProducts();
  }

}
