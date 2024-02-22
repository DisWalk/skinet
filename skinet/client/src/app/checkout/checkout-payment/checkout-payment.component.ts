import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BasketService } from '../../basket/basket.service';
import { CheckoutService } from '../checkout.service';
import { ToastrService } from 'ngx-toastr';
import { OrderToCreate } from '../../shared/models/order';
import { Address } from '../../shared/models/user';
import { Basket } from '../../shared/models/basket';
import { NavigationExtras, Router } from '@angular/router';
import { Stripe, StripeCardCvcElement, StripeCardExpiryElement, StripeCardNumberElement, loadStripe } from '@stripe/stripe-js';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-checkout-payment',
  templateUrl: './checkout-payment.component.html',
  styleUrl: './checkout-payment.component.scss'
})
export class CheckoutPaymentComponent implements OnInit{
  @Input() checkoutForm?: FormGroup
  @ViewChild('cardNumber') cardNumberElement?: ElementRef
  @ViewChild('cardExpiry') cardExpiryElement?: ElementRef
  @ViewChild('cardCvc') cardCvcElement?: ElementRef
  stripe: Stripe | null = null;
  cardNumber?: StripeCardNumberElement
  cardExpiry?: StripeCardExpiryElement
  cardCvc?: StripeCardCvcElement
  cardNumberComplete = false
  cardExpiryComplete = false
  cardCvcComplete = false
  cardErrors: any;
  loading = false;

  constructor(private bs: BasketService, private cs: CheckoutService, private ts: ToastrService, private rl: Router) { }
  
  ngOnInit(): void {
    //func from stripe returns stripe as a promise
    loadStripe('pk_test_51Odop4SA8dMrg5lqFNRK7Be5L7bqVBxYUtf6gVheKZ43HLOLKucYZEHzVkJWpaKZf7p6pXtLr8QUbKfktbS0BvVX00TE02kgPW').then(stripe => {
      this.stripe = stripe;
      const elements = stripe?.elements();
      if (elements) {
        this.cardNumber = elements.create('cardNumber');
        this.cardNumber.mount(this.cardNumberElement?.nativeElement);
        this.cardNumber.on('change', event => {
          // console.log(event);
          this.cardNumberComplete = event.complete;
          if (event.error) this.cardErrors = event.error.message;
          else this.cardErrors = null;
        })

        this.cardExpiry = elements.create('cardExpiry');
        this.cardExpiry.mount(this.cardExpiryElement?.nativeElement);
        this.cardExpiry.on('change', event => {
          this.cardExpiryComplete = event.complete;
          if (event.error) this.cardErrors = event.error.message;
          else this.cardErrors = null;
        })

        this.cardCvc = elements.create('cardCvc');
        this.cardCvc.mount(this.cardCvcElement?.nativeElement);
        this.cardCvc.on('change', event => {
          this.cardCvcComplete = event.complete;
          if (event.error) this.cardErrors = event.error.message;
          else this.cardErrors = null;
        })
      }
    })
  }

  get paymentFormComplete() {
    return this.checkoutForm?.get('paymentForm')?.valid && this.cardNumberComplete && this.cardExpiryComplete && this.cardCvcComplete
  }
  
  async submitOrder() {
    this.loading = true;
    const basket = this.bs.getCurrentBasketValue();
    if (!basket) throw new Error('cannot get basket');

    try {
      //await as a promise is returned
      const createdOrder = await this.createOrder(basket);
      const paymentResult = await this.confirmPaymentWithStripe(basket);
      if (paymentResult.paymentIntent) { //i.e. if we dont get error
        // this.bs.deleteLocalBasket(); //to show empty basket in UI
        this.bs.deleteBasket(basket); //delete basket from redis
        const navigationExtras: NavigationExtras = { state: { order: createdOrder } };
        this.rl.navigate(['checkout/success'], navigationExtras);
      } else {
        this.ts.error(paymentResult.error.message);
      }
    } catch (error: any) {
      console.log(error);
      this.ts.error(error.message);
    } finally { //so loading will end even if order is success or failure
      this.loading = false;
    }
    // this.cs.createOrder(ordertocreate).subscribe({
    //   next: order => {
    //     this.stripe?.confirmCardPayment(basket.clientSecret!, {
    //       payment_method: {
    //         card: this.cardNumber!,
    //         //we just need to pass card number, stripe is smart enough and will take its expiry and cvc too
    //         billing_details: {
    //           name: this.checkoutForm?.get('paymentForm')?.get('nameOnCard')?.value,
    //           address: {
    //             city: 'US',
    //             country: 'US',
    //             line1: 'US',
    //             line2: 'US',
    //             postal_code: 'US',
    //             state: 'US'
    //           }
    //         }
    //       }
    //     }).then(result => {
    //       console.log(result);
    //       if (result.paymentIntent) { //i.e. if we dont get error
    //         this.bs.deleteLocalBasket();  //to show empty basket in UI
    //         const navigationExtras: NavigationExtras = { state: { order:order } };
    //         this.rl.navigate(['checkout/success'], navigationExtras);
    //       } else {
    //         this.ts.error(result.error.message);
    //       }
    //     })
    //   }
    // })
  }

  private async confirmPaymentWithStripe(basket: Basket | null) {
    if (!basket) throw new Error('Bakset is null');
    const result = this.stripe?.confirmCardPayment(basket.clientSecret!, {
          payment_method: {
            card: this.cardNumber!,
            //we just need to pass card number, stripe is smart enough and will take its expiry and cvc too
            billing_details: {
              name: this.checkoutForm?.get('paymentForm')?.get('nameOnCard')?.value,
              address: {
                city: 'US',
                country: 'US',
                line1: 'US',
                line2: 'US',
                postal_code: 'US',
                state: 'US'
              }
            }
          }
    })
    if (!result) throw new Error('Problem in stripe payment');
    return result;
  }
  
  //async as it returns a promise
  private async createOrder(basket: Basket | null) {
    if (!basket) throw new Error('Bakset is null');
    const ordertocreate = this.getOrderToCreate(basket);
    return firstValueFrom(this.cs.createOrder(ordertocreate));
    //firstValueFrom returns a promise
    //we are doing this instead of subsrcribing and using next and then
    //as that code is complicated
  }

  private getOrderToCreate(basket: Basket): OrderToCreate {
    const deliveryMethod = this.checkoutForm?.get('deliveryForm')?.get('deliveryMethod')?.value
    const shiptoaddress = this.checkoutForm?.get('addressForm')?.value as Address;
    if (!deliveryMethod || !shiptoaddress) throw new Error('Problem with basket');
    return {
      basketId: basket.id,
      deliveryMethodId: deliveryMethod,
      shipToAddress: shiptoaddress
    }
  }
}
