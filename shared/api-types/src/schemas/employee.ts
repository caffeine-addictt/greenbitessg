import * as z from 'zod';

export const employeeSchema = z.object({
  id: z.number().int().positive(), // Adds id field as a positive integer
  name: z.string().max(100), // Corresponds to DataTypes.STRING(100) with allowNull: false
  position: z.string().max(100), // Corresponds to DataTypes.STRING(100) with allowNull: false
  department: z.enum([
    'Sales',
    'Marketing',
    'Finance',
    'HR',
    'IT',
    'Operations',
  ]), // Corresponds to DataTypes.ENUM
  salary: z.number().positive().max(9999999999.99), // Corresponds to DataTypes.DECIMAL(10, 2) with allowNull: false
});
