import { Injectable } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/auth";
import { auth } from "firebase/app";
import { Router } from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AppAuthService {

  constructor(public auth: AngularFireAuth, private _router: Router) {
  }

  login(routeTo: string) {
    this.auth.signInWithPopup(new auth.GoogleAuthProvider()).then((userCredentials) => {
      if (userCredentials.user) {  // If user is not null
        // noinspection JSIgnoredPromiseFromCall
        this._router.navigate([routeTo])
      }
    })
  }

  logout() {
    return this.auth.signOut();
  }
}
