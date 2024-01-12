// import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
// import { Observable, map } from 'rxjs';
// import { AccountService } from '../../account/account.service';

// export class AuthGuard implements CanActivateFn{
  
//   constructor(private accountService: AccountService, private router: Router){}
  
//   CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> => {
//     //route guard will automatically subscribe and unsubscribe from observable
//     return this.accountService.currentUser$.pipe(
//       map(auth => {
//         if (auth) return true;
//         else {  //returnUrl - check current url of user
//           //provide it to login component
//           //so after they have logged in
//           //we can redirect them to where they came from
//           this.router.navigate(['/account/login'],
//           { queryParams: { returnUrl: state.url } });
//           return false;
//         }
//       })
//       //if we have the user object from accountService return true
//       //else we will route them to login page
//     );
//   }
// };

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { map, Observable } from 'rxjs';
import { AccountService } from '../../account/account.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private accountService: AccountService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> {
    return this.accountService.currentUser$.pipe(
      map(auth => {
        console.log(auth);
        if (auth) return true;
        else {
          this.router.navigate(['/account/login'], {queryParams: {returnUrl: state.url}});
          return false
        }
      })
    );
  }
  
}
