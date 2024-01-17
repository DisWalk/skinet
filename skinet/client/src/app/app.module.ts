import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { CoreModule } from './core/core.module';
import { HomeModule } from './home/home.module';
import { ErrorInterceptor } from './core/interceptors/error.interceptor';
import { LoadingInterceptor } from './core/interceptors/loading.interceptor';
import { LoginComponent } from './account/login/login.component';
import { RegisterComponent } from './account/register/register.component';
import { JwtInterceptor } from './core/interceptors/jwt.interceptor';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    CoreModule,
    HomeModule,  //removing ShopModule as it will not be loaded with app module
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS,useClass:ErrorInterceptor, multi:true},
    {provide: HTTP_INTERCEPTORS,useClass:LoadingInterceptor, multi:true},
    {provide: HTTP_INTERCEPTORS,useClass:JwtInterceptor, multi:true},
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
