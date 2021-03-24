import { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles'
import axios from 'axios';
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, FormControl, Select, InputLabel, MenuItem } from '@material-ui/core';
import "./Leaderboard.scss";

const BASE_URL = process.env.REACT_APP_BASE_URL;

const useStyles = makeStyles(() => ({
  filter: {
    width: '200px',
    'margin-top': '20px',
    'margin-right': '30px',
    'margin-bottom': '20px'
  },
  table: {
    width: '75vw'
  },
  table_header: {
      backgroundColor: '#FBB03B'
  }
}))

export default function Leaderboard(props) {

  const classes = useStyles();

  const [leaderboard, setLeaderboard] = useState([]);
  const [filters, setFilters] = useState({
    rank_by: 'completed_sessions',
    date_range: 30
  });

  const handleChange = input => event => {
    setFilters({
      ...filters,
      [input]: event.target.value
    });
  }

  useEffect(() => {
    axios.get(BASE_URL + '/api/users/leaderboard', {
      params: {
        rank_by: filters.rank_by,
        date_range: filters.date_range
      }
    })
    .then((data) => {
      setLeaderboard(data.data.users);
    })
  }, [filters])

  // Do not render if there is no logged in user
  if (!props.user.user_id) return null;

  return (
    <div>
      <Typography id="leaderboard-header" variant='h2'>
        Leaderboard
      </Typography>
      <FormControl className={classes.filter}>
        <InputLabel>Rank Users By</InputLabel>
        <Select
          value={filters.rank_by}
          onChange={handleChange('rank_by')}
        >
          <MenuItem value='completed_sessions'>Completed Sessions</MenuItem>
          <MenuItem value='completion_rate'>Completion Rate</MenuItem>
          <MenuItem value='avg_session_length'>Avg Session Length</MenuItem>
        </Select>
      </FormControl>
      <FormControl className={classes.filter}>
        <InputLabel>Date Range</InputLabel>
        <Select
          value={filters.date_range}
          onChange={handleChange('date_range')}
        >
          <MenuItem value={7}>Last 7 Days</MenuItem>
          <MenuItem value={30}>Last 30 Days</MenuItem>
          <MenuItem value={90}>Last 90 Days</MenuItem>
        </Select>
      </FormControl>
      <TableContainer component={Paper}>
        <Table aria-label="simple table" className={classes.table}>
          <caption>Displaying the top 10 users.</caption>
          <TableHead className={classes.table_header}>
            <TableRow>
              <TableCell><b>User</b></TableCell>
              <TableCell><b>Location</b></TableCell>
              <TableCell align="right"><b>Completed Sessions</b></TableCell>
              <TableCell align="right"><b>Completion Rate</b></TableCell>
              <TableCell align="right"><b>Avg Session Length</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {leaderboard.map((user) => (
              <TableRow key={user.name}>
                <TableCell component="th" scope="row">
                  {user.name}
                </TableCell>
                <TableCell>{user.region}, {user.country}</TableCell>
                <TableCell align="right">{user.completed_sessions}</TableCell>
                <TableCell align="right">{Math.round(user.completion_rate * 10000) / 100}%</TableCell>
                <TableCell align="right">{Math.round(user.avg_session_length * 100) / 100} minutes</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <br/><br/><br/><br/><br/>
    </div>
  )
}