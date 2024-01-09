import cuid from "cuid"

export interface Basket {
  id: string
  items: BasketItem[]
}

export interface BasketItem {
  id: number
  productName: string
  price: number
  quantity: number
  pictureUrl: string
  brand: string
  type: string
}

export class Basket implements Basket{  //implementing above basket interface
    id = cuid();    //to get unique string
    items: BasketItem[]=[]
}
//to intialize id

export interface BasketTotals{
  shipping: number
  subtotal: number
  total: number
}