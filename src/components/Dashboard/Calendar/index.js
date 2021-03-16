import { useEffect } from "react";
import Day from "./Day";
import "./styles.scss";
import { allAppointments, changeToUserTZ, extractTimeString, getWeekDates } from "../../../calendarHelpers";
import axios from '../../../fakeAxios';
// import axios from 'axios';

// Material UI
import { Box, Container, Typography } from "@material-ui/core";
import ArrowBackIosOutlinedIcon from '@material-ui/icons/ArrowBackIosOutlined';
import ArrowForwardIosOutlinedIcon from '@material-ui/icons/ArrowForwardIosOutlined';
import CalendarTodayOutlinedIcon from '@material-ui/icons/CalendarTodayOutlined';

export default function Calendar(props) {

  // Get scrollbar width and compensate width of calendar accordingly
  useEffect(() => {
    const outerWidth = document.querySelector("div.cal__days").offsetWidth;
    let innerWidth = document.querySelector("div.cal__ticks").offsetWidth; 
    document.querySelectorAll("div.container__slots").forEach( ele => {
      innerWidth += ele.offsetWidth;
    });
    const scrollBarWidth = outerWidth - innerWidth;
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

  return (
    <div class="cal__container">
      <section class="cal__top">
        <Typography variant='h4'>
          March 8 - 14
        </Typography>
        <ArrowBackIosOutlinedIcon />
        <ArrowForwardIosOutlinedIcon />
        <CalendarTodayOutlinedIcon />
      </section>
      <section class="cal__main">
        <div className="cal__headers">
          {calHeaders}
        </div>
        <div className="cal__days">
          <div className="cal__ticks">
            <p>12am</p>
            <p>:15</p>
            <p>:30</p>
            <p>:45</p>
            <p>1am</p>
            <p>:15</p>
            <p>:30</p>
            <p>:45</p>
            <p>2am</p>
            <p>:15</p>
            <p>:30</p>
            <p>:45</p>
            <p>3am</p>
            <p>:15</p>
            <p>:30</p>
            <p>:45</p>
            <p>4am</p>
            <p>:15</p>
            <p>:30</p>
            <p>:45</p>
            <p>5am</p>
            <p>:15</p>
            <p>:30</p>
            <p>:45</p>
            <p>6am</p>
            <p>:15</p>
            <p>:30</p>
            <p>:45</p>
            <p>7am</p>
            <p>:15</p>
            <p>:30</p>
            <p>:45</p>
            <p>8am</p>
            <p>:15</p>
            <p>:30</p>
            <p>:45</p>
            <p>9am</p>
            <p>:15</p>
            <p>:30</p>
            <p>:45</p>
            <p>10am</p>
            <p>:15</p>
            <p>:30</p>
            <p>:45</p>
            <p>11am</p>
            <p>:15</p>
            <p>:30</p>
            <p>:45</p>
            <p>12pm</p>
            <p>:15</p>
            <p>:30</p>
            <p>:45</p>
            <p>1pm</p>
            <p>:15</p>
            <p>:30</p>
            <p>:45</p>
            <p>2pm</p>
            <p>:15</p>
            <p>:30</p>
            <p>:45</p>
            <p>3pm</p>
            <p>:15</p>
            <p>:30</p>
            <p>:45</p>
            <p>4pm</p>
            <p>:15</p>
            <p>:30</p>
            <p>:45</p>
            <p>5pm</p>
            <p>:15</p>
            <p>:30</p>
            <p>:45</p>
            <p>6pm</p>
            <p>:15</p>
            <p>:30</p>
            <p>:45</p>
            <p>7pm</p>
            <p>:15</p>
            <p>:30</p>
            <p>:45</p>
            <p>8pm</p>
            <p>:15</p>
            <p>:30</p>
            <p>:45</p>
            <p>9pm</p>
            <p>:15</p>
            <p>:30</p>
            <p>:45</p>
            <p>10pm</p>
            <p>:15</p>
            <p>:30</p>
            <p>:45</p>
            <p>11pm</p>
            <p>:15</p>
            <p>:30</p>
            <p>:45</p>
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