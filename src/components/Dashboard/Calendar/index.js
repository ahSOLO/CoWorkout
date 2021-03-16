import Day from "./Day";
import "./styles.scss";

// Material UI
import { Box, Container, Typography } from "@material-ui/core";
import ArrowBackIosOutlinedIcon from '@material-ui/icons/ArrowBackIosOutlined';
import ArrowForwardIosOutlinedIcon from '@material-ui/icons/ArrowForwardIosOutlined';
import CalendarTodayOutlinedIcon from '@material-ui/icons/CalendarTodayOutlined';

export default function Calendar(props) {

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const calHeaders = weekDays.map(weekDay => {
    return (
      <div className="cal__header">
        <Typography variant='h3'>
          01
        </Typography>
        <Typography variant='subtitle1'>
          {weekDay}
        </Typography>
      </div>
    )
  });

  return (
    <Container maxWidth='lg'>
      <Box component="div" display="flex" alignItems="center">
        <Typography variant='h4'>
          March 8 - 14
        </Typography>
        <ArrowBackIosOutlinedIcon />
        <ArrowForwardIosOutlinedIcon />
        <CalendarTodayOutlinedIcon />
      </Box>
      <Box component="div" display="flex" flexDirection="column">
        <div className="cal__headers__container">
          {calHeaders}
        </div>
        <div className="cal__main">
          <Day date="08" weekday="Mon"/>
          <Day date="09" weekday="Tue"/>
          <Day date="10" weekday="Wed"/>
          <Day date="11" weekday="Thu"/>
          <Day date="12" weekday="Fri"/>
          <Day date="13" weekday="Sat"/>
          <Day date="14" weekday="Sun"/>
        </div>
      </Box>
    </Container>
  )
}