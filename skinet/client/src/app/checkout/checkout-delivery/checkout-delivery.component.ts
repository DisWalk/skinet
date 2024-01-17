import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DeliveryMethod } from '../../shared/models/deliveryMethod';
import { CheckoutService } from '../checkout.service';
import { BasketService } from '../../basket/basket.service';

@Component({
  selector: 'app-checkout-delivery',
  templateUrl: './checkout-delivery.component.html',
  styleUrl: './checkout-delivery.component.scss'
})
export class CheckoutDeliveryComponent implements OnInit{
  @Input() checkoutForm?: FormGroup;
  deliveryMethod: DeliveryMethod[] = [];

  constructor(private cs:CheckoutService,private basketService: BasketService){}
  ngOnInit(): void {
    this.cs.getDeliveryMethods().subscribe({
      next: dm => this.deliveryMethod = dm
    })
  }

  setShippingPrice(deliveryMethod: DeliveryMethod) {
    this.basketService.setShippingPrice(deliveryMethod);
  }
}
