import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  

  constructor(private db : AngularFireDatabase) { }
  saveProduct(item) {
    return from(this.db.list('/products').push(item))
  }
  getAllProducts() {
    return from(this.db.list('/products').snapshotChanges())
  }

  getHomeProducts() {
    return this.db.list('/products').valueChanges() 
  }
  getProduct(productId) {
    return this.db.object('/products/' +productId).valueChanges()
  }
  updateProduct(routeId: string, item: any) {
    return from(this.db.object('/products/'+routeId).update(item))
  }
  deleteProduct(routeId:string,item:any) {
    return from(this.db.object('/products/'+routeId).remove())
  }

}
