import React, { useEffect, useState } from "react";
import axios from 'fakeAxios';
// import axios from 'axios';
import { allSlots, rebuildAppointmentObjs } from "helpers/calendarHelpers";

export default function useApplicationData() {

  const [ slots, setSlots ] = useState(allSlots);
  const [ appointments, setAppointments ] = useState([]);

  useEffect(() => {

    const baseURL = "";

    Promise.all([
      axios.get(baseURL + '/api/sessions'),
      axios.get(baseURL + '/api/sessions', {
        params: {
          current_user: []
        }
      })
    ])
    .then((all) => {
      const [ retrievedAppointments, persistentAppointments ] = all;
      setAppointments(prev => retrievedAppointments);
      setSlots(rebuildAppointmentObjs(slots, persistentAppointments, retrievedAppointments, 'Asia/Singapore')); // !! modify to use user's timezone dynamically
    })
  }, []);

  return {
    slots,
    appointments,
    setSlots,
    setAppointments,
  }
};