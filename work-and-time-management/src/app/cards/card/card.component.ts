import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { Worksite } from 'src/app/stores/worksites/state/worksites.model';
import { HoursQuery } from 'src/app/stores/hours';

@Component({
    selector: 'app-card',
    templateUrl: './card.component.html',
    styleUrls: ['./card.component.scss'],
})
export class CardComponent implements OnInit {
    hoursNum: number;
    loading = false;
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

    @Input()
    set loader(value: boolean) {
        value ? (this.loading = value) : (this.loading = false);
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
