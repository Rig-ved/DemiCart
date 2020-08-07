import { Component, OnInit, Input, ElementRef, ViewChild, Output, EventEmitter, NgZone } from '@angular/core';
import { SnapshotAction } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { CategoryService } from 'services/category.service';
import { Router } from '@angular/router';

@Component({
  selector: 'product-filter',
  templateUrl: './product-filter.component.html',
  styleUrls: ['./product-filter.component.css']
})
export class ProductFilterComponent implements OnInit {
  categories$ :  Observable<SnapshotAction<unknown>[]>
  @Input('category') category
  @Input('filteredProducts') filteredProducts
  @Output() redirectHome= new EventEmitter<any>()
  @ViewChild('allCategories') allCategories:ElementRef
 

  constructor(
    private ngZone:NgZone,
    private router:Router,
    private catService:CategoryService
  ) { }

  ngOnInit(): void {
    this.categories$ = this.catService.getAllCategories()
  }

  clickCategory(item) {
    this.allCategories.nativeElement.classList="list-group-item list-group-item-action"
    this.ngZone.runOutsideAngular(()=>{
      window.scroll(0,0)
    })
    
    this.router.navigate(['/'], { queryParams: { category: item.key } });
  }
  redirectToHome(evt) { 
    this.redirectHome.emit(this.allCategories)
  }

}
