import { ShippingOrder } from './checkout.service'
import { ShoppingCart, ShoppingCartItem } from './shopping-cart.service'

export class Order {
    dateCreated : number
    cart: Array<any>
    
    constructor(public uid:string,
      public shipping:ShippingOrder,
      public shoppingCart:ShoppingCart,
      public totalPrice:number  
    ) {
        this.dateCreated = new Date().getTime()
        this.cart =  shoppingCart.products.map((it)=>{
          debugger
            return  {
              product:{
                title:it.product.title,
                imageUrl:it.product.imageUrl,
                price:it.product.price
              },
              quantity:it.quantity
            }
          })
    }
}

