import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
// import { UserService } from 'src/app/auth/user';
import { AuthService } from 'src/app/auth/state';
import { AngularFireAuth } from '@angular/fire/auth';
import { RouterRoutesEnum } from 'src/app/enumerations/global.enums';
import { UserService } from 'src/app/stores/users';

@Component({
    selector: 'app-menu-modal',
    templateUrl: './menu-modal.component.html',
    styleUrls: ['./menu-modal.component.scss'],
})
export class MenuModalComponent implements OnInit {
    @Input() openMenuModal = false;
    @Output() closed = new EventEmitter();

    constructor(
        private router: Router,
        private userService: UserService,
        private authService: AuthService,
        private afAuth: AngularFireAuth
    ) {}

    ngOnInit() {}

    closeModal() {
        this.openMenuModal = false;
        this.closed.emit();
    }

    signout() {
        this.openMenuModal = false;
        this.userService.resetAllStores();
        this.authService.signOut();
        this.afAuth.auth.signOut();
        this.router.navigate([RouterRoutesEnum.WELCOME]);
    }
}
