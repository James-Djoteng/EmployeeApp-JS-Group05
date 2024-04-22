/* eslint-disable class-methods-use-this */
import Manager from '../models/manager';
import db from './Database';
import {
  del, get, getAll, set,
} from './cache';

export default class ManagerTable {
  async create(manager) {
    const query = `INSERT INTO managers (id, name, username, password) VALUES ('${manager.id}', '${manager.name}', '${manager.username}', '${manager.password}')`;
    await db.query(query);
    await set(`MANAGER:${manager.id}`, manager.getJson());
    return manager;
  }

  async getManagerById(id) {
    const query = `SELECT * FROM managers WHERE id = '${id}'`;
    const cachedManager = await get(`MANAGER${id}`);
    if (cachedManager) {
      return new Manager(cachedManager);
    }
    const [[manager]] = await db.query(query);
    if (!manager) {
      return null;
    }
    await set(`MANAGER:${id}`, manager);
    return new Manager(manager);
  }

  async getManagerByUsername(username) {
    const query = `SELECT * FROM managers WHERE username = '${username}'`;
    const [[manager]] = await db.query(query);
    if (!manager) {
      return null;
    }
    return new Manager(manager);
  }

  async getManagers() {
    const query = 'SELECT * FROM managers';
    const cachedManagers = await getAll('MANAGER:*');
    if (cachedManagers.length > 0) {
      return cachedManagers.map((manager) => new Manager(manager));
    }
    const [managers] = await db.query(query);
    const allManagers = managers
      .map((manager) => new Manager(manager));
    await Promise.all(allManagers.map(async (manager) => {
      await set(`MANAGER:${manager.id}`, manager.getJson());
    }));
    return allManagers;
  }

  async deleleManager(id) {
    const query = `DELETE FROM managers WHERE id = '${id}'`;
    const [result] = await db.query(query);
    await del(`MANAGER:${id}`);
    if (result.affectedRows === 0) {
      throw new Error('Unable to delete the manager');
    }
    return result;
  }

  async updateManager(manager) {
    const query = `UPDATE managers SET name = '${manager.name}' WHERE id = '${manager.id}'`;
    const [result] = await db.query(query);
    await set(`MANAGER:${manager.id}`, manager.getJson());
    if (result.changedRows === 0) {
      throw new Error('Unable to update the employee');
    }
    return result;
  }
}
