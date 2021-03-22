import {Button, InputLabel, Input, MenuItem, FormControl, Select, FormHelperText,
  Box, Typography, FormLabel, FormGroup, FormControlLabel, Switch } from '@material-ui/core';
import { useState } from 'react';
import DialogTemplate from "./DialogTemplate";
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BASE_URL;
console.log(BASE_URL);

export default function FilterDialog(props) {
  const [activity, setActivity] = useState(0);
  const [options, setOptions] = useState({
    sameGender: false,
    reputable: false
  });

  const handleChange = (e) => {
    setOptions({...options, [e.target.name]: e.target.checked })
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Everything needed for the axios get request: activity, sameGender, reputable
    console.log("CURRENT USER ID", props.user.user_id);
    console.log("ACTIVITY:", activity);
    console.log("SAME GENDER", options.sameGender);
    console.log("REPUTABLE", options.reputable);
    props.handleFilterClose();
    props.refreshSlots(props.targetDay, {activityId: activity, sameGender: options.sameGender, reputable: options.reputable })
  }

  return (
    <DialogTemplate
      handleClose = {props.handleFilterClose}
      open = {props.filterOpen}
      title = "Filter Sessions"
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
                <MenuItem value={0}>Any</MenuItem>
                <MenuItem value={1}>Cardio</MenuItem>
                <MenuItem value={2}>Weight Training</MenuItem>
                <MenuItem value={3}>Yoga</MenuItem>
                <MenuItem value={4}>Circuit</MenuItem>
                <MenuItem value={5}>HIIT</MenuItem>
                <MenuItem value={6}>Stretching</MenuItem>
              </Select>
            </FormControl>
            <br /><br />
            <FormControl component="fieldset">
              <FormLabel component="legend">Preferences</FormLabel>
              <FormGroup>
                <FormControlLabel
                  control={<Switch checked={options.sameGender} onChange={handleChange} name="sameGender" />}
                  label="Only show same gender"
                />
                <br />
                <FormControlLabel
                  control={<Switch checked={options.reputable} onChange={handleChange} name="reputable" />}
                  label="Only show reputable users"
                />
              </FormGroup>
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


