import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Product } from './models/product';
import { Pagination } from './models/pagination';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
  
export class AppComponent implements OnInit{

  title = 'Skinet';
  productsList : Product[] = []

  constructor(private http: HttpClient) {}

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
  
  ngOnInit(): void {
    this.http.get<Pagination<Product[]>>('https://localhost:5001/api/products?pageSize=50').subscribe({
      next: response => this.productsList = response.data,
      error: error => console.log(error),
      complete: () => {
        console.log("request completed");
        console.log("dun dun dun");
      }
    })
  }

}
