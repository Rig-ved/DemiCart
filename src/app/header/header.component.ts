import { Component, OnInit, OnDestroy } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable, Subscription } from 'rxjs';
import * as firebase from 'firebase'
import { AuthService } from '../auth.service';
import { BannerInterface, BannerService } from '../banner.service';
import { Router } from '@angular/router';
import { saveUser } from '../user.service';
import { ShoppingCartService } from '../shopping-cart.service';
import { take } from 'rxjs/operators';
import { Product } from '../admin/product-form/product-form.component';

@Component({
  selector: 'header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit,OnDestroy {
  public appUser:saveUser;
  public userSub:Subscription;
  public cartSub:Subscription;
  public productsDiv:Array<Product>=[]
  public cartItems:number = 0
  constructor( 
    public authService:AuthService,
    private cartService:ShoppingCartService,
    public router:Router,
    private bannerService:BannerService) { 
    
  }

  ngOnInit(): void {
    this.userSub= this.authService.appUser$.subscribe((user)=> 
        this.appUser = user)
    this.cartSub = this.cartService.shoppingCartSubject.subscribe((res:any)=>{
      if(res.case == 'default') {
        let items = 0;
        for (let i in res.items) {
          items+= res.items[i].quantity
        }
        this.cartItems = items

      }
      else if(res.case == 'clear') this.cartItems =0
      else if(res.case == 'add') this.cartItems += 1
      else this.cartItems-=1
    })

  }
  private bannerMsg(item,key) {
    const data: BannerInterface = {
      message: item + key,
      messageType: 'success',
    };
    this.bannerService.showBanner(data);
  }

  ngOnDestroy() : void {
    if(this.userSub) {
      this.userSub.unsubscribe()
    }
    if(this.cartSub) this.cartSub.unsubscribe()
  }
  logout() {
     
      this.authService.logout().subscribe((res)=>{
        const data: BannerInterface = {
          message: "Logged out Successfully!!!!",
          messageType: "success"
        };
        this.bannerService.showBanner(data);
        this.router.navigate(['/login'])
        localStorage.setItem('returnUrl',"");
        
      })
  }
  clearCart() {
    this.cartService.clearCart();
    this.cartService.shoppingCartSubject.next({
      case:'clear',items:0
    })
    this.bannerMsg('All items',' were successfully removed from cart')
  }

}
