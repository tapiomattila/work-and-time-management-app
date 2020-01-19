import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class WindowService {
    windowSize = {};
    private windowSizeSubj = new BehaviorSubject({ width: 0, height: 0 });
    windowSizeObs$ = this.windowSizeSubj.asObservable();

    constructor() {
        this.windowSize = { width: window.innerWidth, height: window.innerHeight };
        this.windowSizeSubj.next({ width: window.innerWidth, height: window.innerHeight });
    }

    updateCurrentDimensions(windowWidth: number, windowHeight: number) {
        this.windowSize = { width: windowWidth, height: windowHeight };
        this.windowSizeSubj.next({ width: windowWidth, height: windowHeight });
    }
}
