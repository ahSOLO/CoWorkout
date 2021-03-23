import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
// import axios from 'fakeAxios';
import axios from 'axios';
import { allSlots, rebuildAppointmentObjs, formatTimeStamp } from "helpers/calendarHelpers";

const BASE_URL = process.env.REACT_APP_BASE_URL;

export default function useApplicationData() {

  const [ slots, setSlots ] = useState(allSlots);
  const [ appointments, setAppointments ] = useState([]);

  const [ user, setUser ] = useState({});
  const [ cookies, setCookie, removeCookie ] = useCookies(["user_id"]);
  const user_id = cookies.user_id;

  const months = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];

  const constructSlots = function(startDateTime = new Date(), filterOptions = {}) {
    // Clone the start datetime so we don't change the targetDate object directly (it's mutable) - needed to make sure we don't display past days when user scrolls back to current week.
    // Move dateClone back 15 minutes in case user needs to join a session a few minutes late
    const dateClone = new Date(startDateTime.getTime() - (15 * 60 * 1000));

    const today = new Date();
    // If target date is any day other than today, begin the start date on a Sunday - necessary for views outside of the current week.
    if (dateClone.getDate() !== today.getDate() || dateClone.getMonth() !== today.getMonth()) {
      dateClone.setDate(dateClone.getDate() - dateClone.getDay());
    }

    const start_date_exact = formatTimeStamp(dateClone);
    const start_date = new Date(`${start_date_exact.getDate()} ${months[start_date_exact.getMonth()]}, ${start_date_exact.getFullYear()}`);
    // console.log(start_date);
    const start_date_days_from_sunday = 7 - start_date.getDay();
    const end_date = new Date(start_date.getTime() + start_date_days_from_sunday * 24 * 60 * 59 * 1000); // 1 second before midnight because we don't want to grab next week's sessions

    // Use the exact start date (which is current time - 15 minutes - see above) so we don't grab old appointments from today
    console.log('START:', start_date_exact, '\n', 'END:', end_date);
    Promise.all([
      axios.get(BASE_URL + '/api/sessions', {
        params: {
          user_id: user_id,
          filter: { type: "transient", activityId: filterOptions.activityId },
          start_date: start_date_exact,
          end_date,
        }
      }),
      axios.get(BASE_URL + '/api/sessions', {
        params: {
          user_id: user_id,
          filter: { type: "persistent" },
          start_date: start_date_exact,
          end_date,
        }
      })
    ])
    .then((all) => {
      const [ allSessionsQuery, persistentSessionsQuery ] = all;
      let retrievedAppointments = allSessionsQuery.data.sessions;
      let persistentAppointments = persistentSessionsQuery.data.sessions;
      setAppointments(prev => retrievedAppointments);
      setSlots(rebuildAppointmentObjs(slots, persistentAppointments, retrievedAppointments, 'America/Vancouver')); // Modify to use user's timezone dynamically when we implement usage of stored timezones. Right now app only runs on local time.
    })
  };

  useEffect(() => {
    constructSlots();
  }, []);

  useEffect(() => {
    axios.get(BASE_URL + '/api/users', {
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