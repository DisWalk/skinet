import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BasketService } from '../../basket/basket.service';
import { CheckoutService } from '../checkout.service';
import { ToastrService } from 'ngx-toastr';
import { OrderToCreate } from '../../shared/models/order';
import { Address } from '../../shared/models/user';
import { Basket } from '../../shared/models/basket';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-checkout-payment',
  templateUrl: './checkout-payment.component.html',
  styleUrl: './checkout-payment.component.scss'
})
export class CheckoutPaymentComponent {
  @Input() checkoutForm?: FormGroup

  constructor(private bs: BasketService, private cs: CheckoutService, private ts: ToastrService,private rl:Router) { }
  
  submitOrder() {
    const basket = this.bs.getCurrentBasketValue();
    if (!basket) return;
    const ordertocreate = this.getOrderToCreate(basket);
    if (!ordertocreate) return;
    this.cs.createOrder(ordertocreate).subscribe({
      next: order => {
        this.ts.success("Order created successfully!");
        this.bs.deleteLocalBasket();  //to show empty basket in UI
        const navigationExtras: NavigationExtras = { state: order };
        this.rl.navigate(['checkout/success'], navigationExtras);
      }
    })
  }

  private getOrderToCreate(basket: Basket): OrderToCreate | undefined{
    const deliveryMethod = this.checkoutForm?.get('deliveryForm')?.get('deliveryMethod')?.value
    const shiptoaddress = this.checkoutForm?.get('addressForm')?.value as Address;
    if (!deliveryMethod || !shiptoaddress) return;
    return {
      basketId: basket.id,
      deliveryMethodId: deliveryMethod,
      shipToAddress: shiptoaddress
    }
  }
}
