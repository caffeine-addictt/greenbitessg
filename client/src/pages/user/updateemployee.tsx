import { useEffect, useState } from 'react';
import { Box, Typography, TextField, Button, MenuItem } from '@mui/material';
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
    <Box>
      <Typography variant="h5" sx={{ my: 2 }}>
        Update Employee
      </Typography>
      <Box component="form" onSubmit={formik.handleSubmit}>
        <TextField
          fullWidth
          margin="dense"
          autoComplete="off"
          label="Name"
          name="name"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.name && Boolean(formik.errors.name)}
          helperText={formik.touched.name && formik.errors.name}
        />
        <TextField
          fullWidth
          margin="dense"
          autoComplete="off"
          label="Position"
          name="position"
          value={formik.values.position}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.position && Boolean(formik.errors.position)}
          helperText={formik.touched.position && formik.errors.position}
        />
        <TextField
          fullWidth
          margin="dense"
          select
          label="Department"
          name="department"
          value={formik.values.department}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.department && Boolean(formik.errors.department)}
          helperText={formik.touched.department && formik.errors.department}
        >
          {['Sales', 'Marketing', 'Finance', 'HR', 'IT', 'Operations'].map(
            (dept) => (
              <MenuItem key={dept} value={dept}>
                {dept}
              </MenuItem>
            ),
          )}
        </TextField>
        <TextField
          fullWidth
          margin="dense"
          autoComplete="off"
          label="Salary"
          name="salary"
          value={formik.values.salary}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.salary && Boolean(formik.errors.salary)}
          helperText={formik.touched.salary && formik.errors.salary}
        />
        <Box sx={{ mt: 2 }}>
          <Button variant="contained" type="submit">
            Update
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default UpdateEmployee;
