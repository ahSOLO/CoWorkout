import { useEffect } from "react";
import Day from "./Day";
import "./styles.scss";
import { allSlots, changeToUserTZ, extractTimeString, getWeekDates } from "../../../calendarHelpers";
import axios from '../../../fakeAxios';
// import axios from 'axios';

// Material UI
import { Box, Container, Typography } from "@material-ui/core";
import ArrowBackIosOutlinedIcon from '@material-ui/icons/ArrowBackIosOutlined';
import ArrowForwardIosOutlinedIcon from '@material-ui/icons/ArrowForwardIosOutlined';
import CalendarTodayOutlinedIcon from '@material-ui/icons/CalendarTodayOutlined';
import FilterListOutlinedIcon from '@material-ui/icons/FilterListOutlined';
import RefreshOutlinedIcon from '@material-ui/icons/RefreshOutlined';

export default function Calendar(props) {

  // Get scrollbar width and compensate width of calendar header accordingly
  useEffect(() => {
    const outerWidth = document.querySelector("div.cal__days").offsetWidth;
    let innerWidth = document.querySelector("div.cal__ticks").offsetWidth; 
    document.querySelectorAll("div.container__slots").forEach( ele => {
      innerWidth += ele.offsetWidth;
    });
    const scrollBarWidth = outerWidth - innerWidth;
    console.log(outerWidth);
    console.log(innerWidth);
    console.log(scrollBarWidth);
    console.log(document.querySelector("div.cal__headers"));
    document.querySelector("div.cal__headers").style.width = `calc(90% - ${scrollBarWidth}px)`;
  }, [])

  axios.get('/api/sessions', {
    params: {
      start_datetime: 'find appointments set for dates after this',
      end_datetime: 'find appointments set for dates before this'
    }
  })
  .then((data) => {

  });

  const targetDay = new Date();
  // for displaying month names dynamically
  const months = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const weekDates = getWeekDates(targetDay); // arr of dates corresponding to MON-SUN

  const calHeaders = weekDays.map(
    (weekDay, i) => {
      return (
      <header className="cal">
        <Typography variant='h3'>
          {weekDates[i]}
        </Typography>
        <Typography variant='subtitle1'>
          {weekDay}
        </Typography>
      </header>
      )
    }
  );

  const hours = ["12am", "1am", "2am", "3am", "4am", "5am", "6am", "7am", "8am", "9am", "10am", "11am", "12am", "1pm", "2pm", "3pm", "4pm", "5pm", "6pm", "7pm", "8pm", "9pm", "10pm", "11pm"]
  const calTicks = hours.map( hour => {
      return (
        <>
          <p>{hour}</p>
          <p>:15</p>
          <p>:30</p>
          <p>:45</p>
        </>
      )
    }
  )

  return (
    <div class="cal__container">
      <section class="cal__top">
        <Typography variant='h4'>
          {months[targetDay.getMonth()]} {weekDates[0]} - {weekDates[0] + 6}
        </Typography>
        <ArrowBackIosOutlinedIcon fontSize="large" />
        <ArrowForwardIosOutlinedIcon fontSize="large" />
        <CalendarTodayOutlinedIcon fontSize="large" />
        <FilterListOutlinedIcon fontSize="large" />
        <RefreshOutlinedIcon fontSize="large" />
      </section>
      <section class="cal__main">
        <div className="cal__headers">
          {calHeaders}
        </div>
        <div className="cal__days">
          <div className="cal__ticks">
            {calTicks}
          </div>
            <Day />
            <Day />
            <Day />
            <Day />
            <Day />
            <Day />
            <Day />
        </div>
      </section>
    </div>
  )
}