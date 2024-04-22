export default class Department {
  #id;

  #name;

  #members;

  constructor({ id, name, members }) {
    if (typeof id !== 'string') {
      throw new Error('Invalid id');
    }
    if (typeof name !== 'string' || name.length === 0) {
      throw new Error('Invalid name');
    }
    if (typeof members !== 'number') {
      throw new Error('Invalid members');
    }
    this.#id = id;
    this.#name = name;
    this.#members = members;
  }

  get id() {
    return this.#id;
  }

  set id(value) {
    if (typeof value !== 'string' || value.length === 0) {
      throw new Error('Invalid id');
    }
    this.#id = value;
  }

  get name() {
    return this.#name;
  }

  set name(value) {
    if (typeof value !== 'string' || value.length === 0) {
      throw new Error('Invalid name');
    }
    this.#name = value;
  }

  get members() {
    return this.#members;
  }

  set members(value) {
    if (typeof value !== 'number' || value < 0) {
      throw new Error('Invalid members');
    }
    this.#members = value;
  }

  getJson() {
    return {
      id: this.#id,
      name: this.#name,
      members: this.#members,
    };
  }

  update(data) {
    if (Object.prototype.hasOwnProperty.call(data, 'id')) {
      if (typeof data.id !== 'string' || data.id.length === 0) {
        throw new Error('Invalid id');
      }
      this.id = data.id;
    }
    if (Object.prototype.hasOwnProperty.call(data, 'name')) {
      if (typeof data.name !== 'string' || data.name.length === 0) {
        throw new Error('Invalid name');
      }
      this.name = data.name;
    }
    if (Object.prototype.hasOwnProperty.call(data, 'members')) {
      if (typeof data.members !== 'number' || data.members < 0) {
        throw new Error('Invalid members');
      }
      this.members = data.members;
    }
  }
}
