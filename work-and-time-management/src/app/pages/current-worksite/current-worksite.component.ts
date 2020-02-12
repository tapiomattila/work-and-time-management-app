import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WindowService } from 'src/app/services/window.service';
import { fadeInEnterTrigger } from 'src/app/animations/animations';

@Component({
    selector: 'app-current-worksite',
    templateUrl: 'current-worksite.component.html',
    styleUrls: ['current-worksite.component.scss'],
    animations: [
        fadeInEnterTrigger
    ]
})
export class CurrentWorksiteComponent implements OnInit {
    constructor(
        private router: Router,
        public windowService: WindowService
    ) { }

    ngOnInit() { }

    locationBack() {
        this.router.navigate(['/dashboard']);
    }
}