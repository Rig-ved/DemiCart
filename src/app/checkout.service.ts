export interface ShippingOrder {
  name:String,
  addressLine1:String,
  addressLine2:String,
  city:String,
  state?:String,
}




import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AngularFireDatabase } from '@angular/fire/database';
import { from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  getState() {
      return from(this.db.object('/cities').valueChanges())
  }

  storeOrder(order) {
      return from(this.db.list('/orders').push(order))
  }

  getOrder() {
    return from(this.db.object('/orders').valueChanges())
  }



  constructor(
    private http:HttpClient,
    private db:AngularFireDatabase
  ) { }
}
