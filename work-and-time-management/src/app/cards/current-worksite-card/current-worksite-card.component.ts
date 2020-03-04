import { Component, OnInit, Input } from '@angular/core';
import { fadeInEnterWithDelayTrigger } from 'src/app/animations/animations';
import { Observable } from 'rxjs';
import { Worksite } from 'src/app/worksites/state/worksites.model';
import { WorksitesQuery } from 'src/app/worksites/state/worksites.query';
import { WorksitesService } from 'src/app/worksites/state/worksites.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-current-worksite-card',
  templateUrl: './current-worksite-card.component.html',
  styleUrls: ['./current-worksite-card.component.scss'],
  animations: [
    fadeInEnterWithDelayTrigger,
  ]
})
export class CurrentWorksiteCardComponent implements OnInit {

  @Input() class: string;
  currentWorkSite$: Observable<Worksite>;

  constructor(
    private worksiteQuery: WorksitesQuery,
    private worksiteService: WorksitesService,
  ) { }

  ngOnInit() {
    this.currentWorkSite$ = this.worksiteQuery.selectRecentlyUpdateWorksite()
      .pipe(
        map((worksites: Worksite[]) => {
          if (worksites.length > 0) {
            this.worksiteService.setActive(worksites[0].id);
            return worksites[0];
          }
        })
      )
  }
}
