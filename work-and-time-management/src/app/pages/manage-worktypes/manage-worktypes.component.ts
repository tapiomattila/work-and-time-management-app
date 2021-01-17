import { Component, OnInit, OnDestroy } from '@angular/core';
import { WorkTypeQuery, WorkType, WorkTypeService } from 'src/app/stores/worktypes/state';
import { Observable, Subscription } from 'rxjs';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { RouterRoutesEnum } from 'src/app/enumerations/global.enums';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserQuery } from 'src/app/auth/user';
import { ManageService } from '../manage,service';
import { fadeInEnterTrigger } from 'src/app/animations/animations';

@Component({
  selector: 'app-manage-worktypes',
  templateUrl: './manage-worktypes.component.html',
  styleUrls: ['./manage-worktypes.component.scss'],
  animations: [
    fadeInEnterTrigger
  ]
})
export class ManageWorktypesComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];

  activeWorktype$: Observable<WorkType>;
  worktypes$: Observable<WorkType[]>;
  showModal$: Observable<boolean>;
  worktypeForm: FormGroup;

  constructor(
    private worktypeQuery: WorkTypeQuery,
    private router: Router,
    private route: ActivatedRoute,
    private worktypeService: WorkTypeService,
    private userQuery: UserQuery,
    public manageService: ManageService
  ) { }

  ngOnInit() {
    this.worktypes$ = this.worktypeQuery.selectAllLiveWorktypes();
    this.activeWorktype$ = this.worktypeQuery.selectActiveWorktype();
    this.initForm();
    this.routeParams();
    this.manageService.routeEvents(RouterRoutesEnum.ADD_WORKTYPE, RouterRoutesEnum.EDIT_WORKTYPE);
    this.manageService.modalControl(this.route);
  }

  initForm() {
    this.worktypeForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
      rate: new FormControl(null, [Validators.required, Validators.min(0), Validators.max(5000)])
    });
  }

  routeParams() {
    const routeSubs = this.route.params.subscribe((res: Params) => {
      if (!res.id) {
        console.warn('No route params id');
        return;
      }

      this.manageService.setModal(true);
      const worktype = this.worktypeQuery.getEntity(res.id);
      this.setupModal(worktype, res);
      if (worktype) {
        this.populateForm(worktype);
        this.worktypeService.setActive(worktype.id);
      }
    });
    this.subscriptions.push(routeSubs);
  }

  setupModal(worktype: WorkType, routeResponse: Params) {
    if (!worktype) {
      const fetchByIdSubs = this.worktypeService.fetchWorktypeById(routeResponse.id).subscribe(res2 => {

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
  }

  populateForm(worktype: WorkType) {
    this.worktypeForm.controls.name.setValue(worktype.name);
    this.worktypeForm.controls.rate.setValue(worktype.rate);
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

  onFocus() {
    if (this.worktypeForm.controls.rate.value === 0) {
      this.worktypeForm.controls.rate.reset();
    }
  }

  submit() {
    if (!this.worktypeForm.valid) {
      return;
    }

    const controlValue = this.worktypeForm.controls.name.value;
    const activeWorktype = this.worktypeQuery.getActive() as WorkType;
    const values = {
      name: controlValue,
      rate: this.worktypeForm.controls.rate.value
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
      // viewName: formValues.viewName,
      name: formValues.name,
      rate: formValues.rate,
      _c: this.userQuery.getValue()._c
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
      // viewName: formValues.viewName,
      name: formValues.name,
      rate: formValues.rate
    };

    this.worktypeService.putWorktype(activeWorktype.id, updatedWorktype)
      .subscribe(() => {
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
    this.manageService.setModal(false);
    this.router.navigate([`${RouterRoutesEnum.MANAGE_WORKTYPES}`]);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(el => el.unsubscribe());
    this.manageService.subscriptions.forEach(el => el.unsubscribe());
  }
}
