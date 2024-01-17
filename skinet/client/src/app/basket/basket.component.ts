import { Component } from '@angular/core';
import { BasketService } from './basket.service';
import { BasketItem } from '../shared/models/basket';

@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrl: './basket.component.scss'
})
export class BasketComponent {

  constructor(public basketService: BasketService) { }
  
  // totalCount(items: BasketItem[]) {
  //   return items.reduce((total, x) => total += x.quantity, 0);
  // }

  incrementQuantity(item: BasketItem) {
    this.basketService.addItemtoBasket(item);
  }

  removeItem(event: { id: number, quantity: number }) {
    this.basketService.removeItemfromBasket(event.id, event.quantity);
  }

  

}
