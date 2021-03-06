import { useEffect, useState, useContext } from "react";
import ContextContainer from 'contexts/ContextContainer';
import Day from "./Day";
import { withStyles } from "@material-ui/core/styles"
import "./styles.scss";
import { getWeekDates, getWeekDateTimes, rebuildAppointmentObjs } from "helpers/calendarHelpers";
import useApplicationData from 'hooks/useApplicationData';
import BookNew from "components/Buttons/BookNew"; 
import FilterDialog from "components/Dialogs/FilterDialog";
import throttle from 'lodash/throttle';
import MomentUtils from '@date-io/moment';
import moment from "moment";

// Material UI
import { Typography, IconButton, Box } from "@material-ui/core";
import ArrowBackIosOutlinedIcon from '@material-ui/icons/ArrowBackIosOutlined';
import ArrowForwardIosOutlinedIcon from '@material-ui/icons/ArrowForwardIosOutlined';
import CalendarTodayOutlinedIcon from '@material-ui/icons/CalendarTodayOutlined';
import FilterListOutlinedIcon from '@material-ui/icons/FilterListOutlined';
import RefreshOutlinedIcon from '@material-ui/icons/RefreshOutlined';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';

export default function Calendar(props) {
  
  // fetch data from db
  const { slots, constructSlots } = useApplicationData();
  const [ targetDay, setTargetDay ] = useState(new Date());
  const [ filterOpen, setFilterOpen ] = useState(false);
  const [date, setDate] = useState(moment());
  const [minDate, setMinDate] = useState(moment().startOf('day'));
  const [openDatePicker, setOpenDatePicker] = useState(false);

  const { appState, setAppState, renderUpcoming } = useContext(ContextContainer);

  // Main refresh function - takes the target day and filtering options for the query. Throttled to prevent refresh spam.
  const refreshSlots = (targetDay, filterOptions = {}) => {
    throttle(() => constructSlots(targetDay, filterOptions), 500)();
    renderUpcoming();
  }

  const setWeek = function(direction) {
    if (targetDay && direction === 'forward') {
      // This horrendous line is needed because date objects are mutable, so we need to clone targetDay before performing calculations on it, and then put the results in a new date object to be passed into setTargetDayMinToday.
      setTargetDayMinToday(new Date(new Date(targetDay.getTime()).setDate(targetDay.getDate() + 7))).then(res => refreshSlots(res));
    } else {
      setTargetDayMinToday(new Date(new Date(targetDay.getTime()).setDate(targetDay.getDate() - 7))).then(res => refreshSlots(res));
    }
  };

  const setTargetDayMinToday = function(targetDay) {
    // Return promise because setState functions are asynchronous, we don't want to refresh before the new target day is set.
    return new Promise((resolve, reject) => {
      // Borrow minDate state instead of calling moment() each time - no need to worry about stale state as it does not change
      if (minDate.diff(targetDay, 'minutes') > 0) {
        // Change the mutable targetDay object directly and return it instead of passing in a value to setTargetDay. 
        // Keeping targetDay pointed to a single mutable datetime object ensures that it will not go stale.
        setTargetDay(prev => {
          prev.setTime(minDate.toDate().getTime());
          resolve(prev);
          return prev;
        });
      } else {
        setTargetDay(prev => {
          prev.setTime(targetDay.getTime())
          resolve(prev);
          return prev;
        });
      }
   });
  }

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

  const hours = ["12am", "1am", "2am", "3am", "4am", "5am", "6am", "7am", "8am", "9am", "10am", "11am", "12pm", "1pm", "2pm", "3pm", "4pm", "5pm", "6pm", "7pm", "8pm", "9pm", "10pm", "11pm"]
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

  // On initial render...
  useEffect(() => {
    // Get scrollbar width and compensate width of calendar header accordingly
    const outerWidth = document.querySelector("div.cal__days").offsetWidth;
    let innerWidth = document.querySelector("div.cal__ticks").offsetWidth; 
    document.querySelectorAll("div.container__slots").forEach( ele => {
      innerWidth += ele.offsetWidth;
    });
    const scrollBarWidth = outerWidth - innerWidth;
    document.querySelector("div.cal__headers").style.width = `calc(90% - ${scrollBarWidth}px)`;

    // Scroll into view of current time
    const calDays = document.getElementsByClassName("cal__days")[0];
    const calDaysHeight = calDays.scrollHeight;
    const currentHour = moment().format("HH");
    const yPos = (currentHour) * calDaysHeight / 24;
    document.getElementsByClassName("cal__days")[0].scroll(0, yPos < calDaysHeight ? yPos - 10: (calDaysHeight - calDays.offsetHeight) );

    // Remove loading screen
    props.setLoading(false)
  }, [])
  
  // Custom styled icon buttons
  const CalendarIconButton = withStyles({
    root: {
      borderRadius: "0px",
    },
  })(IconButton);

  return (
    <div className="cal__container">
      <section className="cal__top">
        <div className="top__text">
          <Typography variant='h4' onClick={() => document.getElementsByClassName("cal__days")[0].scrollTop = 1500}>
            {displayCurrentMonthDay(weekDates, months, targetDay)}
          </Typography>
        </div>
        <div className="top__icons">
          <CalendarIconButton key={0} onClick={setWeek}>
            <ArrowBackIosOutlinedIcon fontSize="large"/>
          </CalendarIconButton>
          <CalendarIconButton key={1} onClick={() => {setWeek('forward')}}>
            <ArrowForwardIosOutlinedIcon fontSize="large" />
          </CalendarIconButton>
          <CalendarIconButton key={2}>
            <CalendarTodayOutlinedIcon fontSize="large" onClick={() => {setOpenDatePicker(!openDatePicker)}}/>
          </CalendarIconButton>
          <CalendarIconButton key={3} onClick={handleFilterOpen}>
            <FilterListOutlinedIcon fontSize="large" />
          </CalendarIconButton>
          <CalendarIconButton key={4} onClick={() => refreshSlots(targetDay)}>
            <RefreshOutlinedIcon fontSize="large" />
          </CalendarIconButton>
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
      <BookNew user={props.user} refreshSlots={refreshSlots} targetDay={targetDay}/>
      <FilterDialog 
        filterOpen={filterOpen}
        handleFilterClose={handleFilterClose}
        user={props.user}
        refreshSlots={refreshSlots}
        targetDay={targetDay}  
      />
      <Box display="none">
        <MuiPickersUtilsProvider utils={MomentUtils}>
          <KeyboardDatePicker
            margin="normal"
            id="date-picker-invisible"
            label="Please select a date"
            format="YYYY-MM-DD"
            minDate={minDate.format("YYYY-MM-DD")}
            open={openDatePicker}
            value={date}
            inputValue={date}
            onAccept={ date => {
              setDate(date);
              setTargetDayMinToday(new Date(date)).then(res => refreshSlots(res));
            }}
            onClose={() => setOpenDatePicker(!openDatePicker)}
            onChange={(d) => setDate(moment(d).format("YYYY-MM-DD"))}
            KeyboardButtonProps={{
              'aria-label': 'change date',}}
          />
        </MuiPickersUtilsProvider>
      </Box>
    </div>
  )
}