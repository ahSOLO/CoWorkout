import {Button, InputLabel, Input, MenuItem, FormControl, Select, Box } from '@material-ui/core';
import FormLabel from '@material-ui/core/FormLabel';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { useState, useEffect } from 'react';
import DialogueTemplate from "./DialogTemplate";
import axios from "axios";
import { countryTimezones } from "helpers/timezones";

const allCountries = require('country-region-data')
const selectCountries = allCountries.filter(country => country.countryName === 'United States' || country.countryName === 'Canada')


export default function BookDialogue(props) {

  const [country, setCountry] = useState('');
  const [region, setRegion] = useState('');
  const [timezone, setTimezone] = useState('');
  const [interests, setInterests] = useState({});
  const [goals, setGoals] = useState({});

  useEffect(() => {
    if (props.user) {
      setCountry(props.user.country);
      setRegion(props.user.region);
      setTimezone(props.user.timezone);
      if (props.user.fitness_interests_array) {
        const interests_state = {
          cardio: props.user.fitness_interests_array.includes("Cardio"),
          weight_training: props.user.fitness_interests_array.includes("Weight Training"),
          yoga: props.user.fitness_interests_array.includes("Yoga"),
          circuit: props.user.fitness_interests_array.includes("Circuit"),
          hiit: props.user.fitness_interests_array.includes("HIIT"),
          stretching: props.user.fitness_interests_array.includes("Stretching")
        } 
        setInterests(interests_state);
      }
      if (props.user.fitness_goals_array) {
        const goals_state = {
          get_stronger: props.user.fitness_goals_array.includes("Get Stronger"),
          build_muscle: props.user.fitness_goals_array.includes("Build Muscle"),
          lose_weight: props.user.fitness_goals_array.includes("Lose Weight"),
          be_active: props.user.fitness_goals_array.includes("Be Active"),
          get_toned: props.user.fitness_goals_array.includes("Get Toned")
        } 
        setGoals(goals_state);
      }
    }
  }, [props.user])

  const handleInterestChange = input => event => {
    setInterests({
      ...interests,
      [input]: event.target.checked
    });
  }

  const handleGoalChange = input => event => {
    setGoals({
      ...goals,
      [input]: event.target.checked
    });
  }

  const handleFormSubmit = (e) => {
    e.preventDefault();
    axios.put('http://143.198.226.226:8081/api/users', {
      user_id: props.user.user_id,
      country,
      region,
      timezone,
      interests,
      goals
    })
    .then(res => {
      if (res.status === 201) {
        props.handleProfileEditClose();

        const fitness_interests_array = [];
        for (let interest in interests) {
          if (interests[interest]) {
            let formatted_interest = interest.replace(/_/g, ' ')
            formatted_interest = formatted_interest.toLowerCase().split(' ').map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(' ');
            fitness_interests_array.push(formatted_interest);
          }
        }
        const fitness_interests = fitness_interests_array.join(', ')

        const fitness_goals_array = [];
        for (let goal in goals) {
          if (goals[goal]) {
            let formatted_goal = goal.replace(/_/g, ' ')
            formatted_goal = formatted_goal.toLowerCase().split(' ').map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(' ');
            fitness_goals_array.push(formatted_goal);
          }
        }
        const fitness_goals = fitness_goals_array.join(', ')

        props.setUser((prev) => ({
          ...prev,
          country,
          region,
          timezone,
          fitness_interests,
          fitness_interests_array,
          fitness_goals,
          fitness_goals_array
        }))
      }
    })
  }

  return (
    <DialogueTemplate
      handleClose = {props.handleProfileEditClose}
      open = {props.profileEditOpen}
      title = "Edit Profile"
      onFormSubmit={handleFormSubmit}
      content = {
        <Box display="flex" flexDirection="column" width="100%" alignItems="center" mt={2}>
          <FormControl style={{width: 200}}>
            <InputLabel id="activity-label">Country</InputLabel>
            <Select
              labelId="activity-label"
              id="activity-select"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              input={<Input />}
            >
              {selectCountries.map((country) => (
                <MenuItem key={country.countryShortCode} value={country.countryName}>
                  {country.countryName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <br/>
          <FormControl style={{width: 200}}>
            <InputLabel id="activity-label">Region</InputLabel>
            <Select
              labelId="activity-label"
              id="activity-select"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              input={<Input />}
            >
              {country ? selectCountries
                .find(({ countryName }) => countryName === country)
                .regions.map((region) => (
                  <MenuItem value={region.name} key={region.shortCode}>
                    {region.name}
                  </MenuItem>
                ))
              : []}
            </Select>
          </FormControl>
          <br/>
          <FormControl style={{width: 200}}>
            <InputLabel id="activity-label">Timezone</InputLabel>
            <Select
              labelId="activity-label"
              id="activity-select"
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              input={<Input />}
            >
              {country ? countryTimezones
                .find(({ countryName }) => countryName === country)
                .timezones.map((timezone) => (
                  <MenuItem value={timezone} key={timezone}>
                    {timezone}
                  </MenuItem>
                ))
              : []}
            </Select>
          </FormControl>
          <br/>
          <section className="preferences">
            <FormControl style={{margin: 30}}>
              <FormLabel component="legend">Fitness Interests</FormLabel>
              <FormGroup>
                <FormControlLabel
                  control={<Checkbox checked={interests.cardio} onChange={handleInterestChange('cardio')} name="cardio" />}
                  label="Cardio"
                />
                <FormControlLabel
                  control={<Checkbox checked={interests.weight_training} onChange={handleInterestChange('weight_training')} name="weight_training" />}
                  label="Weight Training"
                />
                <FormControlLabel
                  control={<Checkbox checked={interests.yoga} onChange={handleInterestChange('yoga')} name="yoga" />}
                  label="Yoga"
                />
                <FormControlLabel
                  control={<Checkbox checked={interests.circuit} onChange={handleInterestChange('circuit')} name="circuit" />}
                  label="Circuit"
                />
                <FormControlLabel
                  control={<Checkbox checked={interests.hiit} onChange={handleInterestChange('hiit')} name="hiit" />}
                  label="HIIT"
                />
                <FormControlLabel
                  control={<Checkbox checked={interests.stretching} onChange={handleInterestChange('stretching')} name="stretching" />}
                  label="Stretching"
                />
              </FormGroup>
            </FormControl>
            <FormControl style={{margin: 30}}>
              <FormLabel component="legend">Workout Goals</FormLabel>
                <FormGroup>
                  <FormControlLabel
                    control={<Checkbox checked={goals.get_stronger} onChange={handleGoalChange('get_stronger')} name="get_stronger" />}
                    label="Get Stronger"
                  />
                  <FormControlLabel
                    control={<Checkbox checked={goals.build_muscle} onChange={handleGoalChange('build_muscle')} name="build_muscle" />}
                    label="Build Muscle"
                  />
                  <FormControlLabel
                    control={<Checkbox checked={goals.lose_weight} onChange={handleGoalChange('lose_weight')} name="lose_weight" />}
                    label="Lose Weight"
                  />
                  <FormControlLabel
                    control={<Checkbox checked={goals.be_active} onChange={handleGoalChange('be_active')} name="be_active" />}
                    label="Be Active"
                  />
                  <FormControlLabel
                    control={<Checkbox checked={goals.get_toned} onChange={handleGoalChange('get_toned')} name="get_toned" />}
                    label="Get Toned"
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
