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
    gender: '',
    cardio: false,
    weight_training: false,
    yoga: false,
    circuit: false,
    hiit: false,
    stretching: false,
    get_stronger: false,
    build_muscle: false,
    lose_weight: false,
    be_active: false,
    get_toned: false
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
      [input]: event.target.value || event.target.checked
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
      gender: this.state.gender,
      cardio: this.state.cardio,
      weight_training: this.state.weight_training,
      yoga: this.state.yoga,
      circuit: this.state.circuit,
      hiit: this.state.hiit,
      stretching: this.state.stretching,
      get_stronger: this.state.get_stronger,
      build_muscle: this.state.build_muscle,
      lose_weight: this.state.lose_weight,
      be_active: this.state.be_active,
      get_toned: this.state.get_toned
    })
    .then(res => {
      console.log(res.data);
    })
  }

  render() {
    const { step } = this.state;
    const { email, password, first_name, last_name, country, region, birth_date, gender, interests, goals } = this.state;
    const values = { email, password, first_name, last_name, country, region, birth_date, gender, interests, goals }

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
