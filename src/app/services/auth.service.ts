import { Injectable } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase';
import { Subject, from, of, throwError, Observable } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { saveUser, UserService } from './user.service';
import {switchMap} from 'rxjs/operators'
import { AngularFireObject } from '@angular/fire/database';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user$: Observable<firebase.User>;
  constructor(public afAuth: AngularFireAuth,
    private userService:UserService,
    private route: ActivatedRoute) {
    this.user$ = afAuth.authState;
  }

  private storeUrl() {
    let returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || "";
    localStorage.setItem('returnUrl', returnUrl);
  }

  loginWithGoogle() {
    if (this.route.snapshot.queryParamMap.get('returnUrl') != '')
      this.storeUrl();
      return from(this.afAuth.signInWithRedirect(new auth.GoogleAuthProvider()))
      
      
  }
  loginWithEmail(params) {
    if (this.route.snapshot.queryParamMap.get('returnUrl') != '')
      this.storeUrl();
    return from(
      this.afAuth.signInWithEmailAndPassword(params.email, params.password)
    ).pipe(
      catchError((error) => {
        let errorMsg: string = 'An unknown error occured';
        if (!error.code && !error.message) {
          return throwError(errorMsg);
        }
        switch (error.code) {
          case 'auth/user-not-found':
            errorMsg = 'User not found. Please sign up instead';
            break;
          case 'auth/wrong-password':
            errorMsg = 'Please provide the correct password.';
            break;
        }
        return throwError(errorMsg);
      })
    );
  }

  signUpWithUsername(params) {
    return from(
      this.afAuth.createUserWithEmailAndPassword(params.email, params.password)
    ).pipe(
      catchError((error) => {
        let errorMsg: string = 'An unknown error occured';
        if (!error.code && !error.message) {
          return throwError(errorMsg);
        }
      })
    );
  }
  logout() {
    return from(this.afAuth.signOut());
  }
  get appUser$():Observable<saveUser> {
      return this.user$.pipe(
        switchMap((user)=>{
          if(user) {
            return this.userService.get(user.uid).valueChanges()
          }
          // You provided certain items which arent true , to solve the error 
          // we should return an obserable 

          return of(null)
        })
      )
  }
}
