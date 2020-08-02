import { Hours } from '../auth/hours';
import * as moment from 'moment';

export function formatHours(hours: number) {
    if (typeof(hours) === 'number') {
        const frac = hours % 1;

        if (frac === 0) {
            return `${hours.toString()}h`;
        }

        const full = hours - frac;
        return `${full}h ${frac * 60}min`;
    } else {
        return hours;
    }
}

// export function selectTableHours(hours: Hours[]) {
//     return hours.map(el => {
//         const worksiteName = this.worksiteQuery.getWorksiteById(el.worksiteId);
//         const worksiteNameFound = worksiteName ? worksiteName[0].nickname : undefined;

//         const worktypeId = this.hoursQuery.getHourWorktype(el.id);
//         const worktype = this.worktypeQuery.getWorktypeById(worktypeId);
//         const worktypeNameFound = worktype ? worktype.viewName : undefined;

//         const formattedDate = moment(el.updatedAt).format('DD.MM.YYYY');
//         const hoursFormatted = this.formatHours(el.markedHours);

//         return {
//             id: el.id,
//             createdAt: el.createdAt,
//             updateAt: el.updatedAt,
//             updateAtFormatted: formattedDate,
//             worksiteId: el.worksiteId,
//             worksiteName: worksiteNameFound,
//             worktypeId,
//             worktypeName: worktypeNameFound,
//             hours: el.markedHours,
//             hoursFormatted
//         };
//     });
// }
