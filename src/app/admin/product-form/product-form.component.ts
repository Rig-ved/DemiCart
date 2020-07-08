import { Component, OnInit, OnDestroy } from '@angular/core';
import { CategoryService } from 'src/app/category.service';
import { Observable, Subscription } from 'rxjs';
import { ProductService } from 'src/app/product.service';
import { SpinnerService } from 'src/app/spinner.service';
import { BannerInterface, BannerService } from 'src/app/banner.service';
import { Router, ActivatedRoute } from '@angular/router';
import { take } from 'rxjs/operators';

export interface Product {
  title:string,
  price:string,
  imageUrl:string,
  category:string,
  key?:string
}

@Component({
  selector: 'product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css'],
})
export class ProductFormComponent implements OnInit,OnDestroy {
  categories$: Observable<any>;
  routeId:string;
  productItem:Product={
    title:"",
    imageUrl:'',
    price:'',
    category:''
  }
  private routeSubs:Subscription

  constructor(
    private catService: CategoryService,
    private route:ActivatedRoute,
    private router:Router,
    private spinnerServ:SpinnerService,
    private bannerService:BannerService,
    private prodService: ProductService
  ) {}
  ngOnDestroy(): void {
    if(this.routeSubs) 
      this.routeSubs.unsubscribe()
  }
 
  ngOnInit(): void {
    this.routeSubs= this.route.params.pipe(
      take(1)
    ).subscribe((item)=>{
        this.routeId = item['id']
    });
    if(this.routeId) {
      this.prodService.getProduct(this.routeId).pipe(
        take(1)
      ).subscribe((prd:Product)=>this.productItem = prd)
    }


    this.categories$ = this.catService.getCategories();
  }
  private bannerMsg(msg) {
    const data: BannerInterface = {
      message: msg,
      messageType: 'success',
    };
    this.spinnerServ.hideLoader();
    this.bannerService.showBanner(data);
    this.router.navigateByUrl('/admin/products')
  }

  onCancel() {
    this.spinnerServ.showLoader()
    this.router.navigateByUrl('/admin/products')
  }
  save(item) {
    
    if (item) {
      this.spinnerServ.showLoader();
      if(this.routeId) {
        this.prodService.updateProduct(this.routeId,item).subscribe((res)=>{
          this.bannerMsg('The products have been updated successfully!!!!')
        })

      } else {
        this.prodService.saveProduct(item).subscribe((res)=>{
          this.bannerMsg('The products have been saved successfully!!!!')
        });
      }
     
    }
  }
}
