import { Component, OnInit, Input } from '@angular/core';
import { fadeInEnterWithDelayTrigger } from 'src/app/animations/animations';
import { Observable } from 'rxjs';
import { Worksite } from 'src/app/worksites/state/worksites.model';
import { WorksitesQuery } from 'src/app/worksites/state/worksites.query';
import { WorksitesService } from 'src/app/worksites/state/worksites.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent implements OnInit {

  iconUrl = '../../../assets/svg/sprite.svg#icon-briefcase';

  hoursNum: number;
  @Input() name: string;
  @Input() hours: string;

  @Input()
  set icon(value: string) {
    if (value) {
      this.iconUrl = `../../../assets/svg/sprite.svg#${value}`;
    }
  }

  //   @Input() class: string;
  //   currentWorkSite$: Observable<Worksite>;

  constructor(
    private worksiteQuery: WorksitesQuery,
    private worksiteService: WorksitesService,
  ) { }

  ngOnInit() {
    if (this.hours && this.hours.length > 0) {
      this.hoursNum = parseInt(this.hours, 0);
    }

    // this.currentWorkSite$ = this.worksiteQuery.selectRecentlyUpdateWorksite()
    //   .pipe(
    //     map((worksites: Worksite[]) => {
    //       if (worksites.length > 0) {
    //         this.worksiteService.setActive(worksites[0].id);
    //         return worksites[0];
    //       }
    //     })
    //   )
  }
}
