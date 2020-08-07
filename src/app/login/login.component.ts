import { Component, OnInit, ViewChild, OnDestroy, NgZone } from '@angular/core';
import { AuthService } from 'services/auth.service';
import { NgForm } from '@angular/forms';
import { BannerInterface, BannerService } from 'services/banner.service';
import { Subscription } from 'rxjs';
import { SpinnerService } from 'services/spinner.service';
import { Router } from '@angular/router';
import { UserService } from 'services/user.service';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, OnDestroy {
  constructor(
    private spinnerServ: SpinnerService,
    private authService: AuthService,
    private router: Router,
    private ngZone:NgZone,
    private dbServ:UserService,
    private bannerService: BannerService
  ) {}

  @ViewChild('f') form: NgForm;
  private loginSubs: Subscription;
  ngOnInit(): void {}

  onGoogleSignIn() {
    this.spinnerServ.showLoader();
    this.loginSubs = this.authService.loginWithGoogle().subscribe();
  }
  onEmailSignIn() {
    this.spinnerServ.showLoader();
    this.loginSubs = this.authService.loginWithEmail(this.form.value).subscribe(
      (res) => {
        this.saveUserToDb(res)
        if (localStorage.getItem('returnUrl') != '') {
          let returnUrl = localStorage.getItem('returnUrl');
          this.router.navigateByUrl(returnUrl);
        } else {
          this.router.navigate(['/home'])
        };
      },
      (err) => {
        const data: BannerInterface = {
          message: err,
          messageType: 'error',
        };
        this.spinnerServ.hideLoader();
        this.bannerService.showBanner(data);
      }
    );
  }
  saveUserToDb(res) {
    this.dbServ.save(res.user).subscribe()
  }

  onEmailSignUp() {
    this.spinnerServ.showLoader();
    //this.form.reset()
    this.loginSubs = this.authService
      .signUpWithUsername(this.form.value)
      .subscribe(
        (res) => {
          const data: BannerInterface = {
            message: 'Signed up successfully!!!!',
            messageType: 'success',
          };
          localStorage.setItem("returnUrl","login")
          this.spinnerServ.hideLoader();
          this.bannerService.showBanner(data);
          this.router.navigate(['/login']);
          // change routing
        },
        (err) => {
          const data: BannerInterface = {
            message: err,
            messageType: 'error',
          };
          this.spinnerServ.hideLoader();
          this.bannerService.showBanner(data);
        }
      );
  }
  ngOnDestroy(): void {
    if (this.loginSubs) this.loginSubs.unsubscribe();
  }
  register(params) {
    console.log(params);
  }
}
