import { Component, OnInit } from '@angular/core';
import { BreadcrumbService } from 'xng-breadcrumb';
import { OrderService } from '../order.service';
import { AccountService } from '../../account/account.service';
import { Order } from '../../shared/models/order';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrl: './order-details.component.scss'
})
export class OrderDetailsComponent implements OnInit{

  order?: Order

  constructor(private bs: BreadcrumbService,private os:OrderService,private ar: ActivatedRoute) {
    this.bs.set('@orderDetails', ' ');
  }

  ngOnInit(): void {
    this.getOrderDetails();
  }
  
  getOrderDetails() {

    const orderIdFromUrl = this.ar.snapshot.paramMap.get('id');
    if(orderIdFromUrl)
    this.os.getOrderDetails(+orderIdFromUrl).subscribe({
      next: order => {
        console.log(order)
        this.order = order
        this.bs.set('@orderDetails', 'Order# ' + order.id + ' - ' + order.orderStatus);
      }
    })
  }

}
