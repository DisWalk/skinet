import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BasketItem } from '../models/basket';
import { BasketService } from '../../basket/basket.service';
// import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-basket-summary',
  templateUrl: './basket-summary.component.html',
  styleUrl: './basket-summary.component.scss'
})
export class BasketSummaryComponent {
  @Output() addItem = new EventEmitter<BasketItem>();
  @Output() removeItem = new EventEmitter<{ id: number, quantity: number }>();
  @Input() isBasket = true; //will be false in checkout page

  constructor(public basketService: BasketService){}

  //emitting these values to basket component
  //we are outputting these values
  addBasketItem(item: BasketItem) {
    this.addItem.emit(item);
  }

  removeBasketItem(id: number, quantity =1) {
    this.removeItem.emit({ id, quantity });
  }
}
