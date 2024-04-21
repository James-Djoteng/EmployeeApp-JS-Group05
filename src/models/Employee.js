export default class Employee {
  #id;

  #name;

  #department;

  #salary;

  constructor({
    id, name, department, salary,
  }) {
    if (typeof id !== 'string') {
      throw new Error('Id need to be a string');
    }
    if (typeof name !== 'string') {
      throw new Error('Name need to be a string');
    }
    if (typeof department !== 'string') {
      throw new Error('Department need to be a string');
    }
    if (typeof salary !== 'number') {
      throw new Error('Salary need to be a number');
    }
    this.#id = id;
    this.#name = name;
    this.#department = department;
    this.#salary = salary;
  }

  get id() {
    return this.#id;
  }

  set id(id) {
    if (typeof id !== 'string') {
      throw new Error('Id need to be a string');
    }
    this.#id = id;
  }

  get name() {
    return this.#name;
  }

  set name(name) {
    if (typeof name !== 'string') {
      throw new Error('Name need to be a string');
    }
    this.#name = name;
  }

  get department() {
    return this.#department;
  }

  set department(department) {
    if (typeof department !== 'string') {
      throw new Error('Department need to be a string');
    }
    this.#department = department;
  }

  get salary() {
    return this.#salary;
  }

  set salary(salary) {
    if (typeof salary !== 'number') {
      throw new Error('Salary need to be a number');
    }
    this.#salary = salary;
  }

  update({
    id, name, department, salary,
  }) {
    if (typeof id !== 'string' && id.length > 0) {
      throw new Error('Id need to be a string');
    }
    if (typeof name !== 'string' && name.length > 0) {
      throw new Error('Name need to be a string');
    }
    if (typeof department !== 'string' && department.length > 0) {
      throw new Error('Department need to be a string');
    }
    if (typeof salary !== 'number' && salary > 0) {
      throw new Error('Salary need to be a number');
    }
    if (name) {
      this.name = name;
    }
    if (department) {
      this.department = department;
    }
    if (salary) {
      this.salary = salary;
    }
  }

  getJson() {
    return {
      id: this.id,
      name: this.name,
      department: this.department,
      salary: this.salary,
    };
  }
}
