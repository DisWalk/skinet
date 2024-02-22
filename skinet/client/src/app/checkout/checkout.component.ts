import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AccountService } from '../account/account.service';
import { BasketService } from '../basket/basket.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent {

  constructor(private fb: FormBuilder, private accountService: AccountService,private basketService: BasketService) { 
    this.getAddressFormValues();
    this.getDeliveryMethodValue();
    //even if we leave checkout page, go back and update cart, address and delivery method will be populated
    //so we are remembering address and delivery method values
  }
  
  //match name with value in formGroupName formControlName html 
  checkoutForm = this.fb.group({
    addressForm: this.fb.group({
      firstName: ['',Validators.required],
      lastName: ['',Validators.required],
      street: ['',Validators.required],
      city: ['',Validators.required],
      state: ['',Validators.required],
      zipCode: ['',Validators.required],
    }),
    deliveryForm: this.fb.group({
      deliveryMethod: ['',Validators.required]
    }),
    paymentForm: this.fb.group({
      nameOnCard: ['',Validators.required]
    })
  })

  getAddressFormValues() {
    this.accountService.getUserAddress().subscribe({
      next: ad => {
        ad && this.checkoutForm.get('addressForm')?.patchValue(ad)
      }
    })
  }

  getDeliveryMethodValue() {
    const basket = this.basketService.getCurrentBasketValue();
    if (basket && basket.deliveryMethodId) {
      this.checkoutForm.get('deliveryForm')?.get('deliveryMethod')?.patchValue(basket.deliveryMethodId.toString());
    }
  }


}
