import React, { useEffect, useState } from "react";
import fakeAxios from 'fakeAxios';
import axios from 'axios';
import { allSlots, rebuildAppointmentObjs, formatTimeStamp } from "helpers/calendarHelpers";

const BASE_URL = process.env.REACT_APP_BASE_URL;

export default function useApplicationData() {

  const [ slots, setSlots ] = useState(allSlots);
  const [ appointments, setAppointments ] = useState([]);

  const months = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];

  const constructSlots = function(startDateTime = new Date()) {
    const today = new Date();
    // If target date is any day other than today, begin the start date on a Sunday - necessary for views outside of the current week.
    if (startDateTime.getDate() != today.getDate() || startDateTime.getMonth() != today.getMonth()) {
      startDateTime.setDate(startDateTime.getDate() - startDateTime.getDay());
    }

    const start_date_exact = formatTimeStamp(startDateTime);
    const start_date = new Date(`${start_date_exact.getDate()} ${months[start_date_exact.getMonth()]}, ${start_date_exact.getFullYear()}`);
    // console.log(start_date);
    const start_date_days_from_sunday = 7 - start_date.getDay();
    const end_date = new Date(start_date.getTime() + start_date_days_from_sunday * 24 * 60 * 60 * 1000);

    console.log('START:', start_date, '\n', 'END:', end_date);
    Promise.all([
      fakeAxios.get(baseURL + '/api/sessions', {
        params: {
          user_id: 1,
          filter: "transient",
          start_date,
          end_date,
        }
      }),
      fakeAxios.get(baseURL + '/api/sessions', {
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

  const [ user, setUser ] = useState([]);
  const user_id = 2;

  useEffect(() => {
    Promise.all([
      axios.get("http://143.198.226.226:8081/api/users", {
        params: {
          user_id
        }
      })
    ]).then((all) => {
      setUser(all[0].data.users[0]);
    })
  }, [])

  return {
    slots,
    constructSlots,
    user,
    setUser
  }
};