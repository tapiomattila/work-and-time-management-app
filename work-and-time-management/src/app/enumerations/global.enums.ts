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
    ADD_WORKTYPE = 'manage-worktypes/add',
}

export enum FireBaseCollectionsEnum {
    WORKSITES = 'worksites',
    USERS = 'users',
    HOURS = 'hours',
    WORKTYPES = 'worktypes'
}
