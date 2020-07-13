import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductService } from '../product.service';
import { Observable, Subscription } from 'rxjs';
import { SnapshotAction } from '@angular/fire/database';
import { CategoryService } from '../category.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Product } from '../admin/product-form/product-form.component';
import { ThrowStmt } from '@angular/compiler';

@Component({
  selector: 'products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit,OnDestroy {

  products$ :  Observable<SnapshotAction<unknown>[]>
  productSub: Subscription
  products:Product[]=[]
  categories$ :  Observable<SnapshotAction<unknown>[]>
  category:string=""
  filteredProducts: Product[];
  noProduct: boolean = false;

  constructor(private prodService:ProductService,
    private router:Router,
    private route:ActivatedRoute,
    private catService:CategoryService) { }
  
  
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

  redirectToHome() {
    this.router.navigate(['/'])
    this.noProduct = false
  }

  ngOnInit(): void {
    
      if(this.noProduct == true) {
        this.noProduct = false
      }
    
      
      this.prodService.getAllProducts().subscribe((res)=>{
          let products = []
          res.forEach((item)=>{
              let product:Product = item.payload.val() as Product
              products.push(product)
          })
          this.products = products
          this.route.queryParamMap.subscribe((res:ParamMap)=>{
            if(res.get('category')) {
              this.category = String(res.get('category')).toLowerCase()
            } else {
              this.category= ""
            }
            this.filterProducts()
            
          })
          
          
      })
     

      this.categories$ = this.catService.getAllCategories()
  }
  clickCategory(item) {
    this.router.navigate(['/'], { queryParams: { category: item.key } });

  }

}
