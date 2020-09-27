import { Store, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';
import { Auth } from './auth.model';

export function createInitialState(): Auth {
  return {
    id: null,
    isAuthenticated: false,
    clientId: null
  };
}

@Injectable({
  providedIn: 'root'
})
@StoreConfig({ name: 'auth', resettable: true })
export class AuthStore extends Store<Auth> {
  constructor() {
    super(createInitialState());
  }
}
