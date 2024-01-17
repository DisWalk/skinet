import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DeliveryMethod } from '../shared/models/deliveryMethod';
import { map } from 'rxjs';
import { Order, OrderToCreate } from '../shared/models/order';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  createOrder(order: OrderToCreate) {
    return this.http.post<Order>(this.baseUrl + 'orders', order);
  }


  getDeliveryMethods() {

    // const token = localStorage.getItem('token');

    // let headers = new HttpHeaders();
    // headers = headers.set('Authorization', `Bearer ${token}`);

    // return this.http.get<DeliveryMethod[]>(this.baseUrl + 'orders/deliveryMethods', { headers }).pipe(
    //   map(dm => {
    //     return dm.sort((a, b) => b.price - a.price)
    //   })
    // )

    return this.http.get<DeliveryMethod[]>(this.baseUrl + 'orders/deliveryMethods').pipe(
      map(dm => {
        return dm.sort((a, b) => b.price - a.price)
      })
    )
  }

  // getAddress() {
  //   return this.http.get<Address>(this.baseUrl + 'account/address');
  // }
}
