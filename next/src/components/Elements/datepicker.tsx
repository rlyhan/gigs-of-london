import { Dispatch, SetStateAction } from 'react';
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface DatePickerProps {
    date: Date;
    setDate: Dispatch<SetStateAction<Date>>;
}

const DatePicker = ({ date, setDate }: DatePickerProps) => {
    const inputId = "datepicker-input";
    return (
        <div className="datepicker">
            <label htmlFor={inputId} className="datepicker__label">Choose a date</label>
            <ReactDatePicker
                id={inputId}
                minDate={new Date()}
                selected={date}
                onChange={(date: Date) => setDate(date)}
            />
        </div>
    );
};

export default DatePicker;
