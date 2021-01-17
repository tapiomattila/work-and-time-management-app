import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Users } from 'src/app/auth/admin/users';
import { Worksite } from 'src/app/stores/worksites/state';

@Component({
  selector: 'app-users-element',
  templateUrl: './users-element.component.html',
  styleUrls: ['./users-element.component.scss']
})
export class UsersElementComponent implements OnInit {

  @Output() worksiteUserChange = new EventEmitter<{ userId: string, worksiteId: string, checked: boolean }>();

  usersMapped: {
    uniqId: string,
    id: string,
    firstName: string,
    lastName: string,
    email: string,
  }[];

  @Input()
  set users(value: Users[]) {
    this.usersMapped = value.map(el => {
      return {
        uniqId: this.uniqID(),
        id: el.id,
        firstName: el.firstName,
        lastName: el.lastName,
        email: el.email,
      };
    });
  }

  @Input() worksite: Worksite;

  constructor() { }
  ngOnInit() { }

  setNewChecked(event: any, user: {
    uniqId: string,
    id: string,
    firstName: string,
    lastName: string,
    email: string
  }) {
    this.worksiteUserChange.emit({
      userId: user.id,
      worksiteId: this.worksite.id,
      checked: event
    });
  }

  getChecked(id: string) {
    return this.worksite.users.includes(id);
  }

  uniqID() {
    return '_' + Math.random().toString(36).substr(2, 9);
  }
}
