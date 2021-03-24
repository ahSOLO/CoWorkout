import React, { Component } from 'react';
import { Typography, TextField, Button } from "@material-ui/core";

export class SignUp extends Component {

  state = {
    email: false,
    password: false
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
    this.checkValidity("email");
    this.checkValidity("password");
    if (Object.keys(this.state).every(form => this.props.values[form] !== "")) this.props.nextStep();
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
            error={this.state.email}
            variant="outlined"
            type="email"
            label="email address"
            onChange={handleChange('email')}
            className="textfield textfield--full"
          />
          <br/>
          <TextField 
            required
            error={this.state.password}
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
