import { Component, OnInit } from '@angular/core';
import { WorkTypeQuery, WorkType, WorkTypeService } from 'src/app/worktype/state';
import { Observable, Subscription, BehaviorSubject } from 'rxjs';
import { Router, ActivatedRoute, Params, NavigationStart } from '@angular/router';
import { RouterRoutesEnum } from 'src/app/enumerations/global.enums';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserQuery } from 'src/app/auth/user';

@Component({
  selector: 'app-manage-worktypes',
  templateUrl: './manage-worktypes.component.html',
  styleUrls: ['./manage-worktypes.component.scss']
})
export class ManageWorktypesComponent implements OnInit {

  subscriptions: Subscription[] = [];

  private modalSubj = new BehaviorSubject<boolean>(false);
  modalObs$ = this.modalSubj.asObservable();

  activeWorktype$: Observable<WorkType>;
  worktypes$: Observable<WorkType[]>;
  showModal$: Observable<boolean>;
  worktypeForm: FormGroup;

  constructor(
    private worktypeQuery: WorkTypeQuery,
    private router: Router,
    private route: ActivatedRoute,
    private worktypeService: WorkTypeService,
    private userQuery: UserQuery
  ) { }

  ngOnInit() {
    this.worktypes$ = this.worktypeQuery.selectAllLiveWorktypes();
    this.activeWorktype$ = this.worktypeQuery.selectActiveWorktype();
    this.initForm();
    this.routeParams();
    this.routeEvents();
    this.modalControl();
  }

  initForm() {
    this.worktypeForm = new FormGroup({
      viewName: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
    });
  }

  routeParams() {
    const routeSubs = this.route.params.subscribe((res: Params) => {
      if (!res.id) {
        console.warn('No route params id');
        return;
      }

      this.modalSubj.next(true);
      const worktype = this.worktypeQuery.getEntity(res.id);

      if (!worktype) {
        const fetchByIdSubs = this.worktypeService.fetchWorktypeById(res.id).subscribe(res2 => {

          if (!res2 || !res2.data) {
            this.router.navigate([RouterRoutesEnum.DASHBOARD]);
            return;
          }

          const mapped = res2.data as WorkType;
          this.populateForm(mapped);
          this.worktypeService.setActive(res2.id);

        });
        this.subscriptions.push(fetchByIdSubs);
        return;
      }

      if (worktype) {
        this.populateForm(worktype);
        this.worktypeService.setActive(worktype.id);
      }
    });
    this.subscriptions.push(routeSubs);
  }

  routeEvents() {
    const routerEventSubs = this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        if (event.url.includes(`/${RouterRoutesEnum.EDIT_WORKSITE}`)) {
          this.modalSubj.next(true);
        }

        if (event.url === `/${RouterRoutesEnum.ADD_WORKSITE}`) {
          this.modalSubj.next(true);
        }
      }
    });
    this.subscriptions.push(routerEventSubs);
  }

  modalControl() {
    const modalSubs = this.modalObs$.subscribe(res => {
      if (!res) {
        const url = this.route.snapshot.url;
        if (url) {

          url.forEach(el => {
            if (el && el.path === 'add') {
              this.modalSubj.next(true);
            }
          });
        }
      }
    });
    this.subscriptions.push(modalSubs);
  }

  populateForm(worktype: WorkType) {
    this.worktypeForm.controls.viewName.setValue(worktype.viewName);
  }

  backArrowPressed() {
    this.router.navigate([RouterRoutesEnum.DASHBOARD]);
  }

  edit(worktype: WorkType, index: number) {
    this.worktypeService.setActive(worktype.id);
    this.router.navigate([`${RouterRoutesEnum.EDIT_WORKTYPE}/${worktype.id}`]);
  }

  addNew() {
    this.router.navigate([RouterRoutesEnum.ADD_WORKTYPE]);
  }

  submit() {
    if (!this.worktypeForm.valid) {
      return;
    }

    const controlValue = this.worktypeForm.controls.viewName.value;
    const activeWorktype = this.worktypeQuery.getActive() as WorkType;

    const workType = controlValue.split(' ').join('_').toLowerCase();
    const values = {
      viewName: controlValue,
      workType
    };

    if (activeWorktype) {
      this.updateWorktype(values, activeWorktype);
    } else {
      this.postNewWorktype(values);
    }
  }

  postNewWorktype(formValues: Partial<WorkType>) {

    const user = this.userQuery.getValue();

    const newWorktype: Partial<WorkType> = {
      createdAt: new Date().toISOString(),
      createdBy: user.id,
      updatedAt: new Date().toISOString(),
      updatedBy: user.id,
      viewName: formValues.viewName,
      workType: formValues.workType
    };

    this.worktypeService.postNewWorktype(newWorktype).subscribe(worktype => {
      this.worktypeService.addNewWorktypeToStore(newWorktype, worktype.id);

      setTimeout(() => {
        this.closeModal();
      }, 250);
    });

  }

  updateWorktype(formValues: Partial<WorkType>, activeWorktype: WorkType) {
    const user = this.userQuery.getValue();
    const updatedWorktype: Partial<WorkType> = {
      updatedAt: new Date().toISOString(),
      updatedBy: user.id,
      viewName: formValues.viewName,
      workType: formValues.workType
    };


    this.worktypeService.putWorktype(activeWorktype.id, updatedWorktype).subscribe(() => {
      this.worktypeService.updateWorktype(activeWorktype, updatedWorktype);

      setTimeout(() => {
        this.closeModal();
      }, 250);
    });
  }

  deleteWorktype() {
    if (prompt('Type "remove" to delete worktype') === 'remove') {
      const active = this.worktypeQuery.getActive() as WorkType;
      const user = this.userQuery.getValue();

      this.worktypeService.putWorktype(active.id,
        {
          updatedAt: new Date().toISOString(),
          updatedBy: user.id,
          deleted: true
        })
        .subscribe(() => {
          this.worktypeService.updateDeleted(active, {
            updatedAt: new Date().toISOString(),
            updatedBy: user.id,
            deleted: true
          });

          setTimeout(() => {
            this.closeModal();
          }, 250);
        });
    }
  }

  closeModal() {
    this.worktypeService.setActive(null);
    this.modalSubj.next(false);
    this.router.navigate([`${RouterRoutesEnum.MANAGE_WORKTYPES}`]);
  }
}