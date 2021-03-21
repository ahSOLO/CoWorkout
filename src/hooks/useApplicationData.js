import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
// import axios from 'fakeAxios';
import axios from 'axios';
import { allSlots, rebuildAppointmentObjs, formatTimeStamp } from "helpers/calendarHelpers";

const BASE_URL = process.env.REACT_APP_BASE_URL;

export default function useApplicationData() {

  const [ slots, setSlots ] = useState(allSlots);
  const [ appointments, setAppointments ] = useState([]);

  const months = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];

  const constructSlots = function(startDateTime = new Date()) {

    // Clone the start datetime so we don't change the targetDate state directly - needed to make sure we don't display past days when user scrolls back to current week.
    const dateClone = new Date(startDateTime.getTime());
    const today = new Date();
    // If target date is any day other than today, begin the start date on a Sunday - necessary for views outside of the current week.
    if (dateClone.getDate() !== today.getDate() || dateClone.getMonth() !== today.getMonth()) {
      dateClone.setDate(dateClone.getDate() - dateClone.getDay());
    }

    const start_date_exact = formatTimeStamp(dateClone);
    const start_date = new Date(`${start_date_exact.getDate()} ${months[start_date_exact.getMonth()]}, ${start_date_exact.getFullYear()}`);
    // console.log(start_date);
    const start_date_days_from_sunday = 7 - start_date.getDay();
    const end_date = new Date(start_date.getTime() + start_date_days_from_sunday * 24 * 60 * 59 * 1000); // 1 minute before midnight because we don't want to grab next week's sessions

    console.log('START:', start_date, '\n', 'END:', end_date);
    Promise.all([
      axios.get(BASE_URL + '/api/sessions', {
        params: {
          user_id: 1,
          filter: "transient",
          start_date,
          end_date,
        }
      }),
      axios.get(BASE_URL + '/api/sessions', {
        params: {
          user_id: 1,
          filter: "persistent",
          start_date,
          end_date,
        }
      })
    ])
    .then((all) => {
      const [ allSessionsQuery, persistentSessionsQuery ] = all;
      let retrievedAppointments = allSessionsQuery.data.sessions;
      let persistentAppointments = persistentSessionsQuery.data.sessions;
      console.log(retrievedAppointments);
      setAppointments(prev => retrievedAppointments);
      setSlots(rebuildAppointmentObjs(slots, persistentAppointments, retrievedAppointments, 'America/Vancouver')); // !! modify to use user's timezone dynamically
    })
  };

  useEffect(() => {
    constructSlots();
  }, []);

  const [ user, setUser ] = useState({});
  const [ cookies, setCookie, removeCookie ] = useCookies(["user_id"]);
  const user_id = cookies.user_id;

  useEffect(() => {
    axios.get("http://143.198.226.226:8081/api/users", {
      params: {
        user_id
      }
    })
    .then((data) => {
      setUser(data.data.users[0]);
    })
  }, [])

  return {
    slots,
    constructSlots,
    user,
    setUser,
    setCookie,
    removeCookie
  }

};