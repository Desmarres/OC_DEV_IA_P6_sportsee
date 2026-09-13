import { smallMonths } from "@/config/constants";

export function formatDate(date) {
    return new Intl.DateTimeFormat("fr-FR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    }).format(new Date(date));
}


export function listFormatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const smallMonth = smallMonths[date.getMonth()]
    const day = String(date.getDate()).padStart(2, '0');

    return {
        date: date,
        formatISO: `${year}-${month}-${day}`,
        formatEuropean: `${day}/${month}/${year}`,
        formatSmall: `${day} ${smallMonth}`,
    }
}

export function formatDateWeek(date = new Date()) {

    const day = date.getDay();
    const diffToMonday = day === 0 ? -6 : 1 - day;

    const monday = new Date(date);
    monday.setDate(date.getDate() + diffToMonday);

    const nextMonday = new Date(monday);
    nextMonday.setDate(nextMonday.getDate() + 6);

    return {
        startWeek: listFormatDate(monday),
        endWeek: listFormatDate(nextMonday)
    };
}

export function formatDateRelativePeriod(lastDay = new Date(), period = 28) {

    const firstDay = new Date(lastDay);
    firstDay.setDate(firstDay.getDate() - period);

    return {
        startWeekPeriod: listFormatDate(firstDay),
        endWeekPeriod: listFormatDate(lastDay)
    };
}

export function getLastWeeks(numberOfWeeks = 4, lastDay = new Date()) {
    const currentWeek = formatDateWeek(lastDay);

    const weeks = [];

    for (let i = numberOfWeeks - 1; i >= 0; i--) {
        const monday = new Date(currentWeek.startWeek.date);
        monday.setDate(monday.getDate() - i * 7);

        weeks.push({
            ...formatDateWeek(monday),
            distance: 0,
        });
    }

    return weeks;
}