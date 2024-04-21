import Employee from '../src/models/Employee';

describe('employee Class', () => {
  it('constructor sets properties correctly', () => {
    const employee = new Employee({
      id: '1',
      name: 'James Djoteng',
      department: 'Sales',
      salary: 1000,
    });
    expect(employee.id).toBe('1');
    expect(employee.name).toBe('James Djoteng');
    expect(employee.department).toBe('Sales');
    expect(employee.salary).toBe(1000);
  });
});
