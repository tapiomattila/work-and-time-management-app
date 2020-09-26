import { Store, StoreConfig } from '@datorama/akita';
import { User } from './user.model';
import { Injectable } from '@angular/core';

export function createInitialState(): User {
  return {
    id: null,
    firstName: null,
    lastName: null,
    isAdmin: false,
    isManager: false,
    profilePictureUrl: null,
    email: null,
    displayName: null,
    _c: null
  };
}

@Injectable({
  providedIn: 'root'
})
@StoreConfig({ name: 'user', resettable: true })
export class UserStore extends Store<User> {
  constructor() {
    super(createInitialState());
  }
}
