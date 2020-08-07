import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { Product } from '../../admin/product-form/product-form.component';
import {
  ShoppingCartService,
  ShoppingCartItem,
  ShoppingCart,
} from 'services/shopping-cart.service';


import { ProductUpdateComponent } from '../product-update/product-update.component';

@Component({
  selector: 'product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css'],
})
export class ProductCardComponent implements OnInit {
  @Input('item') item: Product;
  @Input('showActions') showActions: boolean;
  @Input('shoppingCart') shoppingCart: ShoppingCart;
  @ViewChild(ProductUpdateComponent) productUpdate: ProductUpdateComponent;
  constructor(
    
  ) {}
  ngOnInit(): void {}
 
  addToCart() {
    this.productUpdate.addToCart()
  }  
  
  getQuantity() {
    let productWithQty: ShoppingCartItem;
    if (!this.shoppingCart) return 0;
    else if(this.shoppingCart.items){
      productWithQty = this.shoppingCart.items[this.item.key];
      return productWithQty ? productWithQty.quantity : 0;
    }
  }
}
