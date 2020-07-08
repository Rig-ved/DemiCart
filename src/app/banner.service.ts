import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';



export interface BannerInterface {
    message?:string,
    messageType?:string,
    showBanner?:boolean
}

@Injectable({
    providedIn:'root'
})
export class BannerService {
    bannerSubject = new Subject<BannerInterface>()
    showBanner(data:BannerInterface) {
        if(!data) {
            return 
        }
        data.showBanner = true;
        this.bannerSubject.next(data);
        setTimeout(()=>{
            this.hideBanner()
        },3000)
    }

    hideBanner() {
        const data:BannerInterface = {
            showBanner:false
        }
       
        this.bannerSubject.next(data);
    }

}
