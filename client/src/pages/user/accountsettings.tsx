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
import http from '@http';

const AccountSettings: React.FC = () => {
  const [id, setId] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [department, setDepartment] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [birthday, setBirthday] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

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
        console.log('Account details updated successfully:', response.data);
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
      <Typography variant="h4" className="mb-4 text-2xl font-bold">
        Account Settings
      </Typography>
      <form className="space-y-4">
        {error && <Typography color="error">{error}</Typography>}
        <div>
          <TextField
            className="w-full"
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            variant="outlined"
          />
        </div>
        <div>
          <FormControl className="w-full">
            <InputLabel>Department</InputLabel>
            <Select
              className="mt-1 w-full"
              value={department}
              onChange={(e) => setDepartment(e.target.value as string)}
              variant="outlined"
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
            className="w-full"
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            variant="outlined"
          />
        </div>
        <div>
          <TextField
            className="w-full"
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            variant="outlined"
          />
        </div>
        <div>
          <TextField
            className="w-full"
            label="Birthday"
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)}
            variant="outlined"
          />
        </div>
        <div>
          <TextField
            className="w-full"
            label="Phone Number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            variant="outlined"
          />
        </div>
        <div>
          <TextField
            className="w-full"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            variant="outlined"
          />
        </div>
        <div className="flex space-x-4">
          <Button
            className="px-6 py-2"
            variant="contained"
            color="secondary"
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button
            className="px-6 py-2"
            variant="contained"
            color="primary"
            onClick={handleSave}
          >
            Save
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AccountSettings;
