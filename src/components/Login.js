import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Typography } from "@material-ui/core";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import axios from "axios";

export default function Login(props) {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [page, setPage] = useState({ redirect: null });
  const history = useHistory();

  const handleEmailChange = event => {
    setEmail(event.target.value);
  }

  const handlePasswordChange = event => {
    setPassword(event.target.value);
  }

  const handleSubmit = event => {
    event.preventDefault();

    axios.post('http://143.198.226.226:8081/login', {
      email: email,
      password: password
    })
    .then(res => {
      props.setCookie("user_id", res.data.user.id, {
        path: "/"
      });
      return axios.get("http://143.198.226.226:8081/api/users", {
        params: {
          user_id: res.data.user.id
        }
      })
    })
    .then((data) => {
      props.setUser(data.data.users[0]);
      history.push("/dashboard");
    })

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
          // error={this.state.emailIsInvalid}
          variant="outlined"
          type="email"
          label="email address"
          onChange={handleEmailChange}
          className="textfield textfield--full"
        />
        <br/>
        <TextField 
          required
          // error={this.state.passwordIsInvalid}
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
          log in
        </Button>
        <br/><br/><br/><br/><br/>
      </section>
    </div>
  )
}