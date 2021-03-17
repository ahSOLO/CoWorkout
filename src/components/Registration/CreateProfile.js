import React, { Component } from 'react';
import { Typography } from "@material-ui/core";
import TextField from '@material-ui/core/TextField';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Button from '@material-ui/core/Button';

export class CreateProfile extends Component {

  continue = e => {
    e.preventDefault();
    this.props.nextStep();
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
          <section className="profile">
            <TextField 
              required
              variant="outlined"
              type="text"
              label="first name"
              onChange={handleChange('first_name')}
              defaultValue={values.first_name}
              className="textfield textfield--half"
            />
            <br/>
            <TextField 
              required
              variant="outlined"
              type="text"
              label="last name"
              onChange={handleChange('last_name')}
              defaultValue={values.last_name}
              className="textfield textfield--half"
            />
          </section>
          <br/><br/>
          <Typography variant="h5" className="prompt">
            Where are you located?
          </Typography>
          <br/><br/>
          <section className="profile">
            <TextField 
              required
              variant="outlined"
              type="text"
              label="country"
              onChange={handleChange('country')}
              defaultValue={values.country}
              className="textfield textfield--half"
            />
            <br/>
            <TextField 
              required
              variant="outlined"
              type="text"
              label="region"
              onChange={handleChange('region')}
              defaultValue={values.region}
              className="textfield textfield--half"
            />
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
            <RadioGroup row aria-label="gender" name="gender1" value={values.gender} onChange={handleChange('gender')}>
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
