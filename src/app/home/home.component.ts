import { Component, OnInit, OnDestroy } from '@angular/core';
import { BannerInterface, BannerService } from 'services/banner.service';
import { AuthService } from 'services/auth.service';
import { UserService } from 'services/user.service';
import { SpinnerService } from 'services/spinner.service';
import { Router } from '@angular/router';

import { browserRefresh } from '../app.component';


@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  browserRefresh: boolean;

  constructor(
    private authService: AuthService,
    private dbServ:UserService,
    private spinnerServ: SpinnerService,
    private bannerService: BannerService,
    private router: Router,

   

  ) { 
    
  }
 
  saveUserToDb(res) {
    let user  = res.user || res
    this.dbServ.retrieveUser(user).subscribe((res)=>{
      if(typeof res === 'undefined') {
        this.dbServ.save(user).subscribe();
      }
    })
    
  }   
  ngOnInit(): void {
    this.browserRefresh = browserRefresh;
    this.authService.user$.subscribe((user) => {
      if (user) {
        if(!this.browserRefresh) {
          this.saveUserToDb(user);
          let returnUrl = localStorage.getItem('returnUrl');
          this.router.navigateByUrl(returnUrl);
          const data: BannerInterface = {
            message: 'Logged in Successfully!!!!',
            messageType: 'success',
          };
          this.spinnerServ.hideLoader();
          this.bannerService.showBanner(data);
          localStorage.removeItem('returnUrl');
        }
       
      }
    });
  }

}
