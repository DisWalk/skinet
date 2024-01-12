import { Component } from '@angular/core';
import { BasketService } from '../../basket/basket.service';
import { Basket, BasketItem } from '../../shared/models/basket';
import { AccountService } from '../../account/account.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss'
})
export class NavBarComponent {
  constructor(public basketService: BasketService,public accountService: AccountService) { 
  }
  
  Count(basket: Basket): number {
    let g = 0;
    for (let i = 0; i < basket.items.length; i++){
      g += basket.items[i].quantity;
    }
    return g;
  }

  getCount(items: BasketItem[]): number {
    return items.reduce((total, x) => total += x.quantity, 0); 
    //shorthand for above loop
    //g==total ; basket.items[i]==x
  }

}
