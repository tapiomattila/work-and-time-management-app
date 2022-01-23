import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { RouterRoutesEnum } from 'src/app/enumerations/global.enums';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { GlobalHelperService } from 'src/app/services/global-helper.service';
import { Auth } from 'src/app/auth/state';
import { Location } from '@angular/common';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
    icon = '';
    backArrow$: Observable<boolean>;
    openMenuModal = false;
    @Input() auth: Auth;

    momentDay: moment.Moment;

    constructor(
        private globalhelper: GlobalHelperService,
        private router: Router,
        private location: Location
    ) { }

    ngOnInit() {
        this.momentDay = moment();
        this.backArrow$ = this.globalhelper.backButtonObs$;
    }

    backArrowPressed() {
        const url = window.location.href;
        const arr = [
            RouterRoutesEnum.MANAGE_WORKSITES,
            RouterRoutesEnum.MANAGE_WORKTYPES
        ];
        const exceptions = arr.some(el => url.includes(el));
        if (exceptions) {
            this.router.navigate([RouterRoutesEnum.DASHBOARD]);
        } else {
            this.location.back();
        }
    }

    openMenu() {
        this.openMenuModal = true;
    }

    closedModal() {
        this.openMenuModal = false;
    }
}
