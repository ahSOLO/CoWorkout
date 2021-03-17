import React, { useEffect, useState } from "react";
import axios from 'fakeAxios';
// import axios from 'axios';
import { allSlots, changeToUserTZ, extractTimeString, getWeekDates } from "helpers/calendarHelpers";

export default function useApplicationData() {

  const [ slots, setSlots ] = useState(allSlots);
  const [ appointments, setAppointments ] = useState([]);

  useEffect(() => {

    const baseURL = ""; // use 'http://143.198.226.226:8081' in production

    axios.get(baseURL + '/api/sessions')
    .then((data) => {
      setAppointments(prev => data);
    });
  });

  return {
    slots,
    appointments,
    setSlots,
    setAppointments,
  }
};