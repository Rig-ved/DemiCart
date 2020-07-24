import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { from, Subject } from 'rxjs';
import { Product } from './admin/product-form/product-form.component';
import { take, switchMap } from 'rxjs/operators';


export interface  ShoppingCartItem {
  product:Product,
  quantity:number
}

@Injectable({
  providedIn: 'root',
})
export class ShoppingCartService {
  shoppingCartSubject = new Subject()
  constructor(private db: AngularFireDatabase,) {}
  private async create() {
    return await
      this.db.list('/shopping-carts').push({
        dateCreated: new Date().getTime(),
      })
  
  }

  getCart() {
    let observable =  from(this.getOrCreateCart().then((item)=>{
      return this.db.object('/shopping-carts/'+item);
    }))
    return observable.pipe(
      switchMap((item)=>{
        return item.valueChanges()
      })
    )
    
   
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
    this.updateCart(product,1)
   
  }

  async removeFromCart(product: Product) {
      this.updateCart(product,-1)
      
  }

  private async updateCart(product,diff) {
    
    let cartId =  await this.getOrCreateCart()
    let item$ = this.getItem(cartId,product.key)
    item$.valueChanges().pipe(
      take(1)
    ).subscribe((item:ShoppingCartItem)=>{
      if(item) item$.update({quantity:item.quantity + diff})
      else item$.update({product:product,quantity:1})
    })

  }

 
  clearCart() {
    from(this.db.object('/shopping-carts/' + localStorage.getItem('shoppingCartId')).remove());
    
  }
}
