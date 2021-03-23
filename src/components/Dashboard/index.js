import { useState } from 'react';
import Calendar from "./Calendar";
import { CircularProgress } from '@material-ui/core';
import "./styles.scss";

export default function Dashboard(props) {
  const [loading, setLoading] = useState(true);

  // Do not render if there is no logged in user
  if (!props.user.user_id) return null;

  return (
    <>
      {loading && <div id="dashboard-loading">
        <CircularProgress color="primary" size={150}/>
      </div>}
      <Calendar setLoading={setLoading} user={props.user}/>
    </>
  )
}