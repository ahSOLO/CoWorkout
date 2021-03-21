import React, { Component } from 'react';
import { Typography } from "@material-ui/core";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

export class SignUp extends Component {

  state = {
    emailIsInvalid: false,
    passwordIsInvalid: false
  }

  continue = e => {
    e.preventDefault();
    if (this.props.values.email === "") {
      this.setState({
        emailIsInvalid: true
      });
    } else {
      this.setState({
        emailIsInvalid: false
      });
    }
    if (this.props.values.password === "") {
      this.setState({
        passwordIsInvalid: true
      });
    } else {
      this.setState({
        passwordIsInvalid: false
      });
    }
    if (this.props.values.email !== "" && this.props.values.password !== "") {
      this.props.nextStep();
    }
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
            error={this.state.emailIsInvalid}
            variant="outlined"
            type="email"
            label="email address"
            onChange={handleChange('email')}
            className="textfield textfield--full"
          />
          <br/>
          <TextField 
            required
            error={this.state.passwordIsInvalid}
            variant="outlined"
            type="password"
            label="password"
            onChange={handleChange('password')}
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
          <br/><br/><br/><br/><br/>
        </section>
      </div>
    )
  }
}

export default SignUp
