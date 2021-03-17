import React, { Component } from 'react'
import SignUp from './SignUp'
import CreateProfile from './CreateProfile'
import SetPreferences from './SetPreferences'
import "./styles.scss";

export class UserForm extends Component {

  state = {
    step: 1,
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    country: '',
    region: '',
    birth_date: '',
    gender: ''
  }

  // Proceed to the next step
  nextStep = () => {
    const { step } = this.state;
    this.setState({
      step: step + 1
    });
  }

  // Handle fields change
  handleChange = input => e => {
    this.setState({
      [input]: e.target.value
    });
  }

  render() {
    const { step } = this.state;
    const { email, password, first_name, last_name } = this.state;
    const values = { email, password, first_name, last_name }

    switch(step) {
      case 1:
        return (
          <SignUp
            nextStep={this.nextStep}
            handleChange={this.handleChange}
            values={values}
          />
        )
      case 2:
        return (
          <CreateProfile
            nextStep={this.nextStep}
            handleChange={this.handleChange}
            values={values}
          />
        )
      case 3:
        return (
          <SetPreferences
            nextStep={this.nextStep}
            handleChange={this.handleChange}
            values={values}
          />
        )
    }
    
  }
}

export default UserForm
