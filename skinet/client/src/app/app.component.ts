import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Product } from './shared/models/product';
import { Pagination } from './shared/models/pagination';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
  
export class AppComponent implements OnInit{
  ngOnInit(): void {
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
