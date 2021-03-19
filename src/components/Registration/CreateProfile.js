import React, { Component } from 'react';
import { Typography } from "@material-ui/core";
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Button from '@material-ui/core/Button';
import { countryTimezones } from "helpers/timezones";

const allCountries = require('country-region-data')
const selectCountries = allCountries.filter(country => country.countryName === 'United States' || country.countryName === 'Canada')


export class CreateProfile extends Component {

  state = {
    firstNameIsInvalid: false,
    lastNameIsInvalid: false,
    countryIsInvalid: false,
    regionIsInvalid: false,
    timezoneisInvalid: false
  }

  continue = e => {
    e.preventDefault();
    if (this.props.values.first_name === "") {
      this.setState({
        firstNameIsInvalid: true
      });
    } else {
      this.setState({
        firstNameIsInvalid: false
      });
    }
    if (this.props.values.last_name === "") {
      this.setState({
        lastNameIsInvalid: true
      });
    } else {
      this.setState({
        lastNameIsInvalid: false
      });
    }
    if (this.props.values.country === "") {
      this.setState({
        countryIsInvalid: true
      });
    } else {
      this.setState({
        countryIsInvalid: false
      });
    }
    if (this.props.values.region === "") {
      this.setState({
        regionIsInvalid: true
      });
    } else {
      this.setState({
        regionIsInvalid: false
      });
    }
    if (this.props.values.timezone === "") {
      this.setState({
        timezoneIsInvalid: true
      });
    } else {
      this.setState({
        timezoneIsInvalid: false
      });
    }
    if (this.props.values.first_name !== "" && this.props.values.last_name !== "" && this.props.values.country !== "" && this.props.values.region !== "" && this.props.values.timezone !== "") {
      this.props.nextStep();
    }
  }

  render() {
    const { values, handleChange } = this.props;
    return (
      <div>
        <br/><br/>
        <section className="steps">
          <Typography variant="h6" className="steps--inactive">
            sign up
          </Typography>
          <Typography variant="h6" className="steps--active">
            create profile
          </Typography>
          <Typography variant="h6" className="steps--inactive">
            set preferences
          </Typography>
        </section>
        <br/><br/><br/><br/><br/><br/>
        <section className="form">          
          <Typography variant="h5" className="prompt">
            What's your name?
          </Typography>
          <br/><br/>
          <section className="profile--name">
            <TextField 
              required
              error={this.state.firstNameIsInvalid}
              variant="outlined"
              type="text"
              label="first name"
              onChange={handleChange('first_name')}
              className="textfield textfield--half"
            />
            <br/>
            <TextField 
              required
              variant="outlined"
              error={this.state.lastNameIsInvalid}
              type="text"
              label="last name"
              onChange={handleChange('last_name')}
              className="textfield textfield--half"
            />
          </section>
          <br/><br/>
          <Typography variant="h5" className="prompt">
            Where are you located?
          </Typography>
          <br/><br/>
          <section className="profile--location">
            <TextField 
              required
              error={this.state.countryIsInvalid}
              variant="outlined"
              select
              label="country"
              onChange={handleChange('country')}
              className="textfield textfield--half"
            >
              {selectCountries.map((country) => (
                <MenuItem key={country.countryShortCode} value={country.countryName}>
                  {country.countryName}
                </MenuItem>
              ))}
            </TextField>
            <br/>
            <TextField 
              required
              error={this.state.regionIsInvalid}
              variant="outlined"
              select
              label="region"
              onChange={handleChange('region')}
              disabled={!this.props.values.country}
              className="textfield textfield--half"
            >
              {this.props.values.country
                ? selectCountries
                  .find(({ countryName }) => countryName === this.props.values.country)
                  .regions.map((region) => (
                    <MenuItem value={region.name} key={region.shortCode}>
                      {region.name}
                    </MenuItem>
                  ))
                : []}
            </TextField>
            <br/>
            <TextField 
              required
              error={this.state.timezoneIsInvalid}
              variant="outlined"
              select
              label="timezone"
              onChange={handleChange('timezone')}
              disabled={!this.props.values.country}
              className="textfield textfield--half"
            >
              {this.props.values.country
                ? countryTimezones
                  .find(({ countryName }) => countryName === this.props.values.country)
                  .timezones.map((timezone) => (
                    <MenuItem value={timezone} key={timezone}>
                      {timezone}
                    </MenuItem>
                  ))
                : []}
            </TextField>
          </section>
          <br/><br/><br/>
          <Typography variant="h5" className="prompt">
            <u>Optional</u>: Provide some additional details about yourself so <br/> that we can better match you with workout partners.
          </Typography>
          <br/><br/>
          <section className="profile--optional">
            <Typography variant="h6" className="prompt--optional">
              Birth Date:
            </Typography>
            <TextField 
              required
              variant="outlined"
              type="date"
              onChange={handleChange('birth_date')}
              className="textfield textfield--half"
            />
          </section>
          <br/><br/>
          <section className="profile--optional">
            <Typography variant="h6" className="prompt--optional">
              Gender:
            </Typography>
            <RadioGroup row aria-label="gender" name="gender1" onChange={handleChange('gender')}>
              <FormControlLabel value="female" control={<Radio />} label="Female" />
              <FormControlLabel value="male" control={<Radio />} label="Male" />
            </RadioGroup>
            </section>
          <br/><br/>
          <Button 
            variant="contained"
            color="primary"
            onClick={this.continue}
            className="button"
          >
            continue
          </Button>
        </section>
      </div>
    )
  }
}

export default CreateProfile
