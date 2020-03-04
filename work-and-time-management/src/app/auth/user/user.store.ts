import { Store, StoreConfig } from '@datorama/akita';
import { User } from './user.model';
import { Injectable } from '@angular/core';

export function createInitialState(): User {
  return {
    id: null,
    firstName: '',
    lastName: ''
  };
}

@Injectable({
  providedIn: 'root'
})
@StoreConfig({ name: 'user' })
export class UserStore extends Store<User> {
  constructor() {
    super(createInitialState());
  }
}
