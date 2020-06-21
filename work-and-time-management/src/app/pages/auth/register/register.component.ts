import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RouterRoutesEnum } from 'src/app/enumerations/global.enums';

@Component({
    selector: 'app-register',
    templateUrl: 'register.component.html',
    styleUrls: ['./register.component.scss']
})

export class RegisterComponent implements OnInit {
    constructor(
        private router: Router
    ) { }

    ngOnInit() { }

    route() {
        this.router.navigate([`/${RouterRoutesEnum.DASHBOARD}`]);
    }
}
