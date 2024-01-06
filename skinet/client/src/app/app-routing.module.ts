import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  //lazy loading shop module
  { path: 'shop', loadChildren: () => import('./shop/shop.module').then(m => m.ShopModule)},
  { path: '**', redirectTo:'',pathMatch:'full'} //if path not match -> redirect  to '' path i.e. Home ; path should be fully matched 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
