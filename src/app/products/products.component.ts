import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { ProductService } from '../product.service';
import { Observable, Subscription } from 'rxjs';
import { SnapshotAction } from '@angular/fire/database';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Product } from '../admin/product-form/product-form.component';
import { switchMap } from 'rxjs/operators';
import { ShoppingCartService } from '../shopping-cart.service';
import { ShoppingCart } from './product-card/product-card.component';

@Component({
  selector: 'products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit, OnDestroy {
  products$: Observable<SnapshotAction<unknown>[]>;
  productSub: Subscription;
  cartSub: Subscription;
  products: Product[] = [];
  cart: any;

  category: string = '';
  filteredProducts: Product[];
  noProduct: boolean = false;
  @ViewChild('allCategories', { static: false }) allCategories: ElementRef;

  constructor(
    private prodService: ProductService,
    private router: Router,
    private route: ActivatedRoute,
    private cartService: ShoppingCartService
  ) {}

  ngOnDestroy(): void {
    if (this.productSub) this.productSub.unsubscribe();
    if (this.cartSub) this.cartSub.unsubscribe();
  }

  filterProducts() {
    this.filteredProducts =
      this.category != ''
        ? this.products.filter((item) => {
            return item.category.toLowerCase() == this.category.toLowerCase();
          })
        : this.products;
    if (this.filteredProducts.length == 0) {
      this.filteredProducts = [];
      this.noProduct = true;
    }
  }

  redirectToHome(args?) {
    if (args) {
      args.nativeElement.classList =
        'list-group-item list-group-item-action active';
    }

    this.router.navigate(['']);
    this.noProduct = false;
  }
  ngOnInit() {
    if (this.noProduct == true) {
      this.noProduct = false;
    }

    this.cartService.getCart().
    subscribe((res: any) => {
      if (!res) return this.cart =  null 
      this.cart = res.items as ShoppingCart;
      this.cartService.shoppingCartSubject.next({
          case: 'default',
          items: res.items,
          product:res.items
        });
    });
    this.prodService
      .getHomeProducts()
      .pipe(
        switchMap((res) => {
          let products = [];
          res.forEach((item) => {
            let product = item;
            products.push(
              Object.assign(product.payload.val(), { key: product.payload.key })
            );
          });
          this.products = products;
          return this.route.queryParamMap;
        })
      )
      .subscribe((res: ParamMap) => {
        if (res.get('category')) {
          this.category = String(res.get('category')).toLowerCase();
        } else {
          this.category = '';
        }
        this.filterProducts();
      });
  }
}
