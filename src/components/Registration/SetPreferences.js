import React, { Component } from 'react';
import { Typography } from "@material-ui/core";
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';

export class SetPreferences extends Component {

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
          <Typography variant="h6" className="steps--inactive">
            create profile
          </Typography>
          <Typography variant="h6" className="steps--active">
            set preferences
          </Typography>
        </section>
        <br/><br/><br/><br/><br/><br/>
        <section className="form">          
          <Typography variant="h5" className="prompt">
            Set your workout preferences so that your workout <br/> partners know what you’re interested in!
          </Typography>
          <br/><br/>
          <section className="preferences">
            <FormControl component="fieldset">
              <FormLabel component="legend">Fitness Interests</FormLabel>
              <FormGroup>
                <FormControlLabel
                  control={<Checkbox checked={values.cardio} onChange={handleChange} name="cardio" />}
                  label="Cardio"
                />
                <FormControlLabel
                  control={<Checkbox checked={values.weight_training} onChange={handleChange} name="weight_training" />}
                  label="Weight Training"
                />
                <FormControlLabel
                  control={<Checkbox checked={values.yoga} onChange={handleChange} name="yoga" />}
                  label="Yoga"
                />
                <FormControlLabel
                  control={<Checkbox checked={values.circuit} onChange={handleChange} name="circuit" />}
                  label="Circuit"
                />
                <FormControlLabel
                  control={<Checkbox checked={values.hiit} onChange={handleChange} name="hiit" />}
                  label="HIIT"
                />
                <FormControlLabel
                  control={<Checkbox checked={values.stretching} onChange={handleChange} name="stretching" />}
                  label="Stretching"
                />
              </FormGroup>
              <FormHelperText>Select any</FormHelperText>
            </FormControl>
            <br/><br/>
            <FormControl component="fieldset">
              <FormLabel component="legend">Workout Goals</FormLabel>
              <FormGroup>
                <FormControlLabel
                  control={<Checkbox checked={values.get_stronger} onChange={handleChange} name="get_stronger" />}
                  label="Get Stronger"
                />
                <FormControlLabel
                  control={<Checkbox checked={values.build_muscle} onChange={handleChange} name="build_muscle" />}
                  label="Build Muscle"
                />
                <FormControlLabel
                  control={<Checkbox checked={values.lose_weight} onChange={handleChange} name="lose_weight" />}
                  label="Lose Weight"
                />
                <FormControlLabel
                  control={<Checkbox checked={values.be_active} onChange={handleChange} name="be_active" />}
                  label="Be Active"
                />
                <FormControlLabel
                  control={<Checkbox checked={values.get_toned} onChange={handleChange} name="get_toned" />}
                  label="Get Toned"
                />
              </FormGroup>
              <FormHelperText>Select any</FormHelperText>
            </FormControl>
          </section>
          <br/><br/>
          <Button 
            variant="contained"
            color="primary"
            onClick={this.continue}
            className="button"
          >
            finish
          </Button>
          <br/>
          <Link href="">
            SKIP FOR NOW
          </Link>
        </section>
      </div>
    )
  }
}

export default SetPreferences
