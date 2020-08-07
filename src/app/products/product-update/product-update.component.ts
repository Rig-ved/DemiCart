import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { Product } from '../../admin/product-form/product-form.component';
import { ShoppingCartService } from 'services/shopping-cart.service';
import { BannerService, BannerInterface } from 'services/banner.service';

@Component({
  selector: 'product-update',
  templateUrl: './product-update.component.html',
  styleUrls: ['./product-update.component.css'],
})
export class ProductUpdateComponent implements OnInit {
  @Input('item') item: Product;
  @Input('qty') qty: number;
  @Input('readOnly') readOnly: boolean;

  @ViewChild('updateCart') updateCart: ElementRef;

  constructor(
    private shoppingCartService: ShoppingCartService,
    private bannerService: BannerService
  ) {}

  ngOnInit(): void {}
  private bannerMsg(item, key) {
    const data: BannerInterface = {
      message: item.title + key,
      messageType: 'success',
    };
    this.bannerService.showBanner(data);
  }
  addToCart() {
    if (!this.updateCart && this.readOnly == true) {
      this.shoppingCartService.addToCart(this.item, 1);
    } else {
      if (this.updateCart) {
        let cartVal = this.updateCart.nativeElement.value;
        this.shoppingCartService.addToCart(this.item, parseInt(cartVal));
        this.updateCart.nativeElement.value = '';
      } else this.shoppingCartService.addToCart(this.item, 1);
    }

    this.bannerMsg(this.item, ' was successfully added to cart');
  }

  removeFromCart(qty: number) {
    if(this.updateCart) {
      var cartVal = this.updateCart.nativeElement.value;
    }
    
    if (parseInt(cartVal) > qty) return;


    if (!this.updateCart && this.readOnly == true) {
      this.shoppingCartService.removeFromCart(this.item, 1);
    } else {
      if (cartVal) {
        this.shoppingCartService.removeFromCart(this.item, parseInt(cartVal));
        this.updateCart.nativeElement.value = '';
      }
        
      else this.shoppingCartService.removeFromCart(this.item, 1);
      
    }

    this.bannerMsg(this.item, ' was successfully removed from cart');
  }
}
