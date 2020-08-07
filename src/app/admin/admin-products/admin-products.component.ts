import {
  Component,
  OnInit,
  ViewContainerRef,
  ViewChild,
  ComponentFactoryResolver,
  OnDestroy,
  AfterViewInit,
  NgZone,
} from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Observable, Subscription, Subject } from 'rxjs';
import { BannerInterface, BannerService } from '../../services/banner.service';
import { SpinnerService } from '../../services/spinner.service';
import { PlaceHolderDirective } from '../../placeholder.directive';
import { AlertComponent } from 'app/alert/alert.component';
import { Product } from '../product-form/product-form.component';
import { DataTableDirective } from 'angular-datatables';

@Component({
  selector: 'admin-products',
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.css'],
})
export class AdminProductsComponent implements OnInit, OnDestroy,AfterViewInit {
  products: Array<Product>;
  filteredProds:Array<any>;
  dtOptions: DataTables.Settings = {};
  @ViewChild(DataTableDirective, {static: false})
  datatableElement: DataTableDirective;
  productSub: Subscription;
  dtTrigger = new Subject();
  @ViewChild(PlaceHolderDirective) reference: PlaceHolderDirective;

  constructor(
    private productService: ProductService,
    private spinnerServ: SpinnerService,
    private ngZone:NgZone,
    private componentfactory: ComponentFactoryResolver,
    private bannerService: BannerService
  ) {}
  ngAfterViewInit(): void {
    this.spinnerServ.showLoader()
    this.ngZone.runOutsideAngular(()=>{
      setTimeout(()=>{
        document.getElementById('DataTables_Table_0_filter').style.display = 'none'
        
      },500)
      this.spinnerServ.hideLoader()
    })
   
  }
  ngOnDestroy() {
    if (this.productSub) this.productSub.unsubscribe();
    this.dtTrigger.unsubscribe();
  }
  ngOnInit(): void {
   
    this.productSub = this.productService
      .getAllProducts()
      .subscribe((products) => {
        let productItems= []
        if (products) {
          products.forEach((product)=>{
            productItems.push(Object.assign(product.payload.val(), {'key':product.payload.key}))
          })
        }
        this.filteredProds = this.products =  productItems
        this.dtOptions = {
          pagingType: 'full_numbers'
          
        };
        this.dtTrigger.next();
        
      });
      
  }
  private bannerMsg(msg) {
    const data: BannerInterface = {
      message: msg,
      messageType: 'success',
    };
    this.spinnerServ.hideLoader();
    this.bannerService.showBanner(data);
  }
  deleteProduct(item) {
    let alertCompFactory = this.componentfactory.resolveComponentFactory(
      AlertComponent
    );

    let containerRef = this.reference.vcRef;
    containerRef.clear();
    const dynamicComp = containerRef.createComponent(alertCompFactory);
    dynamicComp.instance.message = `Are you sure you want to delete the product ?`;

    let no: Subscription = dynamicComp.instance.no.subscribe(() => {
      no.unsubscribe();
      containerRef.clear();
    });
    let yes: Subscription = dynamicComp.instance.yes.subscribe(() => {
      yes.unsubscribe();
      containerRef.clear();
      this.productService.deleteProduct(item.key, item).subscribe((res) => {
        this.bannerMsg('Product Deleted Successfully');
      });
    });
  }
  filterProd(query) {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.search(query).draw();
    })  
   
  }
}
