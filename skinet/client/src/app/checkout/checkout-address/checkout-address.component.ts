import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CheckoutService } from '../checkout.service';
import { AccountService } from '../../account/account.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-checkout-address',
  templateUrl: './checkout-address.component.html',
  styleUrl: './checkout-address.component.scss'
})
export class CheckoutAddressComponent {
  @Input() checkoutForm?: FormGroup;

  // address: Address | null=null;
  constructor(private as: AccountService,private toastr: ToastrService) {
    // this.getAddress();
  }

  // getAddress() {
  //   this.cs.getAddress().subscribe({
  //     next: ad => this.address = ad
  //   }) 
  // }
  
  saveUserAddress() {
    this.as.updateUserAddress(this.checkoutForm?.get('addressForm')?.value).subscribe({
      next: () => {
        this.toastr.success('Address Saved!')
        this.checkoutForm?.get('addressForm')?.reset(this.checkoutForm?.get('addressForm')?.value);
        //to put it as non dirty state ; so once address is saved, we have to modify it again for it to be saved
      }
    })
  }
}
