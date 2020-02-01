import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-current-worksite',
    templateUrl: 'current-worksite.component.html',
    styleUrls: ['current-worksite.component.scss']
})
export class CurrentWorksiteComponent implements OnInit {
    constructor(
        private router: Router
    ) { }

    ngOnInit() { }

    locationBack() {
        this.router.navigate(['/dashboard']);
    }
}