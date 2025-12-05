import { Dispatch, SetStateAction } from 'react';
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface DatePickerProps {
    date: Date;
    setDate: Dispatch<SetStateAction<Date>>;
    id: string;
}

const DatePicker = ({ date, setDate, id }: DatePickerProps) => {
    return (
        <div className="datepicker">
            <label htmlFor={id} className="datepicker__label">Choose a date</label>
            <ReactDatePicker
                id={id}
                minDate={new Date()}
                selected={date}
                onChange={(date: Date) => setDate(date)}
            />
        </div>
    );
};

export default DatePicker;
