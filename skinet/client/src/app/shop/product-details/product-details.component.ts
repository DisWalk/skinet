import { Component, OnInit } from '@angular/core';
import { Product } from '../../shared/models/product';
import { ShopService } from '../shop.service';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbService } from 'xng-breadcrumb';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss'
})
  
export class ProductDetailsComponent implements OnInit{
  product?: Product;
  id: number=0

  constructor(private shopService: ShopService,
    private activatedRoute: ActivatedRoute, private bcService: BreadcrumbService) { 
    this.bcService.set('@productDetails', ' ');
    //dont display name until its actually loaded
    }

  ngOnInit(): void {
    this.getProduct();
  }

  getProduct() {
    const id = this.activatedRoute.snapshot.paramMap.get('id'); //getting id from url
    if (id) { //so we dont get null id
      this.shopService.getProduct(+id).subscribe({  //+id casting string to int
        next: response => {
          this.product = response;
          this.bcService.set('@productDetails', response.name);
        },
        error: error => console.log(error)
      })
    }
  }

}
