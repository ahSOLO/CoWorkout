import { useEffect, useState } from "react";
import Day from "./Day";
import "./styles.scss";
import { getWeekDates, getWeekDateTimes, rebuildAppointmentObjs } from "helpers/calendarHelpers";
import useApplicationData from 'hooks/useApplicationData';
import BookNew from "components/Buttons/BookNew"; 
import FilterDialog from "components/Dialogs/FilterDialog";
import throttle from 'lodash/throttle';

// Material UI
import { Typography, IconButton } from "@material-ui/core";
import ArrowBackIosOutlinedIcon from '@material-ui/icons/ArrowBackIosOutlined';
import ArrowForwardIosOutlinedIcon from '@material-ui/icons/ArrowForwardIosOutlined';
import CalendarTodayOutlinedIcon from '@material-ui/icons/CalendarTodayOutlined';
import FilterListOutlinedIcon from '@material-ui/icons/FilterListOutlined';
import RefreshOutlinedIcon from '@material-ui/icons/RefreshOutlined';

export default function Calendar(props) {
  
  // fetch data from db
  const { slots, constructSlots } = useApplicationData();
  const [ targetDay, setTargetDay ] = useState(new Date());
  const [ filterOpen, setFilterOpen ] = useState(false);

  const refreshSlots = throttle(() => constructSlots(targetDay), 500);

  const setWeek = function(direction) {
    if (targetDay && direction === 'forward') {
      setTargetDay((prev) => {
        return new Date(prev.setDate(prev.getDate() + 7));
      });
      refreshSlots(targetDay);
    } else {
      setTargetDay((prev) => {
        return new Date(prev.setDate(prev.getDate() - 7));
      });
      refreshSlots(targetDay);
    }
  };

  // for displaying month names dynamically
  const months = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const weekDateTimes = getWeekDateTimes(targetDay);
  const weekDates = weekDateTimes.map( dateTime => dateTime.getDate());

  const calHeaders = weekDays.map(
    (weekDay, i) => {
      return (
      <header key={i} className="cal">
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
    const fromDate = weekDates[0];
    const toDate = weekDates.slice(-1)[0];

    // get sunday's date
    const daysFromSun = targetDay.getDay();
    const startDate = new Date(targetDay.getTime() - (daysFromSun * 24 * 60 * 60 * 1000));
    const monthInt = startDate.getMonth();
    const fromMonth = months[monthInt];
    let toMonth = '';

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

  // Filter Button
  const handleFilterOpen = () => {
    setFilterOpen(true);
  }

  const handleFilterClose = () => {
    setFilterOpen(false);
  }

  // Get scrollbar width and compensate width of calendar header accordingly
  useEffect(() => {
    const outerWidth = document.querySelector("div.cal__days").offsetWidth;
    let innerWidth = document.querySelector("div.cal__ticks").offsetWidth; 
    document.querySelectorAll("div.container__slots").forEach( ele => {
      innerWidth += ele.offsetWidth;
    });
    const scrollBarWidth = outerWidth - innerWidth;
    document.querySelector("div.cal__headers").style.width = `calc(90% - ${scrollBarWidth}px)`;
  }, [])
  
  // console.log(slots['WED']);
  return (
    <div className="cal__container">
      <section className="cal__top">
        <div className="top__text">
          <Typography variant='h4'>
            {displayCurrentMonthDay(weekDates, months, targetDay)}
          </Typography>
        </div>
        <div className="top__icons">
          <IconButton key={0} variant="outlined" onClick={setWeek}>
            <ArrowBackIosOutlinedIcon fontSize="large"/>
          </IconButton>
          <IconButton key={1} onClick={() => {setWeek('forward')}}>
            <ArrowForwardIosOutlinedIcon fontSize="large" />
          </IconButton>
          <IconButton key={2}>
            <CalendarTodayOutlinedIcon fontSize="large"/>
          </IconButton>
          <IconButton key={3} onClick={handleFilterOpen}>
            <FilterListOutlinedIcon fontSize="large" />
          </IconButton>
          <IconButton key={4} onClick={() => {refreshSlots(targetDay)}}>
            <RefreshOutlinedIcon fontSize="large" />
          </IconButton>
        </div>
      </section>
      <section className="cal__main">
        <div className="cal__headers">
          {calHeaders}
        </div>
        <div className="cal__days">
          <div className="cal__ticks">
            {calTicks}
          </div>
          <Day key={0} user={props.user} slots={slots['SUN']} date={weekDateTimes[0]} refreshSlots={refreshSlots} targetDay={targetDay}/>
          <Day key={1} user={props.user} slots={slots['MON']} date={weekDateTimes[1]} refreshSlots={refreshSlots} targetDay={targetDay}/>
          <Day key={2} user={props.user} slots={slots['TUE']} date={weekDateTimes[2]} refreshSlots={refreshSlots} targetDay={targetDay}/>
          <Day key={3} user={props.user} slots={slots['WED']} date={weekDateTimes[3]} refreshSlots={refreshSlots} targetDay={targetDay}/>
          <Day key={4} user={props.user} slots={slots['THU']} date={weekDateTimes[4]} refreshSlots={refreshSlots} targetDay={targetDay}/>
          <Day key={5} user={props.user} slots={slots['FRI']} date={weekDateTimes[5]} refreshSlots={refreshSlots} targetDay={targetDay}/>
          <Day key={6} user={props.user} slots={slots['SAT']} date={weekDateTimes[6]} refreshSlots={refreshSlots} targetDay={targetDay}/>
        </div>
      </section>
      <BookNew user={props.user} />
      <FilterDialog 
        filterOpen={filterOpen}
        handleFilterClose={handleFilterClose}
        user={props.user}
        refreshSlots={refreshSlots}
        targetDay={targetDay}  
      />
    </div>
  )
}