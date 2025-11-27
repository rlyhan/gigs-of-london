import { Dispatch, SetStateAction } from 'react';
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface DatePickerProps {
    date: Date;
    setDate: Dispatch<SetStateAction<Date>>;
}

const DatePicker = ({ date, setDate }: DatePickerProps) => {
    return (
        <div className="datepicker">
            <div className="datepicker__label">Choose a date</div>
            <ReactDatePicker
                minDate={new Date()}
                selected={date}
                onChange={(date: Date) => setDate(date)}
            />
        </div>
    );
};

export default DatePicker;
