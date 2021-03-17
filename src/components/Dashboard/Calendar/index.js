import { useEffect, useState } from "react";
import Day from "./Day";
import "./styles.scss";
import { getWeekDates, rebuildAppointmentObjs } from "helpers/calendarHelpers";
import useApplicationData from 'hooks/useApplicationData';

// Material UI
import { Typography, IconButton } from "@material-ui/core";
import ArrowBackIosOutlinedIcon from '@material-ui/icons/ArrowBackIosOutlined';
import ArrowForwardIosOutlinedIcon from '@material-ui/icons/ArrowForwardIosOutlined';
import CalendarTodayOutlinedIcon from '@material-ui/icons/CalendarTodayOutlined';
import FilterListOutlinedIcon from '@material-ui/icons/FilterListOutlined';
import RefreshOutlinedIcon from '@material-ui/icons/RefreshOutlined';
import AddIcon from '@material-ui/icons/Add';

export default function Calendar(props) {

  // fetch data from db
  const { slots, setSlots, appointments, setAppointments} = useApplicationData();
  const [ targetDay, setTargetDay ] = useState(new Date());

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

  const setWeek = function(direction) {
    if (targetDay && direction === 'forward') {
      setTargetDay((prev) => {
        return new Date(prev.setDate(prev.getDate() + 7));
      });
    } else {
      setTargetDay((prev) => {
        return new Date(prev.setDate(prev.getDate() - 7));
      });
    }
  };

  // for displaying month names dynamically
  const months = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  console.log('type:', typeof(targetDay));
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

  const displayCurrentMonthDay = function(weekDates, months, targetDay) {
    const monthInt = targetDay.getMonth();
    const fromMonth = months[monthInt];
    let toMonth = '';
    const fromDate = weekDates[0];
    const toDate = weekDates.slice(-1)[0];

    if (toDate < fromDate) {
      toMonth = months[monthInt + 1];
    } else if(toDate > fromDate && (toDate - fromDate !== 6) ) {
      toMonth = months[monthInt - 1];
    }

    return `${fromMonth} ${fromDate} - ${toMonth} ${toDate}`;

  }

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
  // console.log(slots['WED']);
  return (
    <div class="cal__container">
      <section class="cal__top">
        <Typography variant='h4'>
          {displayCurrentMonthDay(weekDates, months, targetDay)}
        </Typography>
        <IconButton variant="outlined">
          <ArrowBackIosOutlinedIcon fontSize="large" onClick={setWeek}/>
        </IconButton>
        <IconButton>
          <ArrowForwardIosOutlinedIcon fontSize="large" onClick={() => {setWeek('forward')}} />
        </IconButton>
        <IconButton>
          <CalendarTodayOutlinedIcon fontSize="large"/>
        </IconButton>
        <IconButton>
          <FilterListOutlinedIcon fontSize="large"/>
        </IconButton>
        <IconButton>
          <RefreshOutlinedIcon fontSize="large"/>
        </IconButton>
      </section>
      <section class="cal__main">
        <div className="cal__headers">
          {calHeaders}
        </div>
        <div className="cal__days">
          <div className="cal__ticks">
            {calTicks}
          </div>
            <Day user={props.user} slots={slots['MON']} />
            <Day user={props.user} slots={slots['TUE']} />
            <Day user={props.user} slots={slots['WED']} />
            <Day user={props.user} slots={slots['THU']} />
            <Day user={props.user} slots={slots['FRI']} />
            <Day user={props.user} slots={slots['SAT']} />
            <Day user={props.user} slots={slots['SUN']} />
        </div>
      </section>
      <IconButton id="bookNewButton">
        <AddIcon fontSize="large" />
      </IconButton>
    </div>
  )
}