import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { CustomFormsModule } from 'ngx-custom-validators';
import { DataTablesModule } from 'angular-datatables';
import { GooglePlaceModule } from "ngx-google-places-autocomplete";

// Angular fire Module from fire store
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireAnalyticsModule } from '@angular/fire/analytics';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { ProductsComponent } from './products/products.component';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { ConfirmationComponent } from './confirmation/confirmation.component';
import { MyOrdersComponent } from './my-orders/my-orders.component';
import { AdminProductsComponent } from './admin/admin-products/admin-products.component';
import { AdminOrdersComponent } from './admin/admin-orders/admin-orders.component';
import { LoginComponent } from './login/login.component';
import { PagenotfoundComponent } from './page-not-found/pagenotfound.component';
import { BannerComponent } from './banner/banner.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { LoadingInterceptorService } from 'services/loading.interceptor.service';
import { AuthGuardService } from 'services/auth-guard.service';
import { AdminGuardService } from 'services/user-guard.service';
import { ProductFormComponent } from './admin/product-form/product-form.component';
import { AlertComponent } from './alert/alert.component';
import { PlaceHolderDirective } from './placeholder.directive';
import { ProductFilterComponent } from './products/product-filter/product-filter.component';
import { ProductCardComponent } from './products/product-card/product-card.component';
import { PluralizePipe } from './pluralize.pipe';
import { KeysPipe } from './keys.pipe';
import { ProductUpdateComponent } from './products/product-update/product-update.component';
import { ShoppingGuardService } from 'services/shopping-guard.service';
import { TooltipDirective } from '../app/services/tooltip.directive';
import { OrderGuardService } from 'services/order-guard.service';
import { OrderDeactivateService } from 'services/order-deactivate.service';
import { OrderSummaryComponent } from './order-summary/order-summary.component';

const routes: Routes = [
  {path: '', component: ProductsComponent},
  
  { path: 'products', component: ProductsComponent },
  { path: 'login', component: LoginComponent },
  { path: 'shopping-cart', component: ShoppingCartComponent,canActivate:[ShoppingGuardService] },

  { path: 'checkout', component: CheckoutComponent,canActivate:[AuthGuardService,ShoppingGuardService] },
  { path: 'confirmation', component: ConfirmationComponent,
        canActivate:[AuthGuardService,OrderGuardService] ,
        canDeactivate:[OrderDeactivateService]
  },
  { path: 'my/orders', component: MyOrdersComponent,canActivate:[AuthGuardService] },

  { path: 'admin/products', component: AdminProductsComponent,canActivate:[AuthGuardService,AdminGuardService] },
  { path: 'admin/products/new', component: ProductFormComponent,canActivate:[AuthGuardService,AdminGuardService] },
  { path: 'admin/products/:id', component: ProductFormComponent,canActivate:[AuthGuardService,AdminGuardService] },
 
  { path: 'admin/orders', component: AdminOrdersComponent,canActivate:[AuthGuardService,AdminGuardService] },
   { path: '**', component: PagenotfoundComponent },

];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    ProductsComponent,
    ShoppingCartComponent,
    CheckoutComponent,
    ConfirmationComponent,
    MyOrdersComponent,
    AdminProductsComponent,
    AdminOrdersComponent,
    PagenotfoundComponent,
    LoginComponent,
    BannerComponent,
    SpinnerComponent,
    ProductFormComponent,
    AlertComponent,
    PlaceHolderDirective,
    ProductFilterComponent,
    ProductCardComponent,
    PluralizePipe,
    KeysPipe,
    ProductUpdateComponent,
    TooltipDirective,
    OrderSummaryComponent,
  ],
  imports: [
   
    BrowserModule,
    FormsModule,
    CustomFormsModule,
    HttpClientModule,
    DataTablesModule,
    RouterModule.forRoot(routes),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAnalyticsModule,
    AngularFireDatabaseModule,
    AngularFirestoreModule,
    AngularFireAuthModule,
    
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingInterceptorService,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
