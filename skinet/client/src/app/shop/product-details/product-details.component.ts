import { Component, OnInit } from '@angular/core';
import { Product } from '../../shared/models/product';
import { ShopService } from '../shop.service';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbService } from 'xng-breadcrumb';
import { BasketService } from '../../basket/basket.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss'
})
  
export class ProductDetailsComponent implements OnInit{
  product?: Product;
  id: number = 0
  quantity = 1
  quantityInBasket = 0

  constructor(private shopService: ShopService,
    private activatedRoute: ActivatedRoute, private bcService: BreadcrumbService,private basketService: BasketService) { 
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
          this.basketService.basketSource$.pipe(take(1)).subscribe({
            next: basket => {
              const item = basket?.items.find(x => x.id === +id);
              if (item) {
                this.quantity = item.quantity;
                this.quantityInBasket = item.quantity;
              }
            }
          })
        },
        error: error => console.log(error)
      })
    }
  }

  incrementQuantity() {
    this.quantity++;
  }

  decrementQuantity() {
    this.quantity--;
  }

  updateBasket() {
    if (this.product) {
      if (this.quantity > this.quantityInBasket) {
        const itemsToAdd = this.quantity - this.quantityInBasket; //for redis update
        this.quantityInBasket += itemsToAdd;  //for cart diplay
        this.basketService.addItemtoBasket(this.product, itemsToAdd);
      } else {
        const itemsToRemove = this.quantityInBasket - this.quantity;
        this.quantityInBasket -= itemsToRemove;
        this.basketService.removeItemfromBasket(this.product.id,itemsToRemove);
      }
    }
  }

  get buttonText() {
    return this.quantityInBasket === 0? 'Add to Basket' : 'Update Basket';
  }

}
