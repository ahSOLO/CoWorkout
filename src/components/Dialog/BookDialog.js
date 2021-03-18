import {Button, InputLabel, Input, MenuItem, FormControl, Select, Box } from '@material-ui/core';
import { useState, useEffect } from 'react';
import DialogueTemplate from "./DialogueTemplate";
import MomentUtils from '@date-io/moment';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';

export default function BookDialogue(props) {
  const [activity, setActivity] = useState("");
  const [date, setDate] = useState(new Date.now());

  useEffect(() => {
    if (props.data){
      setActivity(props.data.activity_type);
      setDate(props.data.start_time);
    }
  }, [props.data])

  return (
    <DialogueTemplate
      handleClose = {props.handleBookClose}
      open = {props.bookOpen}
      title = "Book a Workout"
      content = {
        <Box display="flex" width="100%">
          <form>
            <FormControl fullWidth>
              <InputLabel id="activity-label">Activity</InputLabel>
              <Select
                labelId="activity-label"
                id="activity-select"
                value={activity}
                onChange={(e) => setActivity(e.target.value)}
                input={<Input />}
              >
                <MenuItem value="">
                  <em>Any</em>
                </MenuItem>
                <MenuItem value={"cardio"}>Cardio</MenuItem>
                <MenuItem value={"weight training"}>Weight Training</MenuItem>
                <MenuItem value={"yoga"}>Yoga</MenuItem>
                <MenuItem value={"circuit"}>Circuit</MenuItem>
                <MenuItem value={"HIIT"}>HIIT</MenuItem>
                <MenuItem value={"Stretching"}>Stretching</MenuItem>
              </Select>
            </FormControl>
            <MuiPickersUtilsProvider utils={MomentUtils}>
              <KeyboardDatePicker
                disableToolbar
                variant="inline"
                format="MM/dd/yyyy"
                margin="normal"
                id="date-picker-inline"
                label="Please select a date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
              />
            </MuiPickersUtilsProvider>
          </form>
        </Box>
      }
      button = {
        <Button>
          Confirm
        </Button>
      }
    />
  )
}


