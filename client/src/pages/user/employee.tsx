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
import http from '@http'; // Adjust the path as needed

interface Employee {
  id: number;
  name: string;
  position: string;
  department: string;
  salary: number;
}

const EmployeeMain: React.FC = () => {
  const [employeeList, setEmployeeList] = useState<Employee[]>([]); // Specify Employee[] type
  const [searchQuery, setSearchQuery] = useState<string>(''); // Specify string type
  const [selectedEmployees, setSelectedEmployees] = useState<number[]>([]); // Specify number[] type
  const [deleteMode, setDeleteMode] = useState<boolean>(false); // Specify boolean type
  const navigate = useNavigate();

  useEffect(() => {
    fetchEmployees();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearch = () => {
    fetchEmployees();
  };

  const handleClear = () => {
    setSearchQuery('');
    fetchEmployees();
  };

  const handleEdit = (id: number) => {
    navigate(`/updateemployee/${id}`);
  };

  const handleDelete = () => {
    console.log('Deleting:', selectedEmployees);
    http
      .delete('/employees', { data: { ids: selectedEmployees } })
      .then((response) => {
        console.log('Deletion successful', response.data);
        fetchEmployees();
        setSelectedEmployees([]);
        setDeleteMode(false);
      })
      .catch((error) => {
        console.error('Error deleting employees:', error);
      });
  };

  const isSelected = (id: number) => selectedEmployees.includes(id);

  const toggleEmployeeSelection = (id: number) => {
    setSelectedEmployees((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((employeeId) => employeeId !== id)
        : [...prevSelected, id],
    );
  };

  return (
    <Box className="flex flex-col items-center space-y-4">
      <Box className="flex items-center space-x-2">
        <Input
          value={searchQuery}
          placeholder="Search for Staff"
          onChange={handleSearchChange}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSearch();
            }
          }}
          className="rounded-md border border-gray-300 px-2 py-1 focus:border-blue-300 focus:outline-none focus:ring"
        />
        <IconButton color="default" onClick={handleSearch}>
          <Search />
        </IconButton>
        <IconButton color="default" onClick={handleClear}>
          <Clear />
        </IconButton>
      </Box>
      <Typography variant="h5" className="text-xl font-bold">
        Employee Directory
      </Typography>

      <Grid container spacing={3} className="w-full">
        {employeeList.map((employee) => (
          <Grid item xs={12} md={6} lg={4} key={employee.id}>
            <Card className="rounded-md border border-gray-300 p-2">
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
                  <>
                    <Typography variant="h6" className="text-lg font-medium">
                      {employee.name} - {employee.position}
                    </Typography>
                    <Typography
                      variant="body2"
                      className="text-sm text-gray-600"
                    >
                      Department: {employee.department}
                    </Typography>
                    <Typography
                      variant="body2"
                      className="text-sm text-gray-600"
                    >
                      Salary: ${employee.salary}
                    </Typography>
                    <Button
                      variant="contained"
                      onClick={() => handleEdit(employee.id)}
                      className="mt-2 rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-600 focus:outline-none"
                    >
                      Edit
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Box>
        <Button
          variant="contained"
          onClick={() => navigate('/addemployee')}
          className="mt-4 rounded-md bg-green-500 px-4 py-2 text-white hover:bg-green-600 focus:bg-green-600 focus:outline-none"
        >
          Add Employee
        </Button>
      </Box>
      <Button
        onClick={handleDelete}
        className="mt-4 rounded-md bg-red-500 px-4 py-2 text-white hover:bg-red-600 focus:bg-red-600 focus:outline-none"
      >
        Delete Selected
      </Button>
    </Box>
  );
};

export default EmployeeMain;
