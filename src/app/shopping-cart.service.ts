import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { from } from 'rxjs';
import { Product } from './admin/product-form/product-form.component';
import { take } from 'rxjs/operators';


export interface ShoppingCartItem {
  product:Product,
  quantity:number
}

@Injectable({
  providedIn: 'root',
})


export class ShoppingCartService {
  constructor(private db: AngularFireDatabase,) {}
  private async create() {
    return await
      this.db.list('/shopping-carts').push({
        dateCreated: new Date().getTime(),
      })
  
  }

  private getCart(cart) {
    return this.db.object('/shopping-carts' + cart.key).valueChanges();
  }

  private async getOrCreateCart() {
    let idCart = localStorage.getItem('shoppingCartId');
    if (idCart) return idCart
    let result = await this.create()
    localStorage.setItem('shoppingCartId', result.key);
    return result.key;
  }

  private getItem(cartId,productId) {
      return this.db.object('/shopping-carts/'+cartId+'/items/'+productId);
  }

  async addToCart(product:Product) {
    
    let cartId =  await this.getOrCreateCart()
    let item$ = this.getItem(cartId,product.key)

    item$.valueChanges().pipe(
      take(1)
    ).subscribe((item:ShoppingCartItem)=>{
      if(item) item$.update({quantity:item.quantity +1})
      else item$.update({product:product,quantity:1})
    })
  }
}
