import { Component, OnInit, OnDestroy } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable, Subscription } from 'rxjs';
import * as firebase from 'firebase'
import { AuthService } from '../services/auth.service';
import { BannerInterface, BannerService } from '../services/banner.service';
import { Router, ActivatedRoute } from '@angular/router';
import { saveUser } from '../services/user.service';
import { ShoppingCartService, ShoppingCart } from '../services/shopping-cart.service';
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
  public cart$:Observable<ShoppingCart>
  public productsDiv:Array<Product>=[]
  public cartItems:number = 0
  constructor( 
    public authService:AuthService,
    private cartService:ShoppingCartService,
    public router:Router,
    public route:ActivatedRoute,
    private bannerService:BannerService) { 
    
  }

  ngOnInit(): void {
    this.userSub= this.authService.appUser$.subscribe((user)=> 
        this.appUser = user)
        this.cart$ = this.cartService.getCart()

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
    this.cartService.clearCart().pipe(
      take(1)
    )
    this.bannerMsg('All items',' were successfully removed from cart')
    if(this.router.url != '/')
      this.router.navigate(['/'])
  }

}
