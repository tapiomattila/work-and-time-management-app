import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { RouterRoutesEnum } from '../enumerations/global.enums';

@Injectable({ providedIn: 'root' })
export class GlobalHelperService {
    private backButtonSubj = new BehaviorSubject<boolean>(false);
    backButtonObs$ = this.backButtonSubj.asObservable();

    constructor(private router: Router) {}

    setBackButton(value: boolean) {
        this.backButtonSubj.next(value);
    }

    monitorUrl() {
        return this.router.events.pipe(
            filter(event => event instanceof NavigationEnd)
        );
    }

    setBackButtonOnUrl(currentRoute: string) {
        if (this.restrictedBackBtnRoutes(currentRoute)) {
            this.setBackButton(false);
        } else {
            this.setBackButton(true);
        }
    }

    private restrictedBackBtnRoutes(currentRoute: string) {
        const restrictedBackRoutes = [
            RouterRoutesEnum.WELCOME,
            RouterRoutesEnum.LOGIN,
            RouterRoutesEnum.DASHBOARD,
            ''
        ];
        return restrictedBackRoutes.includes(currentRoute);
    }
}
