import React, { useEffect, useState } from 'react';
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
  const [employeeList, setEmployeeList] = useState<Employee[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedEmployees, setSelectedEmployees] = useState<number[]>([]);
  const [deleteMode, setDeleteMode] = useState<boolean>(false);
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
    <div className="flex flex-col items-center space-y-4">
      <div className="flex items-center space-x-2">
        <input
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
        <button onClick={handleSearch} className="p-2">
          <svg
            className="size-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-4.35-4.35M17 11a6 6 0 10-12 0 6 6 0 0012 0z"
            />
          </svg>
        </button>
        <button onClick={handleClear} className="p-2">
          <svg
            className="size-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
      <h5 className="text-xl font-bold">Employee Directory</h5>
      <div>
        {employeeList.map((employee) => (
          <div
            key={employee.id}
            className="rounded-md border border-gray-300 p-2"
          >
            <div>
              {deleteMode && (
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={isSelected(employee.id)}
                    onChange={() => toggleEmployeeSelection(employee.id)}
                    className="size-4 text-blue-600"
                  />
                  <span className="ml-2">
                    {employee.name} - {employee.position}
                  </span>
                </label>
              )}
              {!deleteMode && (
                <>
                  <h6 className="text-lg font-medium">
                    {employee.name} - {employee.position}
                  </h6>
                  <p className="text-sm text-gray-600">
                    Department: {employee.department}
                  </p>
                  <p className="text-sm text-gray-600">
                    Salary: ${employee.salary}
                  </p>
                  <button
                    onClick={() => handleEdit(employee.id)}
                    className="mt-2 rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-600 focus:outline-none"
                  >
                    Edit
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
      <div>
        <button
          onClick={() => navigate('/addemployee')}
          className="mt-4 rounded-md bg-green-500 px-4 py-2 text-white hover:bg-green-600 focus:bg-green-600 focus:outline-none"
        >
          Add Employee
        </button>
      </div>
      {deleteMode && (
        <button
          onClick={handleDelete}
          className="mt-4 rounded-md bg-red-500 px-4 py-2 text-white hover:bg-red-600 focus:bg-red-600 focus:outline-none"
        >
          Delete Selected
        </button>
      )}
    </div>
  );
};

export default EmployeeMain;
