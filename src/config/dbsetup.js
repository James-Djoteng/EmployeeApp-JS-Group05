/* eslint-disable no-console */
/* eslint-disable import/prefer-default-export */
import db from '../persistance/Database';

const createDepartmentTable = `
-- Create the departments table
CREATE TABLE IF NOT EXISTS departments (
  id VARCHAR(255) PRIMARY KEY NOT NULL,
  name VARCHAR(255),
  members INT DEFAULT 0
);`;

const createManagerTable = `
-- Create the managers table
CREATE TABLE IF NOT EXISTS managers (
  id VARCHAR(255) PRIMARY KEY NOT NULL,
  name VARCHAR(255) NOT NULL,
  username VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL
);`;
const createEmployeeTable = `
-- Create the employees table
CREATE TABLE IF NOT EXISTS employees (
  id VARCHAR(255) PRIMARY KEY NOT NULL,
  name VARCHAR(255) NOT NULL,
  department_id VARCHAR(255) NOT NULL,
  salary INT NOT NULL,
  FOREIGN KEY (department_id) REFERENCES departments(id)
);`;

const employeeView = `
CREATE OR REPLACE VIEW employeeInfo AS SELECT
  employees.id,
  employees.name,
  employees.salary,
  employees.department_id,
  departments.name AS department_name,
  departments.members AS department_members
FROM employees
INNER JOIN departments ON departments.id = employees.department_id;`;

const incrementMembersTrigger = `
CREATE TRIGGER IF NOT EXISTS increment_department_members AFTER INSERT ON employees
FOR EACH ROW
BEGIN
  UPDATE departments
  SET members = members + 1
  WHERE id = NEW.department_id;
END;`;

const decrementMembersTrigger = `
CREATE TRIGGER IF NOT EXISTS decrement_department_members AFTER DELETE ON employees
FOR EACH ROW
BEGIN
  UPDATE departments
  SET members = members - 1
  WHERE id = OLD.department_id;
END;`;

const changeMembersOnUpdateTrigger = `
CREATE TRIGGER IF NOT EXISTS change_department_members AFTER UPDATE ON employees
FOR EACH ROW
BEGIN
  UPDATE departments
  SET members = members - 1
  WHERE id = OLD.department_id;
  UPDATE departments
  SET members = members + 1
  WHERE id = NEW.department_id;
END;`;

export const setupDb = async () => {
  try {
    db.connect();
    await db.query(createDepartmentTable);
    await db.query(createManagerTable);
    await db.query(createEmployeeTable);
    await db.query(employeeView);
    await db.query(incrementMembersTrigger);
    await db.query(decrementMembersTrigger);
    await db.query(changeMembersOnUpdateTrigger);
    console.log('Database setup completed');
    process.exit();
  } catch (error) {
    console.error('Error setting up the database: ', error);
  }
};

setupDb();
