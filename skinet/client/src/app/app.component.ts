import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Product } from './shared/models/product';
import { Pagination } from './shared/models/pagination';
import { BasketService } from './basket/basket.service';
import { AccountService } from './account/account.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
  
export class AppComponent implements OnInit{

  constructor(private basketService: BasketService,private accountService: AccountService){}

  ngOnInit(): void {  //to get basket data after starting appln
    this.loadBasket();
    this.loadCurrentUser();
  }

  loadBasket() {
    const basketId = localStorage.getItem('basket_id');
    if (basketId) this.basketService.getBasket(basketId);
  }

  loadCurrentUser() {
    const token = localStorage.getItem('token');
    // if (token) this.accountService.loadCurrentUser(token).subscribe();
    this.accountService.loadCurrentUser(token).subscribe();
    //call method even if we dont have token
    //we will get null but auth guard observable will be subscribed
    //as null value will be emmitted from loadCurrentUser
    //so after going to home and refresh
    //we will be able to click on checkout
  }

  title = 'Skinet';


  // ngOnInit(): void {
  //   this.http.get('https://localhost:5001/api/products').subscribe({
  //     next: response => console.log(response),
  //     error: error => console.log(error),
  //     complete: () => {
  //       console.log("request completed");
  //       console.log("dun dun dun");
  //     }
  //   })
  // }

  //by writing <Pagination<Product[]>> we are making code type safe
  

}
