import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import http from '../src/http';

const AccountSettings = () => {
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [birthday, setBirthday] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null); // Add error state

  useEffect(() => {
    // Fetch account settings on component mount
    http
      .get('/accountsettings')
      .then((res) => {
        if (res.data.length > 0) {
          const account = res.data[0];
          setId(account.id);
          setName(account.Name);
          setDepartment(account.Department);
          setUsername(account.UserName);
          setPassword(account.Password);
          setBirthday(account.Birthday);
          setPhoneNumber(account.PhoneNumber);
          setEmail(account.Email);
        }
      })
      .catch((err) => {
        console.error('Error fetching account settings:', err);
        setError('Error fetching account settings');
      });
  }, []);

  const handleSave = () => {
    const updatedDetails = {
      Name: name,
      Department: department,
      UserName: username,
      Password: password,
      Birthday: birthday,
      PhoneNumber: phoneNumber,
      Email: email,
    };

    // Update account settings using http.put
    http
      .put(`/accountsettings/${id}`, updatedDetails)
      .then((response) => {
        console.log('Account details updated successfully');
        alert('Account details updated successfully');
        setError(null); // Clear any previous errors
      })
      .catch((error) => {
        console.error(
          'There was an error updating the account details!',
          error,
        );
        setError('Error updating account details');
      });
  };

  const handleCancel = () => {
    console.log('Cancelled');
    alert('Edit cancelled');
  };

  return (
    <div className="mx-auto max-w-4xl p-6 bg-white shadow-md rounded-md">
      <Typography variant="h4" className="mb-4">
        Account Settings
      </Typography>
      <form className="space-y-4">
        {error && <Typography color="error">{error}</Typography>}{' '}
        {/* Display error */}
        <div>
          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full"
          />
        </div>
        <div>
          <FormControl className="w-full">
            <InputLabel>Department</InputLabel>
            <Select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            >
              <MenuItem value="Sales">Sales</MenuItem>
              <MenuItem value="Marketing">Marketing</MenuItem>
              <MenuItem value="Finance">Finance</MenuItem>
              <MenuItem value="HR">HR</MenuItem>
              <MenuItem value="IT">IT</MenuItem>
              <MenuItem value="Operations">Operations</MenuItem>
            </Select>
          </FormControl>
        </div>
        <div>
          <TextField
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full"
          />
        </div>
        <div>
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full"
          />
        </div>
        <div>
          <TextField
            label="Birthday"
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)}
            className="w-full"
          />
        </div>
        <div>
          <TextField
            label="Phone Number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full"
          />
        </div>
        <div>
          <TextField
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="flex space-x-4">
          <Button variant="contained" color="secondary" onClick={handleCancel}>
            Cancel
          </Button>
          <Button variant="contained" color="primary" onClick={handleSave}>
            Save
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AccountSettings;
