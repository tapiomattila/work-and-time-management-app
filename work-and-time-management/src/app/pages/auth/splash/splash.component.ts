import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RouterRoutesEnum } from 'src/app/enumerations/global.enums';

@Component({
    selector: 'app-splash',
    templateUrl: 'splash.component.html',
    styleUrls: ['./splash.component.scss']
})

export class SplashComponent implements OnInit {
    constructor(
        private router: Router
    ) { }

    ngOnInit() { }

    login() {
        this.router.navigate([`/${RouterRoutesEnum.LOGIN}`]);
    }

    register() {
        this.router.navigate([`/${RouterRoutesEnum.REGISTER}`]);
    }
}
