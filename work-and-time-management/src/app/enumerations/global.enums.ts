export enum RouterRoutesEnum {
  WELCOME = 'welcome',
  LOGIN = 'login',
  REGISTER = 'register',
  DASHBOARD = 'dashboard',
  WORKSITES = 'worksites',
  CURRENT_WORKSITE = 'current-worksite',
  ADD_HOURS = 'add-hours',
  MANAGE_WORKSITES = 'manage-worksites',
  EDIT_WORKSITE = 'manage-worksites/edit',
  ADD_WORKSITE = 'manage-worksites/add',
  MANAGE_WORKTYPES = 'manage-worktypes',
  EDIT_WORKTYPE = 'manage-worktypes/edit',
  ADMIN_SETTINGS = 'admin-settings',
  ADD_WORKTYPE = 'manage-worktypes/add',
  USER_MANAGEMENT = 'user-management',
}

export enum FireBaseCollectionsEnum {
  WORKSITES = 'worksites',
  USERS = 'users',
  USERS_INFOS = 'users-infos',
  HOURS = 'hours',
  WORKTYPES = 'worktypes',
  WHITELISTED = 'whitelisted-users',
}

export enum Role {
  ADMIN = 'admin',
  MANAGER = 'manager',
}
