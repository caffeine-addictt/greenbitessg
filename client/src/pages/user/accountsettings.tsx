import React, { useState, useEffect } from 'react';
import { Button } from '@components/ui/button';

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
    fetch('/accountsettings')
      .then((res) => res.json())
      .then((data) => {
        const account = data;
        setId(account.id);
        setUsername(account.username);
        setEmail(account.email);
        setPermission(account.permission);
        setCreatedAt(account.createdAt);
        setUpdatedAt(account.updatedAt);
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

    // Update account settings using fetch
    fetch(`/accountsettings/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedDetails),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Account details updated successfully:', data);
        alert('Account details updated successfully');
        setError(null); // Clear any previous errors
      })
      .catch((error) => {
        console.error('There was an error updating the account details!', error);
        setError('Error updating account details');
      });
  };

  const handleCancel = () => {
    console.log('Cancelled');
    alert('Edit cancelled');
  };

  return (
    <div className="container mx-auto mt-16">
      <h1 className="text-center text-2xl font-bold">Account Settings</h1>
      <form className="space-y-4 mt-8">
        {error && <p className="text-red-500">{error}</p>}
        <div>
          <label className="block text-sm font-medium">Username</label>
          <input
            type="text"
            className="mt-1 block w-full border rounded px-3 py-2"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            className="mt-1 block w-full border rounded px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Permission</label>
          <input
            type="text"
            className="mt-1 block w-full border rounded px-3 py-2"
            value={permission}
            onChange={(e) => setPermission(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Created At</label>
          <input
            type="text"
            className="mt-1 block w-full border rounded px-3 py-2"
            value={createdAt}
            disabled
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Updated At</label>
          <input
            type="text"
            className="mt-1 block w-full border rounded px-3 py-2"
            value={updatedAt}
            disabled
          />
        </div>
        <div className="flex space-x-4 mt-4">
          <Button variant="secondary" onClick={handleCancel}>
            Cancel
          </Button>
          <Button variant="secondary" onClick={handleSave}>
            Save
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AccountSettings;
