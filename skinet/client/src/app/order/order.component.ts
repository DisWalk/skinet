import { Component, OnInit } from '@angular/core';
import { BreadcrumbService } from 'xng-breadcrumb';
import { OrderService } from './order.service';
import { AccountService } from '../account/account.service';
import { Order } from '../shared/models/order';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrl: './order.component.scss'
})
export class OrderComponent implements OnInit {
  
  orders: Order[]=[]

  constructor(private os: OrderService) {}
  
  ngOnInit(): void {
    this.getOrder()
  }

  getOrder() {
    this.os.getAllOrdersforUser().subscribe({
      next: order => {
        console.log(order)
        this.orders=order
      }
    })
  }

}
