import { Component, OnInit, OnDestroy } from '@angular/core';
import { SpinnerService } from 'services/spinner.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.css']
})
export class SpinnerComponent implements OnInit,OnDestroy {
 
  shouldSpin:boolean= false ;
  spinSubscription:Subscription;
  constructor(
    private spinnerServ:SpinnerService
  ) { }

  ngOnInit() {
    this.spinSubscription=this.spinnerServ.shouldSpin.subscribe( (item:boolean)=>{
      this.shouldSpin = item;

    })

  }
  ngOnDestroy(): void {
    this.spinSubscription.unsubscribe()
  }

}
