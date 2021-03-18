import React, { Component } from 'react'
import axios from "axios";
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

  // Handle field change
  handleChange = input => event => {
    this.setState({
      [input]: event.target.value
    });
  }

  // Handle form submission
  handleSubmit = () => {
    axios.post('http://143.198.226.226:8081/api/users', {
      email: this.state.email,
      password: this.state.password,
      first_name: this.state.first_name,
      last_name: this.state.last_name,
      country: this.state.country,
      region: this.state.region,
      birth_date: this.state.birth_date,
      gender: this.state.gender
    })
    .then(res => {
      console.log(res.data);
    })
  }

  render() {
    const { step } = this.state;
    const { email, password, first_name, last_name, country, region, birth_date, gender } = this.state;
    const values = { email, password, first_name, last_name, country, region, birth_date, gender }

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
            handleSubmit={this.handleSubmit}
            values={values}
          />
        )
    }
    
  }
}

export default UserForm
