import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { RouterRoutesEnum } from 'src/app/enumerations/global.enums';
import * as moment from 'moment';
import { User } from 'src/app/stores/users';
import { Observable } from 'rxjs';
import { GlobalHelperService } from 'src/app/services/global-helper.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
    icon = '';
    backArrow$: Observable<boolean>;
    openMenuModal = false;

    @Input()
    set value(profileIconUrl: any) {
        this.icon = profileIconUrl;
    }

    @Input() user: User;

    momentDay: moment.Moment;

    constructor(
        private globalhelper: GlobalHelperService,
        private router: Router
    ) {}

    ngOnInit() {
        this.momentDay = moment();
        this.backArrow$ = this.globalhelper.backButtonObs$;
    }

    backArrowPressed() {
        this.router.navigate([RouterRoutesEnum.DASHBOARD]);
    }

    openMenu() {
        this.openMenuModal = true;
    }

    closedModal($event) {
        this.openMenuModal = false;
    }
}
