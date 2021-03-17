import React, { useEffect, useState } from "react";
import axios from 'fakeAxios';
// import axios from 'axios';
import { allSlots, rebuildAppointmentObjs, formatTimeStamp } from "helpers/calendarHelpers";

export default function useApplicationData() {

  const [ slots, setSlots ] = useState(allSlots);
  const [ appointments, setAppointments ] = useState([]);

  const constructSlots = function(startDateTime) {
    // startDateTime = formatTimeStamp(startDateTime);

    const baseURL = "";
    Promise.all([
      axios.get(baseURL + '/api/sessions', {
        params: {
          start_date: startDateTime
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
      console.log(retrievedAppointments);
      setAppointments(prev => retrievedAppointments);
      setSlots(rebuildAppointmentObjs(slots, persistentAppointments, retrievedAppointments, 'Asia/Singapore')); // !! modify to use user's timezone dynamically
    })
  };

  useEffect(() => {
    constructSlots();
  }, []);

  return {
    slots,
    appointments,
    setSlots,
    setAppointments,
  }
};