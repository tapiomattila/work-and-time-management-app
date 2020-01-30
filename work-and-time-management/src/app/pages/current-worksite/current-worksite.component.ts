import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
    selector: 'app-current-worksite',
    templateUrl: 'current-worksite.component.html',
    styleUrls: ['current-worksite.component.scss']
})
export class CurrentWorksiteComponent implements OnInit {
    constructor(
        private location: Location
    ) { }

    ngOnInit() { }

    locationBack() {
        this.location.back();
    }
}