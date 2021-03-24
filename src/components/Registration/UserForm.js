import React, { Component } from 'react'
import axios from "axios";
import SignUp from './SignUp'
import CreateProfile from './CreateProfile'
import SetPreferences from './SetPreferences'
import "./styles.scss";

export class UserForm extends Component {

  BASE_URL = process.env.REACT_APP_BASE_URL;

  state = {
    step: 1,
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    country: '',
    region: '',
    timezone: '',
    birth_date: '',
    gender: '',
    // Workout Types
    cardio: false,
    weight_training: false,
    yoga: false,
    circuit: false,
    hiit: false,
    stretching: false,
    // Workout Goals
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
    axios.post(this.BASE_URL + '/api/users', {
      email: this.state.email,
      password: this.state.password,
      first_name: this.state.first_name,
      last_name: this.state.last_name,
      country: this.state.country,
      region: this.state.region,
      timezone: this.state.timezone,
      birth_date: this.state.birth_date || null,
      gender: this.state.gender || null,
      workout_types: [
        { 
          workout_type_id: 1,
          name: 'cardio',
          value: this.state.cardio 
        },
        { 
          workout_type_id: 2,
          name: 'weight_training',
          value: this.state.weight_training 
        },
        { 
          workout_type_id: 3,
          name: 'yoga',
          value: this.state.yoga 
        },
        { 
          workout_type_id: 4,
          name: 'circuit',
          value: this.state.circuit 
        },
        { 
          workout_type_id: 5,
          name: 'hiit',
          value: this.state.hiit 
        },
        { 
          workout_type_id: 6,
          name: 'stretching',
          value: this.state.stretching 
        },
      ],
      workout_goals: [
        { workout_goal_id: 1,
          name: 'get_stronger',
          value: this.state.get_stronger 
        },
        { workout_goal_id: 2,
          name: 'build_muscle',
          value: this.state.build_muscle 
        },
        { workout_goal_id: 3,
          name: 'lose_weight',
          value: this.state.lose_weight 
        },
        { workout_goal_id: 4,
          name: 'be_active',
          value: this.state.be_active 
        },
        { workout_goal_id: 5,
          name: 'get_toned',
          value: this.state.get_toned 
        }
      ]
    })
    .then(res => {
      this.props.setCookie("user_id", res.data.user_id, {
        path: "/"
      });
      return axios.get(this.BASE_URL + '/api/users', {
        params: {
          user_id: res.data.user_id
        }
      })
    })
    .then((data) => {
      this.props.setUser(data.data.users[0]);
    })
  }

  render() {
    switch(this.state.step) {
      case 1:
        return (
          <SignUp
            nextStep={this.nextStep}
            handleChange={this.handleChange}
            values={this.state}
          />
        )
      case 2:
        return (
          <CreateProfile
            nextStep={this.nextStep}
            handleChange={this.handleChange}
            values={this.state}
          />
        )
      case 3:
        return (
          <SetPreferences
            nextStep={this.nextStep}
            handleChange={this.handleChange}
            handleSubmit={this.handleSubmit}
            setCookie={this.props.setCookie}
            values={this.state}
          />
        )
    }
  }
}

export default UserForm
