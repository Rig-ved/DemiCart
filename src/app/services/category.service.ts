import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private db : AngularFireDatabase) { }

  getAllCategories() {
    return this.db.list('/categories',
      ref => ref.orderByChild('name')
    ).snapshotChanges()
  }
}
