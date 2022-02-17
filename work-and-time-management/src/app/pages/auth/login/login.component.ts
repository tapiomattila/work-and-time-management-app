import { Component, OnInit, NgZone, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { RouterRoutesEnum } from 'src/app/core/enums/global.enums';

import * as firebase from 'firebase/app';
import * as firebaseui from 'firebaseui';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
    selector: 'app-login',
    templateUrl: 'login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
    ui: firebaseui.auth.AuthUI;

    loader = false;

    constructor(
        private afAuth: AngularFireAuth,
        private router: Router,
        private ngZone: NgZone
    ) {}

    ngOnInit() {
        const uiConfig = {
            signInOptions: [
                firebase.auth.GoogleAuthProvider.PROVIDER_ID,
                firebase.auth.EmailAuthProvider.PROVIDER_ID,
            ],
            callbacks: {
                signInSuccessWithAuthResult: this.onLoginSuccessfull.bind(this),
            },
        };
        this.ui = new firebaseui.auth.AuthUI(this.afAuth.auth);
        this.ui.start('#firebaseui-auth-container', uiConfig);
    }

    onLoginSuccessfull(result) {
        this.loader = false;
        this.ngZone.run(() =>
            this.router.navigate([`/${RouterRoutesEnum.DASHBOARD}`])
        );
    }

    route() {
        this.router.navigate([`/${RouterRoutesEnum.DASHBOARD}`]);
    }

    ngOnDestroy() {
        this.ui.delete();
    }
}
