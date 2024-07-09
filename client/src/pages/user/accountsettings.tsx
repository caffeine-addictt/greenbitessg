import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography } from '@mui/material';
import http from '@http';

const AccountSettings: React.FC = () => {
  const [id, setId] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [permission, setPermission] = useState<string>('');
  const [createdAt, setCreatedAt] = useState<string>('');
  const [updatedAt, setUpdatedAt] = useState<string>('');

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch account settings on component mount
    http
      .get('/accountsettings')
      .then((res) => {
        if (res.data) {
          const account = res.data;
          setId(account.id);
          setUsername(account.username);
          setEmail(account.email);
          setPermission(account.permission);
          setCreatedAt(account.createdAt);
          setUpdatedAt(account.updatedAt);
        }
      })
      .catch((err) => {
        console.error('Error fetching account settings:', err);
        setError('Error fetching account settings');
      });
  }, []);

  const handleSave = () => {
    const updatedDetails = {
      username,
      email,
      permission,
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
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
        <div>
          <TextField
            className="w-full"
            label="Permission"
            value={permission}
            onChange={(e) => setPermission(e.target.value)}
            variant="outlined"
          />
        </div>
        <div>
          <TextField
            className="w-full"
            label="Created At"
            value={createdAt}
            onChange={(e) => setCreatedAt(e.target.value)}
            variant="outlined"
            disabled
          />
        </div>
        <div>
          <TextField
            className="w-full"
            label="Updated At"
            value={updatedAt}
            onChange={(e) => setUpdatedAt(e.target.value)}
            variant="outlined"
            disabled
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
