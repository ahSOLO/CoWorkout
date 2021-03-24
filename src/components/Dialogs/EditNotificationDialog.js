import {Button, InputLabel, Input, MenuItem, FormGroup, FormControl, FormControlLabel, FormLabel, Checkbox, Select, Box } from '@material-ui/core';
import { useState, useEffect } from 'react';
import axios from "axios";
import DialogueTemplate from "./DialogTemplate";
import { countryTimezones } from "helpers/timezones";

const BASE_URL = process.env.REACT_APP_BASE_URL;

export default function BookDialogue(props) {

  const [email, setEmail] = useState({});
  const [sms, setSms] = useState({});

  // useEffect(() => {
  //   if (props.user) {
  //     setCountry(props.user.country);
  //     setRegion(props.user.region);
  //     setTimezone(props.user.timezone);
  //     if (props.user.fitness_interests_array) {
  //       const interests_state = {
  //         cardio: props.user.fitness_interests_array.includes("Cardio"),
  //         weight_training: props.user.fitness_interests_array.includes("Weight Training"),
  //         yoga: props.user.fitness_interests_array.includes("Yoga"),
  //         circuit: props.user.fitness_interests_array.includes("Circuit"),
  //         hiit: props.user.fitness_interests_array.includes("HIIT"),
  //         stretching: props.user.fitness_interests_array.includes("Stretching")
  //       } 
  //       setInterests(interests_state);
  //     }
  //     if (props.user.fitness_goals_array) {
  //       const goals_state = {
  //         get_stronger: props.user.fitness_goals_array.includes("Get Stronger"),
  //         build_muscle: props.user.fitness_goals_array.includes("Build Muscle"),
  //         lose_weight: props.user.fitness_goals_array.includes("Lose Weight"),
  //         be_active: props.user.fitness_goals_array.includes("Be Active"),
  //         get_toned: props.user.fitness_goals_array.includes("Get Toned")
  //       } 
  //       setGoals(goals_state);
  //     }
  //   }
  // }, [props.user])

  // const handleInterestChange = input => event => {
  //   setInterests({
  //     ...interests,
  //     [input]: event.target.checked
  //   });
  // }

  // const handleGoalChange = input => event => {
  //   setGoals({
  //     ...goals,
  //     [input]: event.target.checked
  //   });
  // }

  return (
    <DialogueTemplate
      handleClose = {props.handleNotificationEditClose}
      open = {props.notificationEditOpen}
      title = "Edit Notification Preferences"
      // onFormSubmit={handleFormSubmit}
      content = {
        <Box display="flex" flexDirection="column" width="100%" alignItems="center" mt={2}>
          <section className="preferences">
            <FormControl style={{margin: 20}}>
              <FormLabel component="legend">Email Preferences</FormLabel>
                <br/>
                <FormGroup>
                  <FormControlLabel
                    control={<Checkbox checked={true} name="booked" />}
                    label="when session booked"
                  />
                  <FormControlLabel
                    control={<Checkbox checked={true} name="matched" />}
                    label="when matched"
                  />
                  <FormControlLabel
                    control={<Checkbox name="reminder" />}
                    label="1 hour session reminder"
                  />
                </FormGroup>
            </FormControl>
            <FormControl style={{margin: 20}}>
              <FormLabel component="legend">SMS Preferences</FormLabel>
                <br/>
                <FormGroup>
                  <FormControlLabel
                    control={<Checkbox name="booked" />}
                    label="when session booked"
                  />
                  <FormControlLabel
                    control={<Checkbox name="matched" />}
                    label="when matched"
                  />
                  <FormControlLabel
                    control={<Checkbox name="reminder" />}
                    label="1 hour session reminder"
                  />
                </FormGroup>
            </FormControl>
          </section>
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
