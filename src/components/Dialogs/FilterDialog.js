import {Button, InputLabel, Input, MenuItem, FormControl, Select, FormHelperText,
  Box, Typography, FormLabel, FormGroup, FormControlLabel, Switch } from '@material-ui/core';
import { useState } from 'react';
import DialogTemplate from "./DialogTemplate";
import axios from 'axios';

export default function FilterDialog(props) {
  const [activity, setActivity] = useState("any");
  const [options, setOptions] = useState({
    sameGender: false,
    reputable: false
  });

  const handleChange = (e) => {
    setOptions({...options, [e.target.name]: e.target.checked })
  };

  // const handleFormSubmit = (e) => {
  //   e.preventDefault();
  //   const constructedLocalTime = moment(date + ' ' + time.format("HH:mm"), "YYYY-MM-DD HH:mm");
  //   const start_time_UTC = constructedLocalTime.tz("UTC").format();
  //   // Everything needed for the axios post request: user id, activity, start_time (in UTC)
  //   console.log("CURRENT USER ID", props.user.id);
  //   console.log("ACTIVITY:", activity);
  //   console.log("SESSION START TIME (UTC)", start_time_UTC);
  //   axios.post('/sessions', {user_id: props.user.id, activity: activity, start_time: start_time_UTC})
  //   .then( res => {
  //       console.log("Request Complete");
  //     }
  //   )
  // }

  return (
    <DialogTemplate
      handleClose = {props.handleFilterClose}
      open = {props.filterOpen}
      title = "Filter Sessions"
      // onFormSubmit={handleFormSubmit}
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
            <FormControl component="fieldset">
              <FormLabel component="legend">Assign responsibility</FormLabel>
              <FormGroup>
                <FormControlLabel
                  control={<Switch checked={options.sameGender} onChange={handleChange} name="sameGender" />}
                  label="Only show same gender:"
                />
                <FormControlLabel
                  control={<Switch checked={options.reputable} onChange={handleChange} name="reputable" />}
                  label="Only show reputable users:"
                />
              </FormGroup>
              <FormHelperText>Be careful</FormHelperText>
            </FormControl>
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


