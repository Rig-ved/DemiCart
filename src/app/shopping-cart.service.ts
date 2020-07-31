import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { from, Subject, Observable } from 'rxjs';
import { Product } from './admin/product-form/product-form.component';
import { take, switchMap, map } from 'rxjs/operators';


export class ShoppingCart {
    
  // constructor(public items:ShoppingCartItem){}

   
   constructor(public items: {[key:string]:ShoppingCartItem} ){}

  get idProducts() {
    return Object.keys(this.items)
  }

  get products(){
    let products:any[] = [] 
    for (let productId in this.items) {
      products.push({
        'quantity':this.items[productId].quantity,
        'product':this.items[productId].product,
        'totalPrice': (this.items[productId].quantity * Number(this.items[productId].product.price) )
      })
    }
    return products
  } 

  get totalPrice() {
      let cartPrice = 0;
      let products = this.products
      for (let item of products) {
        cartPrice+= item.totalPrice
      }
      return cartPrice
  }

  
  get itemCount() {
    let cartItems = 0;
    for (let productId in this.items) {
      cartItems+= this.items[productId].quantity
    }
    return cartItems
  }
}



export interface  ShoppingCartItem {
  product:Product,
  quantity:number
}

@Injectable({
  providedIn: 'root',
})
export class ShoppingCartService {
  constructor(private db: AngularFireDatabase,) {}
  private async create() {
    return await this.db.list('/shopping-carts').push({
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
      }),
      map((res:ShoppingCart)=>{
          if(!res) return null
          return new ShoppingCart(res.items)
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

  async addToCart(product:Product,number) {
    if(number > 1) 
      this.updateCart(product,number)
    else 
      this.updateCart(product,1)
      
  }

  async removeFromCart(product: Product,number:number) {
    if(number > 1)  
      this.updateCart(product,-number)
    else {
      this.updateCart(product,-1)
    }
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
    return from(this.db.object('/shopping-carts/' + localStorage.getItem('shoppingCartId')).remove());
    
  }
}
