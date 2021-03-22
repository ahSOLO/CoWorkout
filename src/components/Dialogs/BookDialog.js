import {Button, InputLabel, Input, MenuItem, FormControl, Select, Box, Typography } from '@material-ui/core';
import { useState, useEffect } from 'react';
import DialogTemplate from "./DialogTemplate";
import moment from 'moment-timezone';
import axios from 'axios';
import MomentUtils from '@date-io/moment';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
  KeyboardTimePicker,
} from '@material-ui/pickers';

const BASE_URL = process.env.REACT_APP_BASE_URL;
const activityMap = {0: "Any Exercise", 1:"Cardio", 2:"Weight Training", 3:"Yoga", 4:"Circuit", 5:"HIIT", 6:"Stretching"};

export default function BookDialog(props) {
  const [activity, setActivity] = useState("0");
  const [date, setDate] = useState(moment().format("YYYY-MM-DD"));
  const [time, setTime] = useState(moment().add(1, 'hour').startOf('hour'));
  const [minDate, setminDate] = useState(moment());
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (props.data){
      setActivity(props.data.activity_type || 0);
      setDate(moment(props.date).format("YYYY-MM-DD"));
      setTime(time.set({ "hour": props.data.hour, "minute": props.data.minute }))
      setminDate(moment().subtract(1,'days'));
    }
  }, [props.data, props.date])

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const constructedLocalTime = moment(date + ' ' + time.format("HH:mm"), "YYYY-MM-DD HH:mm");
    if (constructedLocalTime.isBefore(moment())) {
      return setMessage("Please select a time in the future.")
    }
    const start_time_UTC = constructedLocalTime.tz("UTC").format();
    console.log(start_time_UTC);
    // Everything needed for the axios post request: user id, activity, start_time (in UTC)
    console.log("CURRENT USER ID", props.user.user_id);
    console.log("ACTIVITY:", activity);
    console.log("SESSION START TIME (UTC)", start_time_UTC);
    props.setMode("LOADING");
    props.handleBookClose();
    axios.post(BASE_URL + '/api/sessions', {user_id: props.user.user_id, activity: activity, start_time: start_time_UTC})
    .then( res => {
        if (res.status===201) {
          props.setNewSessionId(res.data);
          props.setActivity(activityMap[activity]);
          props.setMode("MATCHING");
        } else {
          props.setMode("ERROR");
        }
      }
    )
    .catch( err => {
      props.setMode("ERROR");
    })
  }

  return (
    <DialogTemplate
      handleClose = {props.handleBookClose}
      open = {props.bookOpen}
      title = "Book a Workout"
      onFormSubmit={handleFormSubmit}
      content = {
        <Box display="flex" flexDirection="column" width="100%">
            <Typography variant="subtitle1" color="error">
              {message}
            </Typography>
            <FormControl>
              <InputLabel id="activity-label">Activity</InputLabel>
              <Select
                labelId="activity-label"
                id="activity-select"
                value={activity}
                onChange={(e) => setActivity(e.target.value)}
                input={<Input />}
              >
                <MenuItem value={0}>Any</MenuItem>
                <MenuItem value={1}>Cardio</MenuItem>
                <MenuItem value={2}>Weight Training</MenuItem>
                <MenuItem value={3}>Yoga</MenuItem>
                <MenuItem value={4}>Circuit</MenuItem>
                <MenuItem value={5}>HIIT</MenuItem>
                <MenuItem value={6}>Stretching</MenuItem>
              </Select>
            </FormControl>
            <br/>
            <MuiPickersUtilsProvider libInstance={moment} utils={MomentUtils}>
              <KeyboardDatePicker
                variant="inline"
                format="YYYY-MM-DD"
                margin="normal"
                id="date-picker-inline"
                label="Please select a date"
                minDate={minDate.format()}
                minDateMessage="Please select a time in the future"
                value={date}
                inputValue={date}
                onChange={(d) => setDate(moment(d).format("YYYY-MM-DD"))}
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
              />
              <br/>
              <KeyboardTimePicker
                margin="normal"
                id="time-picker"
                label="Please select a time"
                value={time}
                onChange={(d) => setTime(moment(d))}
                minutesStep={15}
                KeyboardButtonProps={{
                  'aria-label': 'change time',
                }}
              />
            </MuiPickersUtilsProvider>
        </Box>
      }
      button = {
        <Button type="submit">
          Confirm
        </Button>
      }
    />
  )
}


