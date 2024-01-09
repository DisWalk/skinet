import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { BehaviorSubject } from 'rxjs';
import { Basket, BasketItem, BasketTotals } from '../shared/models/basket';
import { HttpClient } from '@angular/common/http';
import { Product } from '../shared/models/product';

@Injectable({
  providedIn: 'root'
})
  
export class BasketService {
  baseUrl = environment.apiUrl;
  private basketSource = new BehaviorSubject<Basket | null>(null);
  basketSource$ = this.basketSource.asObservable();

  private basketTotalSource = new BehaviorSubject<BasketTotals | null>(null);
  basketTotalSource$ = this.basketTotalSource.asObservable();
  //this will work like an observable ; our components will be able to subsribe to it; when it changes, they will be notified and update template
  //very useful feature as we know cart will be needed in nultiple components
  //as its in Service, its singleton

  constructor(private http: HttpClient) { }

  getBasket(id: string) {
    return this.http.get<Basket>(this.baseUrl + 'basket?id=' + id).subscribe({
      next: x => {
        this.basketSource.next(x),
        this.CalculateTotals();
      }
    })
  }

  setBasket(basket: Basket) {
    return this.http.post<Basket>(this.baseUrl + 'basket' ,basket).subscribe({
      next: x => {
        this.basketSource.next(x),
        this.CalculateTotals();
      }
    })
  }

  getCurrentBasketValue() {
    return this.basketSource.value
  }

  addItemtoBasket(item: Product | BasketItem, quantity = 1) {
    if (this.isProduct(item))
      item = this.mapProductItemToBasketItem(item);
    const basket = this.getCurrentBasketValue() ?? this.createBasket();
    basket.items = this.addOrUpdateItem(basket.items, item, quantity);  
    this.setBasket(basket);
  }

  removeItemfromBasket(id: number, quantity=1) {
    const basket = this.getCurrentBasketValue();
    if (basket == null) return;
    const item = basket.items.find(x => x.id === id);

    if (item) {
      item.quantity -= quantity
      if (item.quantity==0) {
        basket.items = basket.items.filter(x => x.id !== id);
      }
      if (basket.items.length > 0) {
        this.setBasket(basket);
      }
      else {
        this.deleteBasket(basket);
      }
    }    
  }

  deleteBasket(basket: Basket) {
    return this.http.delete(this.baseUrl + 'basket?id=' + basket.id).subscribe({
      next: () => {
        this.basketSource.next(null)
        this.basketTotalSource.next(null)
        localStorage.removeItem('basket_id')
      }
    })
  }

  
  private addOrUpdateItem(items: BasketItem[], itemToAdd: BasketItem, quantity: number): BasketItem[] {
    const item = items.find(x => x.id === itemToAdd.id);
    if (item) item.quantity += quantity;
    else {
      itemToAdd.quantity = quantity;
      items.push(itemToAdd);
    }
    //update count of existing product or add new product
    return items;
  }

  private createBasket(): Basket {
    const basket = new Basket();  //will return cuid
    localStorage.setItem('basket_id', basket.id);
    return basket;
  }

  private mapProductItemToBasketItem(item: Product): BasketItem{
    return {
      id: item.id,
      productName: item.name,
      price: item.price,
      quantity: 0,
      pictureUrl: item.pictureUrl,
      brand: item.productBrand,
      type: item.productType
    }
  }

  private CalculateTotals() {
    const basket = this.getCurrentBasketValue();
    if (!basket) return;
    const shipping = 0;
    const subtotal = basket.items.reduce((total, item) => total += (item.quantity * item.price), 0);
    const total = subtotal + shipping;
    this.basketTotalSource.next({ shipping, subtotal, total });
  }

  private isProduct(item: Product | BasketItem): item is Product {
    return (item as Product).productBrand !== undefined
  }
}
