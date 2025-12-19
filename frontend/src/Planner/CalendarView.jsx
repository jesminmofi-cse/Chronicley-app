import React, {useState} from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './CalendarView.css';
import {format} from 'date-fns';

const CalendarView=()=>{
    const [date, setDate]= useState(new Date());
    return (
        <div className='calendar-container'>
            <h2 className='calendar-heading'> Your life at a  glance</h2>
            <Calendar
                onChange={setDate}
                value={date}
                titleclassName={({date, view})=>{
                    if (format(date, 'yyyy-MM-dd')===format(new Date(),'yyyy-MM-dd')){
                        return 'today-title';
                    }
                }}
                />
            <p className ='calendar-date-display'>
                You picked:<strong> {format (date, 'do MMM yyyy')}</strong>
            </p>
        </div>
    );
};
export default CalendarView;