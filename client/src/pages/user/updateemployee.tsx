import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { useNavigate, useParams } from 'react-router-dom';
import http from '@http';
import { z } from 'zod';

const EmployeeSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'Name must be at least 3 characters' })
    .max(100, { message: 'Name must be at most 100 characters' }),
  position: z
    .string()
    .min(3, { message: 'Position must be at least 3 characters' })
    .max(100, { message: 'Position must be at most 100 characters' }),
  department: z
    .enum(['Sales', 'Marketing', 'Finance', 'HR', 'IT', 'Operations'])
    .optional(),
  salary: z.number().min(0, { message: 'Salary must be at least 0' }),
});

function UpdateEmployee() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [initialValues, setInitialValues] = useState({
    name: '',
    position: '',
    department: '',
    salary: 0,
  });

  useEffect(() => {
    http
      .get(`/employee/${id}`)
      .then((res: any) => {
        setInitialValues(res.data);
      })
      .catch((error: any) => {
        console.error('Error fetching employee details:', error);
      });
  }, [id]);

  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    validate: (values) => {
      try {
        EmployeeSchema.parse(values);
        return {};
      } catch (error) {
        if (error instanceof z.ZodError) {
          const errors: Record<string, string> = {};
          error.errors.forEach((err) => {
            if (err.path) {
              errors[err.path[0]] = err.message;
            }
          });
          return errors;
        }
        return {};
      }
    },
    onSubmit: (values) => {
      values.name = values.name.trim();
      values.position = values.position.trim();
      values.salary = parseFloat(values.salary as any);

      http
        .put(`/employee/${id}`, values)
        .then((res: any) => {
          console.log(res.data);
          navigate('/employees');
        })
        .catch((error: any) => {
          console.error('Error updating employee:', error);
        });
    },
  });

  return (
    <div className="max-w-md mx-auto mt-8 p-4 bg-white shadow-md rounded-md">
      <h2 className="text-xl font-bold mb-4">Update Employee</h2>
      <form onSubmit={formik.handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Name</label>
          <input
            type="text"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`w-full p-2 border ${
              formik.touched.name && formik.errors.name ? 'border-red-500' : 'border-gray-300'
            } rounded-md`}
          />
          {formik.touched.name && formik.errors.name && (
            <div className="text-red-500 text-sm mt-1">{formik.errors.name}</div>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Position</label>
          <input
            type="text"
            name="position"
            value={formik.values.position}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`w-full p-2 border ${
              formik.touched.position && formik.errors.position ? 'border-red-500' : 'border-gray-300'
            } rounded-md`}
          />
          {formik.touched.position && formik.errors.position && (
            <div className="text-red-500 text-sm mt-1">{formik.errors.position}</div>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Department</label>
          <select
            name="department"
            value={formik.values.department}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`w-full p-2 border ${
              formik.touched.department && formik.errors.department ? 'border-red-500' : 'border-gray-300'
            } rounded-md`}
          >
            <option value="" label="Select department" />
            {['Sales', 'Marketing', 'Finance', 'HR', 'IT', 'Operations'].map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
          {formik.touched.department && formik.errors.department && (
            <div className="text-red-500 text-sm mt-1">{formik.errors.department}</div>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Salary</label>
          <input
            type="number"
            name="salary"
            value={formik.values.salary}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`w-full p-2 border ${
              formik.touched.salary && formik.errors.salary ? 'border-red-500' : 'border-gray-300'
            } rounded-md`}
          />
          {formik.touched.salary && formik.errors.salary && (
            <div className="text-red-500 text-sm mt-1">{formik.errors.salary}</div>
          )}
        </div>
        <div className="mt-6">
          <button
            type="submit"
            className="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:bg-blue-600 focus:outline-none"
          >
            Update
          </button>
        </div>
      </form>
    </div>
  );
}

export default UpdateEmployee;
