import { Dispatch, SetStateAction, useRef } from 'react';
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import cn from 'classnames';
import { useBreakpoint } from '@/hooks/useBreakpoint';

interface DatePickerProps {
    date: Date;
    setDate: Dispatch<SetStateAction<Date>>;
    id: string;
    useCalendarIcon?: boolean;
}

const DatePicker = ({ date, setDate, id, useCalendarIcon }: DatePickerProps) => {
    const isPhone = useBreakpoint("phone");
    const datepickerRef = useRef<ReactDatePicker | null>(null);

    const openPicker = () => {
        // safely trigger the picker
        if (datepickerRef.current) {
            // @ts-ignore - ReactDatePicker exposes this but type defs don't
            datepickerRef.current.setOpen(true);
        }
    };

    return (
        <div className="datepicker">
            <label htmlFor={id} className={cn("datepicker__label", {
                "sr-only": useCalendarIcon && isPhone
            })}>Choose a date</label>
            <ReactDatePicker
                ref={datepickerRef}
                id={id}
                minDate={new Date()}
                selected={date}
                onChange={(newDate: Date) => setDate(newDate)}
                className={useCalendarIcon && isPhone ? "hidden-datepicker-input" : ""}
                // this ensures the picker shows inputless popup mode
                placeholderText=""
                dateFormat="dd/MM/yyyy"
            />
            {useCalendarIcon && isPhone && (
                <button
                    className="roundIcon"
                    aria-label="Open calendar"
                    onClick={openPicker}
                >
                    <span />
                </button>
            )}
        </div>
    );
};

export default DatePicker;
