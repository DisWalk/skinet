import { Component } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-test-error',
  templateUrl: './test-error.component.html',
  styleUrl: './test-error.component.scss'
})
export class TestErrorComponent {
  baseUrl = environment.apiUrl
  validationErrors: string[]=[]

  constructor(private http: HttpClient) { }
  
  get404Error() {
    this.http.get(this.baseUrl + 'products/66').subscribe({
      next: reponse => console.log(reponse),
      error: error => console.log(error)
    })
  }

   get500Error() {
    this.http.get(this.baseUrl + 'buggy/servererror').subscribe({
      next: reponse => console.log(reponse),
      error: error => console.log(error)
    })
  }

  get400Error() {
    this.http.get(this.baseUrl + 'buggy/badrequest').subscribe({
      next: reponse => console.log(reponse),
      error: error => console.log(error)
    })
  }

  get400ValidationError() {
    this.http.get(this.baseUrl + 'products/f').subscribe({
      next: reponse => console.log(reponse),
      error: error => {
        console.log(error);
        this.validationErrors = error.errors; //catching from error interceptor
      }
    })
  }


}
