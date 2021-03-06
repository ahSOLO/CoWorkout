import React, { Component } from 'react';
import { Typography, TextField, MenuItem, Radio, RadioGroup, FormControlLabel, Button } from "@material-ui/core";
import { countryTimezones } from "helpers/timezones";

const allCountries = require('country-region-data')
const selectCountries = allCountries.filter(country => country.countryName === 'United States' || country.countryName === 'Canada')

export class CreateProfile extends Component {

  state = {
    first_name: false,
    last_name: false,
    country: false,
    region: false,
    timezone: false
  }

  checkValidity = form => {
    if (this.props.values[form] === "") {
      this.setState({
        [form]: true
      })
    } else {
      this.setState({
        [form]: false
      })
    }
  }

  continue = e => {
    e.preventDefault();
    this.checkValidity("first_name");
    this.checkValidity("last_name");
    this.checkValidity("country");
    this.checkValidity("region");
    this.checkValidity("timezone");
    if (Object.keys(this.state).every(form => this.props.values[form] !== "")) this.props.nextStep();
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
              error={this.state.first_name}
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
              error={this.state.last_name}
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
              error={this.state.country}
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
              error={this.state.region}
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
              error={this.state.timezone}
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
          <br/><br/><br/><br/><br/>
        </section>
      </div>
    )
  }
}

export default CreateProfile
