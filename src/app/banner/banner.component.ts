import { Component, OnInit, OnDestroy } from "@angular/core";
import { BannerService, BannerInterface } from "../banner.service";
import { Subscription } from "rxjs";
import { Router, NavigationEnd} from "@angular/router";

@Component({
  selector: "banner",
  templateUrl: "./banner.component.html",
  styleUrls: ["./banner.component.css"]
})
export class BannerComponent implements OnInit, OnDestroy {
  message: string;
  messageType: string;
  showBanner: boolean;
  bannerSubscription: Subscription;
  constructor(private bannerService: BannerService, private router: Router) {}

  ngOnInit() {
    this.router.events.subscribe(event => {
      // Hide banner if routed to another page
      if (event instanceof NavigationEnd) {
        this.hideBanner();
      }
    });
    this.bannerSubscription = this.bannerService.bannerSubject.subscribe(
      (data: BannerInterface) => {
        if (!data) {
          return;
        }
        this.message = data.message;
        this.messageType = data.messageType;
        this.showBanner = data.showBanner;
      }
    );
  }

  hideBanner() {
    this.showBanner = false;
  }

  ngOnDestroy(): void {
    this.bannerSubscription.unsubscribe();
  }
}
