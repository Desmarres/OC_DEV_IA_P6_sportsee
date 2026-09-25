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

/**
 * Affiche un sélecteur permettant à l'utilisateur de choisir une période
 * composée d'une ou plusieurs semaines pour son programme d'entraînement.
 *
 * Le composant permet de sélectionner les semaines à partir du calendrier,
 * désactive les semaines passées et la semaine en cours, puis affiche
 * un récapitulatif de la période sélectionnée et du nombre de semaines.
 * La sélection est synchronisée avec le formulaire via React Hook Form.
 *
 * @param {Object} props - Les propriétés du composant.
 * @param {Object} props.control - Contrôle du formulaire fourni par React Hook Form.
 *
 * @returns {JSX.Element} Le calendrier de sélection de la période
 * et le récapitulatif des semaines sélectionnées.
 */
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

                // Calcule les dates de début et de fin de la semaine contenant la date donnée.
                const getWeek = (date) => ({
                    start: startOfWeek(date, {
                        weekStartsOn: 1,
                    }),
                    end: endOfWeek(date, {
                        weekStartsOn: 1,
                    }),
                });

                /**
                 * Vérifie si deux dates appartiennent à la même semaine.
                 *
                 * @param {Date} date1 - Première date à comparer.
                 * @param {Date} date2 - Deuxième date à comparer.
                 *
                 * @returns {boolean} `true` si les deux dates appartiennent à la même semaine.
                 */
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

                /* Vérifie si une semaine doit être désactivée.
                Les semaines passées et la semaine en cours ne peuvent pas être sélectionnées. */
                const isWeekDisabled = (date) => {
                    const week = getWeek(date);

                    return week.start <= currentWeekStart;
                };

                /**
                 * Gère la sélection d'une semaine dans le calendrier.
                 *
                 * Initialise une nouvelle sélection, inverse la plage si nécessaire
                 * ou définit la date de fin lorsque la première semaine est déjà sélectionnée.
                 *
                 * @param {Date} date - Date correspondant à la semaine sélectionnée.
                 */
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

                // Détermine si une semaine fait partie de la plage actuellement sélectionnée.
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