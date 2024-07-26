import { IAuthedRouteHandler } from '../route-map';
import { GetEmployeeSuccAPI } from '../lib/api-types/employee';

// Example function to fetch employee data by ID (replace with actual implementation)
async function fetchEmployeeById(id: number): Promise<Employee | null> {
  // Replace with your actual implementation to fetch employee data
  // This is just an example; adapt it to your actual data source
  return {
    id, // Use the parameter id here
    name: 'John Doe',
    position: 'Developer',
    department: 'IT',
    salary: 70000,
  };
}

// Define the Employee type
interface Employee {
  id: number;
  name: string;
  position: string;
  department: 'Sales' | 'Marketing' | 'Finance' | 'HR' | 'IT' | 'Operations';
  salary: number;
}

export const getEmployee: IAuthedRouteHandler = async (req, res) => {
  // Extract employee ID from the request params or query
  const employeeId = parseInt(req.params.id, 10); // Ensure employeeId is a number

  if (isNaN(employeeId)) {
    return res.status(400).json({
      status: 400,
      message: 'Invalid employee ID',
    });
  }

  // Fetch employee data from a database or another source using employeeId
  const employeeData = await fetchEmployeeById(employeeId);

  if (!employeeData) {
    return res.status(404).json({
      status: 404,
      message: 'Employee not found',
    });
  }

  return res.status(200).json({
    status: 200,
    data: {
      id: employeeData.id, // Include the employee ID from fetched data
      name: employeeData.name,
      position: employeeData.position,
      department: employeeData.department,
      salary: employeeData.salary,
    },
  } satisfies GetEmployeeSuccAPI);
};
