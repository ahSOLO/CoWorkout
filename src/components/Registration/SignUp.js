import React, { Component } from 'react';
import { Typography } from "@material-ui/core";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

export class SignUp extends Component {

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
          <Typography variant="h6" className="steps--active">
            sign up
          </Typography>
          <Typography variant="h6" className="steps--inactive">
            create profile
          </Typography>
          <Typography variant="h6" className="steps--inactive">
            set preferences
          </Typography>
        </section>
        <br/><br/><br/><br/><br/><br/>
        <section className="form">          
          <Typography variant="h5">
            Start by entering your email and password.
          </Typography>
          <br/><br/>
          <TextField 
            required
            variant="outlined"
            type="email"
            label="email address"
            onChange={handleChange('email')}
            defaultValue={values.email}
            className="textfield textfield--full"
          />
          <br/>
          <TextField 
            required
            variant="outlined"
            type="password"
            label="password"
            onChange={handleChange('password')}
            defaultValue={values.password}
            className="textfield textfield--full"
          />
          <br/>
          <Button 
            variant="contained"
            color="primary"
            onClick={this.continue}
            className="button"
          >
            create account
          </Button>
        </section>
      </div>
    )
  }
}

export default SignUp
