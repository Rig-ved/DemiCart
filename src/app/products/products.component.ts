import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ProductService } from '../product.service';
import { Observable, Subscription } from 'rxjs';
import { SnapshotAction } from '@angular/fire/database';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Product } from '../admin/product-form/product-form.component';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit,OnDestroy {

  products$ :  Observable<SnapshotAction<unknown>[]>
  productSub: Subscription
  products:Product[]=[]
  
  category:string=""
  filteredProducts: Product[];
  noProduct: boolean = false;
  @ViewChild('allCategories',{static:false}) allCategories:ElementRef

  constructor(private prodService:ProductService,
    private router:Router,
    private route:ActivatedRoute
    ) { }
  
  
  ngOnDestroy(): void {
    if(this.productSub)
     this.productSub.unsubscribe()
  }

  filterProducts() {
    this.filteredProducts = (this.category != "" ) ? this.products.filter((item)=>{
        return item.category.toLowerCase() == this.category.toLowerCase()
    }) : this.products


    if(this.filteredProducts.length==0) {
      this.filteredProducts = []
      this.noProduct= true
    }
      
    
  }

  redirectToHome(args?) {
    if(args) {
      args.nativeElement.classList="list-group-item list-group-item-action active"
    }
    
    this.router.navigate([''])
    this.noProduct = false
  }

  ngOnInit(): void {
    
      if(this.noProduct == true) {
        this.noProduct = false
      }
      this.prodService.getHomeProducts().pipe(
          switchMap((res)=>{
            let products =  []
            res.forEach((item)=>{
                let product:Product = item as Product
                products.push(product)
            })
            this.products = products
            return this.route.queryParamMap
        })

      ).subscribe((res:ParamMap)=>{
        if(res.get('category')) {
          this.category = String(res.get('category')).toLowerCase()
        } else {
          this.category= ""
          
        }
        this.filterProducts()
      })
     
  }
  

}
