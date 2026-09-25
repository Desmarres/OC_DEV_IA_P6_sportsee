import { Controller } from "react-hook-form";
import {
    differenceInCalendarWeeks,
    endOfWeek,
    format,
    isWithinInterval,
    startOfWeek,
} from "date-fns";
import { fr } from "date-fns/locale";
import { DayPicker } from "@daypicker/react";

import styles from "./WeekRangePicker.module.css";
import CustomMonthCaption from "../CustomMonthCaption/CustomMonthCaption";
import CustomNav from "../CustomNav/CustomNav";

export default function WeekRangePicker({ control }) {
    return (
        <Controller
            name="weekRange"
            control={control}
            defaultValue={{
                start: null,
                end: null,
            }}
            render={({ field }) => {
                const { start, end } = field.value;

                // Dates de référence
                const today = new Date();

                const currentWeekStart = startOfWeek(today, {
                    weekStartsOn: 1,
                });

                // Nombre de semaines sélectionnées
                const selectedWeeks =
                    start && end
                        ? differenceInCalendarWeeks(end, start, {
                            weekStartsOn: 1,
                        }) + 1
                        : start
                            ? 1
                            : 0;

                // Utilitaires
                const getWeek = (date) => ({
                    start: startOfWeek(date, {
                        weekStartsOn: 1,
                    }),
                    end: endOfWeek(date, {
                        weekStartsOn: 1,
                    }),
                });

                const isSameWeek = (date1, date2) => {
                    return (
                        startOfWeek(date1, {
                            weekStartsOn: 1,
                        }).getTime() ===
                        startOfWeek(date2, {
                            weekStartsOn: 1,
                        }).getTime()
                    );
                };

                // Semaines désactivées
                const isWeekDisabled = (date) => {
                    const week = getWeek(date);

                    return week.start <= currentWeekStart;
                };

                // Sélection
                const handleDayClick = (date) => {
                    // Empêche la sélection des semaines passées
                    // et de la semaine en cours.
                    if (isWeekDisabled(date)) {
                        return;
                    }

                    const week = getWeek(date);

                    // Première sélection
                    // ou nouvelle sélection après une plage complète.
                    if (!start || end) {
                        field.onChange({
                            start: week.start,
                            end: null,
                        });

                        return;
                    }

                    // Si la deuxième semaine est avant la première,
                    // on inverse la plage.
                    if (week.start < start) {
                        field.onChange({
                            start: week.start,
                            end: endOfWeek(start, {
                                weekStartsOn: 1,
                            }),
                        });

                        return;
                    }

                    // Deuxième sélection
                    field.onChange({
                        start,
                        end: week.end,
                    });
                };

                // Semaine sélectionnée
                const isSelectedWeek = (date) => {
                    if (!start) {
                        return false;
                    }

                    const currentWeek = getWeek(date);

                    // Première semaine sélectionnée
                    if (!end) {
                        return isSameWeek(currentWeek.start, start);
                    }

                    // Plage complète
                    return isWithinInterval(currentWeek.start, {
                        start,
                        end,
                    });
                };

                // Modifiers
                const modifiers = {
                    selectedWeek: isSelectedWeek,

                    startWeek: (date) => {
                        if (!start) {
                            return false;
                        }

                        return isSameWeek(date, start);
                    },

                    endWeek: (date) => {
                        if (!end) {
                            return false;
                        }

                        return isSameWeek(date, end);
                    },

                    today: (date) => {
                        return date.toDateString() === today.toDateString();
                    },

                    disabledWeek: isWeekDisabled,
                };

                // Rendu
                return (
                    <div className={styles.pickerContainer}>
                        <DayPicker
                            mode="single"
                            locale={fr}
                            weekStartsOn={1}
                            onDayClick={handleDayClick}
                            disabled={isWeekDisabled}
                            modifiers={modifiers}
                            modifiersClassNames={{
                                selectedWeek: styles.selectedWeek,
                                today: styles.today,
                                disabledWeek: styles.disabledWeek,
                            }}
                            components={{
                                Nav: CustomNav,
                                MonthCaption: CustomMonthCaption,
                            }}
                        />

                        <div className={styles.summary}>
                            <div>
                                <span className={styles.label}>
                                    Début du programme
                                </span>

                                <strong>
                                    {start
                                        ? format(start, "dd/MM/yyyy")
                                        : "—"}
                                </strong>
                            </div>

                            <div>
                                <span className={styles.label}>
                                    Fin du programme
                                </span>

                                <strong>
                                    {end
                                        ? format(end, "dd/MM/yyyy")
                                        : "—"}
                                </strong>
                            </div>

                            <div>
                                <span className={styles.label}>
                                    Nombre de semaines
                                </span>

                                <strong>{selectedWeeks}</strong>
                            </div>
                        </div>
                    </div>
                );
            }}
        />
    );
}