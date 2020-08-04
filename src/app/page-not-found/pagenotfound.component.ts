import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'pagenotfound',
  templateUrl: './pagenotfound.component.html',
  styleUrls: ['./pagenotfound.component.css']
})
export class PagenotfoundComponent implements OnInit {

  constructor(
    private router :Router
  ) { }

  ngOnInit(): void {
  }
  redirectToHome(){
    this.router.navigate(['']);
  }

}
