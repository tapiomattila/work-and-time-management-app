import {
    trigger,
    transition,
    style,
    animate,
    state,
    animation,
} from '@angular/animations';

export const fadeInEnterTrigger = trigger('fadeInEnter', [
    transition(':enter', [
        style({
            opacity: 0,
        }),
        animate(
            '300ms ease-in',
            style({
                opacity: 1,
            })
        ),
    ]),
]);

export const fadeInEnterWithDelayTrigger = trigger('fadeInEnterWithDelay', [
    transition(':enter', [
        style({
            opacity: 0,
        }),
        animate(
            '900ms 100ms ease-in',
            style({
                opacity: 1,
            })
        ),
    ]),
]);

export const fadeInOutDelayTrigger = trigger('fadeInOutDelay', [
    transition(':enter', [
        style({
            opacity: 0,
        }),
        animate('300ms 100ms'),
    ]),
    transition(':leave', [
        style({
            opacity: 0,
        }),
        animate(3000),
    ]),
]);

export const fadeInOutTrigger = trigger('fadeInOut', [
    transition(':enter', [
        style({
            opacity: 0,
        }),
        animate('450ms ease-in'),
    ]),
    transition(':leave', [
        style({
            opacity: 0,
        }),
        animate('450ms ease-in'),
    ]),
]);

export const fadeInSecondaryTrigger = trigger('fadeInSecondary', [
    transition(':enter', [
        style({
            opacity: 0,
        }),
        animate('450ms ease-in'),
    ]),
    transition(':leave', [
        style({
            opacity: 0,
        }),
        animate('0ms ease-out'),
    ]),
]);

export const hoursAddedTrigger = trigger('hoursAddedState', [
    state('noAddition', style({})),
    state(
        'addition',
        style({
            transform: 'scale(1.12)',
        })
    ),
    transition(
        'noAddition <=> addition',
        animate('400ms 100ms ease-in')
    ),
]);

export const translateXRightTrigger = trigger('translateXRight', [
    state(
        'default',
        style({
            transform: 'translateX(0)',
        })
    ),
    state(
        'moved',
        style({
            transform: 'translateX(-10px)',
        })
    ),
    transition('default => moved', [
        style({
            transform: 'translateX(-40px)',
        }),
        animate('300ms'),
    ]),
    transition('moved => default', [
        style({
            transform: 'translateX(40px)',
        }),
        animate('300ms'),
    ]),
]);

export const pulseInitTrigger = trigger('pulseInit', [
    transition(':enter', [
        style({
            transform: 'scale(1.12)',
        }),
        animate(
            '300ms ease-in',
            style({
                transform: 'scale(1)',
            })
        ),
    ]),
]);
