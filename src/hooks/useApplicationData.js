import React, { useEffect, useState } from "react";
import axios from 'fakeAxios';
// import axios from 'axios';
import { allSlots, rebuildAppointmentObjs, formatTimeStamp } from "helpers/calendarHelpers";

export default function useApplicationData() {

  const [ slots, setSlots ] = useState(allSlots);
  const [ appointments, setAppointments ] = useState([]);

  const months = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];

  const constructSlots = function(startDateTime = new Date()) {

    const start_date_exact = formatTimeStamp(startDateTime);
    const start_date = new Date(`${start_date_exact.getDate()} ${months[start_date_exact.getMonth()]}, ${start_date_exact.getFullYear()}`);
    // console.log(start_date);
    const start_date_days_from_sunday = 7 - start_date.getDay();
    const end_date = new Date(start_date.getTime() + start_date_days_from_sunday * 24 * 60 * 60 * 1000);

    // console.log('START:', start_date, '\n', 'END:', end_date);
    const baseURL = "";
    Promise.all([
      axios.get(baseURL + '/api/sessions', {
        params: {
          start_date,
          end_date
        }
      }),
      axios.get(baseURL + '/api/sessions', {
        params: {
          current_user: []
        }
      })
    ])
    .then((all) => {
      const [ retrievedAppointments, persistentAppointments ] = all;
      // console.log(retrievedAppointments);
      setAppointments(prev => retrievedAppointments);
      setSlots(rebuildAppointmentObjs(slots, persistentAppointments, retrievedAppointments, 'America/Vancouver')); // !! modify to use user's timezone dynamically
    })
  };

  useEffect(() => {
    constructSlots();
  }, []);

  return {
    slots,
    constructSlots
  }
};