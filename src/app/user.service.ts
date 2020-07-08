import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireObject } from '@angular/fire/database/';
import * as firebase from 'firebase'
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
// For storing logged in users to database 
export class UserService {
  constructor(
    public db : AngularFireDatabase
  ) { }
  retrieveUser(user) {
    return this.db.object('/users/' +user.uid).valueChanges()
  }  
  save(user: firebase.User) { 
      if(user) {
        let saveUser:saveUser = {
          name:user.displayName || user.email,
          email:user.email
        }
        return from(this.db.object('/users/' +user.uid).update(saveUser))
      }
      
  }
  
  get(uid:string):AngularFireObject<saveUser> {
    return this.db.object('/users/'+uid)
  }
}


export interface saveUser {
  name: string,
  email:String,
  isAdmin?:boolean
}