import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Product } from './shared/models/product';
import { Pagination } from './shared/models/pagination';
import { BasketService } from './basket/basket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
  
export class AppComponent implements OnInit{

  constructor(private basketService: BasketService){}

  ngOnInit(): void {  //to get basket data after starting appln
    const basketId = localStorage.getItem('basket_id');
    if (basketId) this.basketService.getBasket(basketId);
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
