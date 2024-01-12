import { Component } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormBuilder, Validators } from '@angular/forms';
import { AccountService } from '../account.service';
import { Router } from '@angular/router';
import { debounceTime, finalize, map, switchMap, take } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  errors : string[] | null = []

  constructor(private fb: FormBuilder, private accountService: AccountService, private router: Router) { }

  complexPassword = "(?=^.{6,10}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&amp;*()_+}{&quot;:;'?/&gt;.&lt;,])(?!.*\s).*$"
  
  // .group is equivalent to  = new FormGroup (from LoginComponent)
  registerForm = this.fb.group({
    displayName: ['', Validators.required],
    email: ['',[Validators.required,Validators.email],[this.validateEmailNotTaken()]],
    password: ['',[Validators.required,Validators.pattern(this.complexPassword)]]
  })
  //when we fire this.validateEmailNotTaken()
  //it puts the controller in pending state
  //until response comes back from API

  onSubmit() {
    this.accountService.register(this.registerForm.value).subscribe({
      next: () => this.router.navigateByUrl('/shop'),
      error: error => this.errors = error.errors
    })
  }

  //asyn validation
  //this will be checkd only when above two validation pass
  // i.e. email required and email valid
  validateEmailNotTaken():AsyncValidatorFn {
    return (control: AbstractControl) => {

      //valueChanges - A multicasting observable that emits an event every time the value of the control changes, in the UI or programmatically.
      return control.valueChanges.pipe(
        debounceTime(1000),
        //will wait 1 sec after user types char before making below api call
        take(1),
        //take last value emitted i.e. latest string of input 
        switchMap(() => {
          return this.accountService.checkEmailExists(control.value).pipe(
            map(result => result ? { emailExists: true } : null),
            //emailExists is error name like required and email

            finalize(() => control.markAllAsTouched())
            //marking as touched because errors get displayed only after we click out of the text box
            //and we want it to display after we type and we are within box
          )
        })
      )
      //switch projects take(1) value into an observable
      //which is then merged into outputs observable
      
      //we will see small loading spinner with each char typing
      //bcoz while we type, status of control is PENDING
      //but we gave debounce time of 1 sec to minimize api calls
      
    }
  }

}
