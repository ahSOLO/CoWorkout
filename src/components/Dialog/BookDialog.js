import {Button, InputLabel, Input, MenuItem, FormControl, Select, Box, TextField } from '@material-ui/core';
import { useState, useEffect } from 'react';
import DialogueTemplate from "./DialogueTemplate";
import moment from 'moment-timezone';
import axios from 'axios';
import MomentUtils from '@date-io/moment';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
  KeyboardTimePicker,
} from '@material-ui/pickers';

export default function BookDialogue(props) {
  const [activity, setActivity] = useState("any");
  const [date, setDate] = useState(moment().format("YYYY-MM-DD"));
  const [time, setTime] = useState(moment().endOf('hour'));

  useEffect(() => {
    if (props.data){
      setActivity(props.data.activity_type || "any");
      setDate(moment(props.date).format("YYYY-MM-DD"));
      setTime(time.set({ "hour": props.data.hour, "minute": props.data.minute }))
    }
  }, [props.data, props.date])

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const constructedLocalTime = moment(date + ' ' + time.format("HH:mm"), "YYYY-MM-DD HH:mm");
    const start_time_UTC = constructedLocalTime.tz("UTC").format();
    // Everything needed for the axios post request: user id, activity, start_time (in UTC)
    console.log("CURRENT USER ID", props.user.id);
    console.log("ACTIVITY:", activity);
    console.log("SESSION START TIME (UTC)", start_time_UTC);
    axios.post('/sessions', {user_id: props.user.id, activity: activity, start_time: start_time_UTC})
    .then( res => {
        console.log("Request Complete");
      }
    )
  }

  return (
    <DialogueTemplate
      handleClose = {props.handleBookClose}
      open = {props.bookOpen}
      title = "Book a Workout"
      onFormSubmit={handleFormSubmit}
      content = {
        <Box display="flex" flexDirection="column" width="100%">
            <FormControl>
              <InputLabel id="activity-label">Activity</InputLabel>
              <Select
                labelId="activity-label"
                id="activity-select"
                value={activity}
                onChange={(e) => setActivity(e.target.value)}
                input={<Input />}
              >
                <MenuItem value={"any"}>Any</MenuItem>
                <MenuItem value={"cardio"}>Cardio</MenuItem>
                <MenuItem value={"weight training"}>Weight Training</MenuItem>
                <MenuItem value={"yoga"}>Yoga</MenuItem>
                <MenuItem value={"circuit"}>Circuit</MenuItem>
                <MenuItem value={"HIIT"}>HIIT</MenuItem>
                <MenuItem value={"Stretching"}>Stretching</MenuItem>
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


