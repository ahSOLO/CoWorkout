import React, { useEffect, useState } from "react";
import axios from 'fakeAxios';
// import axios from 'axios';
import { allSlots, rebuildAppointmentObjs } from "helpers/calendarHelpers";

export default function useApplicationData() {

  const [ slots, setSlots ] = useState(allSlots);
  const [ appointments, setAppointments ] = useState([]);

  useEffect(() => {

    const baseURL = ""; // use 'http://143.198.226.226:8081' in production

    axios.get(baseURL + '/api/sessions')
    .then((data) => {
      console.log(data);
      setAppointments(prev => data);
      setSlots(rebuildAppointmentObjs(slots, data, 'Asia/Singapore'));
      console.log(slots);
    });

  }, []);

  return {
    slots,
    appointments,
    setSlots,
    setAppointments,
  }
};