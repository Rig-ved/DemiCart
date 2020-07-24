import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Product } from 'src/app/admin/product-form/product-form.component';
import { ShoppingCartService, ShoppingCartItem } from 'src/app/shopping-cart.service';
import { Subject } from 'rxjs';
import { BannerInterface, BannerService } from 'src/app/banner.service';


export interface ShoppingCart {
    items:ShoppingCartItem
}


@Component({
  selector: 'product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent implements OnInit {
  @Input('item') item:Product
  @Input('showActions') showActions:boolean
  @Input('shoppingCart') shoppingCart:ShoppingCart
 

 

  constructor(
    private shoppingCartService:ShoppingCartService,
    private bannerService: BannerService
  ) { }
  ngOnInit(): void {

  }
  addToCart() {
      this.shoppingCartService.addToCart(this.item)
      this.shoppingCartService.shoppingCartSubject.next({
        case:'add',
        items:1,
        product:this.item
      })
      this.bannerMsg(this.item,' was successfully added to cart')
      
  }

  private bannerMsg(item,key) {
    const data: BannerInterface = {
      message: item.title + key,
      messageType: 'success',
    };
    this.bannerService.showBanner(data);
  }

  removeFromCart() {
    this.shoppingCartService.removeFromCart(this.item)
    this.shoppingCartService.shoppingCartSubject.next({
      case:'delete',items:1, product:this.item
    })
    this.bannerMsg(this.item,'was successfully removed from cart')
  }

  getQuantity() {
      let productWithQty:ShoppingCartItem
      if(!this.shoppingCart) return 0
      else if(localStorage.getItem('shoppingCartId')=='clearCart'){
        return 0;
      }
      else {
        productWithQty = this.shoppingCart[this.item.key] as ShoppingCartItem
        return productWithQty ?  productWithQty.quantity : 0
      }
    

    } 
  
}
