import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography } from '@mui/material';
import http from '@http';

const AccountSettings: React.FC = () => {
  const [id, setId] = useState<string>('');
  const [name, setName] = useState<string>('');
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
    <div>
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
          <Button variant="contained" onClick={handleCancel}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSave}>
            Save
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AccountSettings;
