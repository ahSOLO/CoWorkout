import React, { Component, useState } from 'react';
const request = require('request');

export default function CustomReroute(props) {
  const [fetchedKey, setFetchedKey] = useState('');

  request('http://143.198.226.226:8081/token', function(error, response, body) {
    // console.error('error:', error); // Print the error if one occurred
    // console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    // console.log('body:', body); // Print the HTML for the Google homepage.
    setFetchedKey(body);
  });

  console.log(fetchedKey);
  return <>{fetchedKey || 'Loading'}</>;
}
