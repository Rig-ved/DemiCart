export interface CheckoutRequest {
  uid:string
  dateCreated:number,
  shipping:ShippingOrder,
  cart: Array<any>,
 
}


import { Component, OnInit, ViewChild, ElementRef, OnDestroy, NgZone } from '@angular/core';
import { ShippingOrder, CheckoutService } from '../checkout.service';
import { NgForm } from '@angular/forms';
import { ShoppingCart, ShoppingCartService } from '../shopping-cart.service';
import { take, map, filter, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { fromEvent, Subject, Subscription, Observable } from 'rxjs';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
import { BannerInterface, BannerService } from '../banner.service';
import { SpinnerService } from '../spinner.service';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { Order } from '../order-domain.model';

@Component({
  selector: 'checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit,OnDestroy {

  @ViewChild('cities') cities : ElementRef
  @ViewChild('f') form:NgForm


  checkoutSub:Subscription
  city$= new Subject<string>();
  shippingItem:ShippingOrder={
    name:"",
    addressLine1:'',
    addressLine2:'',
    city:'',
    state:'',
  }

  cart:any
  uid: string;
  authSub: Subscription;
  cartSub: Subscription;
 
  constructor(
    private cartService:ShoppingCartService,
    private checkoutService:CheckoutService,
    private spinnerServ: SpinnerService,
    private authService:AuthService,
    private router: Router,
    private bannerService: BannerService
  ) { }
  ngOnDestroy(): void {
    if(this.checkoutSub) this.checkoutSub.unsubscribe()
    if(this.cartSub) this.cartSub.unsubscribe()
    if( this.authSub)  this.authSub.unsubscribe()
   
  }

  editOrder() {
    this.router.navigate(['/shopping-cart'])
  }

  ngOnInit(): void {
    this.authSub =  this.authService.user$.subscribe((user)=>this.uid = user.uid)
    this.cartSub = this.cartService.getCart().pipe(
    ).subscribe((res)=>{
      this.cart = res
    })

    this.city$.pipe(
      filter((res) => {
       this.shippingItem.state = null 
       return  res.length > 5
      }),
      debounceTime(1000),
      distinctUntilChanged())
      .subscribe(value => {
        this.populateState(value)
      });
   

  }

  
  private populateState(text:string) {
    var cityIpt = text
    this.checkoutSub = this.checkoutService.getState().subscribe((res:object)=>{
        // TODO Add a check for state 
        if(!res) {
          this.shippingItem.state=null
        } else {
          for(var city in res) {
            if(city.indexOf(cityIpt.substring(0,2)) != -1)  {
              this.shippingItem.state = res[city].state
            }
          }
        }
    })
  }

  save(item) {
    if (!item) return   
    this.spinnerServ.showLoader();
    let order:CheckoutRequest = new Order(this.uid,item,this.cart,this.cart.totalPrice)
      
      this.checkoutService.storeOrder(order).subscribe((res)=>{
        this.spinnerServ.hideLoader();
        this.router.navigate(['/confirmation'],{ queryParams: { orderId: res.key } });
      })
  
    }
}
