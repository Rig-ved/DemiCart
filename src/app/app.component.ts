import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from './auth.service';
import { Router, NavigationStart, ActivatedRoute } from '@angular/router';
import { BannerInterface, BannerService } from './banner.service';
import { SpinnerService } from './spinner.service';
import { UserService } from './user.service';
import { Subscription } from 'rxjs';


export let browserRefresh = false;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit,OnDestroy{
  subscription:Subscription
  browserRefresh:boolean

  constructor(
    private authService: AuthService,
    private dbServ:UserService,
    private route:ActivatedRoute,
    private spinnerServ: SpinnerService,
    private bannerService: BannerService,

    private router: Router
  ) {
    this.subscription = router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        browserRefresh = !router.navigated;
      }
  });
  }
  ngOnInit(): void {
    this.browserRefresh = browserRefresh;
    this.authService.user$.subscribe((user) => {
      if (user) {

          let returnUrl = localStorage.getItem('returnUrl');
          if(returnUrl) {
            this.router.navigateByUrl(returnUrl);
          }
          
          this.spinnerServ.hideLoader();
//localStorage.removeItem('returnUrl');
        
       
      }
    });
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }
}
