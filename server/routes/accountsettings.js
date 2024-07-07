// routes/accountsettings.js

// Disable linting errors for require statements and undefined variables
/* eslint-disable @typescript-eslint/no-var-requires, no-undef */

const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const yup = require('yup');
const db = require('../models');
const AccountSettings = db.AccountSettings;

// Yup schema for request body validation
const accountSettingsSchema = yup.object().shape({
  Name: yup.string().required(),
  Department: yup.string().required(),
  UserName: yup.string().required(),
  Password: yup.string().required().min(8),
  Birthday: yup.date(),
  PhoneNumber: yup.string(),
  Email: yup.string().email().required(),
});

// Middleware for request body validation
const validateAccountSettings = async (req, res, next) => {
  try {
    await accountSettingsSchema.validate(req.body, { abortEarly: false });
    next();
  } catch (error) {
    if (error.name === 'ValidationError') {
      const validationErrors = error.inner.map((err) => ({
        field: err.path,
        message: err.message,
      }));
      return res.status(400).json({ errors: validationErrors });
    }
    next(error);
  }
};

// Create a new account setting
router.post('/', validateAccountSettings, async (req, res) => {
  try {
    const newAccountSetting = await AccountSettings.create(req.body);
    res.status(201).json(newAccountSetting);
  } catch (error) {
    console.error('Error creating account setting:', error);
    res.status(500).json({ message: error.message });
  }
});

// Search based on these particular sections
router.get('/', async (req, res) => {
  try {
    const { Name, Department, UserName, Email } = req.query;

    const searchCondition = {};
    if (Name) searchCondition.Name = { [Op.like]: `%${Name}%` };
    if (Department)
      searchCondition.Department = { [Op.like]: `%${Department}%` };
    if (UserName) searchCondition.UserName = { [Op.like]: `%${UserName}%` };
    if (Email) searchCondition.Email = { [Op.like]: `%${Email}%` };

    const accountSettings = await AccountSettings.findAll({
      where: searchCondition,
    });
    res.json(accountSettings);
  } catch (error) {
    console.error('Error reading account settings:', error);
    res.status(500).json({ message: error.message });
  }
});

// Read a specific account setting by ID
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const accountSetting = await AccountSettings.findByPk(id);
    if (accountSetting) {
      res.json(accountSetting);
    } else {
      res.status(404).json({ message: 'Account setting not found' });
    }
  } catch (error) {
    console.error('Error reading account setting:', error);
    res.status(500).json({ message: error.message });
  }
});

// Update a specific account setting by ID
router.put('/:id', validateAccountSettings, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const [updated] = await AccountSettings.update(req.body, { where: { id } });
    if (updated) {
      const updatedAccountSetting = await AccountSettings.findByPk(id);
      res.json({
        message: 'Account settings updated successfully!',
        updatedAccountSetting,
      });
    } else {
      res.status(400).json({ message: 'Cannot update account settings' });
    }
  } catch (error) {
    console.error('Error updating account setting:', error);
    res.status(500).json({ message: error.message });
  }
});

// Delete a specific account setting by ID
router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const deleted = await AccountSettings.destroy({ where: { id } });
    if (deleted) {
      res.json({ message: 'Account setting deleted successfully.' });
    } else {
      res.status(404).json({ message: 'Account setting not found' });
    }
  } catch (error) {
    console.error('Error deleting account setting:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
