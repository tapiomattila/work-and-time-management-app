import { trigger, transition, style, animate, state } from '@angular/animations';

export const fadeInEnterTrigger = trigger('fadeInEnter', [
    transition(':enter', [
        style({
            opacity: 0
        }),
        animate(900, style({
            opacity: 1
        }))
    ])
])

export const fadeInEnterWithDelayTrigger = trigger('fadeInEnterWithDelay', [
    transition(':enter', [
        style({
            opacity: 0
        }),
        animate('900ms 100ms ease-in', style({
            opacity: 1
        }))
    ])
])

export const translateXRightTrigger = trigger('translateXRight', [
    state('default', style({
        transform: 'translateX(0)'
    })),
    state('moved', style({
        transform: 'translateX(-10px)'
    })),
    transition('default => moved', [
        style({
            transform: 'translateX(-40px)'
        }),
        animate('300ms')
    ]),
    transition('moved => default', [
        style({
            transform: 'translateX(40px)'
        }),
        animate('300ms')
    ])
])
