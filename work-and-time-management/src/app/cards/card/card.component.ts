import { Component, OnInit, Input } from '@angular/core';
import { fadeInEnterWithDelayTrigger } from 'src/app/animations/animations';
import { Observable, of } from 'rxjs';
import { Worksite } from 'src/app/stores/worksites/state/worksites.model';
import { HoursQuery } from 'src/app/stores/hours';

@Component({
    selector: 'app-card',
    templateUrl: './card.component.html',
    styleUrls: ['./card.component.scss'],
})
export class CardComponent implements OnInit {
    hoursNum: number;
    hours$: Observable<number>;

    iconUrl = '../../../assets/svg/sprite.svg#icon-briefcase';
    @Input() name: string;
    @Input() worksite: Worksite;

    @Input()
    set icon(value: string) {
        if (value) {
            this.iconUrl = `../../../assets/svg/sprite.svg#${value}`;
        }
    }

    constructor(private hoursQuery: HoursQuery) {}

    ngOnInit() {
        if (this.worksite) {
            this.hours$ = this.hoursQuery.selectHoursForWorksite(
                this.worksite.id
            );
        }
    }
}
