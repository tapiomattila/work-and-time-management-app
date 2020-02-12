import { trigger, transition, style, animate } from '@angular/animations';

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
