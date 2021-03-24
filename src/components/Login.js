import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Typography, TextField, Button } from "@material-ui/core";
import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL;

export default function Login(props) {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [incorrect, setIncorrect] = useState(false);
  const history = useHistory();

  const handleEmailChange = event => {
    setEmail(event.target.value);
  }

  const handlePasswordChange = event => {
    setPassword(event.target.value);
  }

  const handleSubmit = event => {
    event.preventDefault();

    axios.post(BASE_URL + '/login', {
      email: email,
      password: password
    })
    .then(res => {
      if (!res.data.user) {
        setIncorrect(true);
        throw new Error('incorrect credentials');
      } else {
        props.setCookie("user_id", res.data.user.user_id, {
          path: "/"
        });
        return axios.get(BASE_URL + '/api/users', {
          params: {
            user_id: res.data.user.user_id
          }
        })
      }
    })
    .then((data) => {
      props.setUser(data.data.users[0]);
      history.push("/dashboard");
    })
    .catch(err => {
      console.log(err)
    });

  }

  return (
    <div>
      <br/><br/><br/><br/><br/><br/><br/>
      <section className="form">          
        <Typography variant="h5">
          Log In
        </Typography>
        <br/><br/>
        <TextField 
          required
          variant="outlined"
          type="email"
          label="email address"
          onChange={handleEmailChange}
          className="textfield textfield--full"
        />
        <br/>
        <TextField 
          required
          variant="outlined"
          type="password"
          label="password"
          onChange={handlePasswordChange}
          className="textfield textfield--full"
        />
        <br/>
        <Button 
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          className="button"
        >
          Log In
        </Button>
        {incorrect && 
          <div>
            <br/>
            <Typography variant="subtitle2" color="error" className="error_message">
              Incorrect Email or Password
            </Typography>
          </div>
        }
        <br/><br/><br/><br/><br/>
      </section>
    </div>
  )
}