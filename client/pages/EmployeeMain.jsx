import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Grid,
  Card,
  CardContent,
  Input,
  IconButton,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import { Search, Clear } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import http from '../src/http';
import '../src/styles/EmployeeMain.css'; // Adjust path based on your file structure

const EmployeeMain = () => {
  const [employeeList, setEmployeeList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [deleteMode, setDeleteMode] = useState(false); // State to toggle delete mode
  const navigate = useNavigate();

  useEffect(() => {
    fetchEmployees(); // Fetch all employees initially
  }, []);

  const fetchEmployees = () => {
    http
      .get(`/employee?query=${searchQuery}`)
      .then((res) => {
        setEmployeeList(res.data);
      })
      .catch((error) => {
        console.error('Error fetching employees:', error);
      });
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearch = () => {
    fetchEmployees();
  };

  const handleClear = () => {
    setSearchQuery('');
    fetchEmployees();
  };

  const handleEdit = (id) => {
    navigate(`/updateemployee/${id}`);
  };

  const handleDelete = () => {
    console.log('Deleting:', selectedEmployees); // Log selected employees to verify they are correct
    // Example: HTTP request to delete selected employees
    // Replace with your actual delete implementation
    http
      .delete('/employees', { data: { ids: selectedEmployees } })
      .then((response) => {
        console.log('Deletion successful', response.data); // Log successful response from server
        // Refresh employee list after successful delete
        fetchEmployees();
        setSelectedEmployees([]);
        setDeleteMode(false); // Exit delete mode after deletion
      })
      .catch((error) => {
        console.error('Error deleting employees:', error); // Log any errors that occur during deletion
        // Handle error state or show error message to user
      });
  };

  return (
    <Box className="employee-main-container">
      <Box className="search-container">
        <Input
          value={searchQuery}
          placeholder="Search for Staff"
          onChange={handleSearchChange}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSearch();
            }
          }}
          className="search-input"
        />
        <IconButton color="default" onClick={handleSearch}>
          <Search />
        </IconButton>
        <IconButton color="default" onClick={handleClear}>
          <Clear />
        </IconButton>
      </Box>
      <Typography variant="h5" className="employee-directory-title">
        Employee Directory
      </Typography>

      <Grid container spacing={2}>
        {employeeList.map((employee) => (
          <Grid item xs={12} md={6} lg={4} key={employee.id}>
            <Card className="employee-card">
              <CardContent>
                {deleteMode && (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={isSelected(employee.id)}
                        onChange={() => toggleEmployeeSelection(employee.id)}
                        color="primary"
                      />
                    }
                    label={`${employee.name} - ${employee.position}`}
                  />
                )}
                {!deleteMode && (
                  <Typography variant="h6" className="mb-1">
                    {employee.name} - {employee.position}
                  </Typography>
                )}
                <Typography
                  variant="body2"
                  color="textSecondary"
                  className="mb-1"
                >
                  Department: {employee.department}
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  className="mb-1"
                >
                  Salary: ${employee.salary}
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => handleEdit(employee.id)}
                >
                  Edit
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Box className="add-update-buttons">
        <Button
          variant="contained"
          onClick={() => navigate('/addemployee')}
          className="add-employee-button mt-2"
        >
          Add Employee
        </Button>
      </Box>
    </Box>
  );
};

export default EmployeeMain;
