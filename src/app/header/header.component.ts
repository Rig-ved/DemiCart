import { Component, OnInit, OnDestroy } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable, Subscription } from 'rxjs';
import * as firebase from 'firebase'
import { AuthService } from '../auth.service';
import { BannerInterface, BannerService } from '../banner.service';
import { Router } from '@angular/router';
import { saveUser } from '../user.service';

@Component({
  selector: 'header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit,OnDestroy {
  public appUser:saveUser;
  public userSub:Subscription
  constructor( 
    public authService:AuthService,
    public router:Router,
    private bannerService:BannerService) { 
    
  }

  ngOnInit(): void {
    this.userSub= this.authService.appUser$.subscribe((user)=> 
        this.appUser = user)
  }
  ngOnDestroy() : void {
    if(this.userSub) {
      this.userSub.unsubscribe()
    }
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

}
