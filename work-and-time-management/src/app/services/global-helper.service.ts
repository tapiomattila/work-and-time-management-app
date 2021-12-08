import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';

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
        if (currentRoute === 'dashboard' || currentRoute === '') {
            this.setBackButton(false);
        } else {
            this.setBackButton(true);
        }
    }
}
