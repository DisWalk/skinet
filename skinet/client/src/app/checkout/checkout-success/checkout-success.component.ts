import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Order } from '../../shared/models/order';

@Component({
  selector: 'app-checkout-success',
  templateUrl: './checkout-success.component.html',
  styleUrl: './checkout-success.component.scss'
})
export class CheckoutSuccessComponent {

  order?: Order = undefined;

  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state?.['order'] == null)
      this.order = undefined;
    this.order = navigation?.extras?.state?.['order'];
    console.log(navigation?.extras?.state?.['order']);
  }
}
