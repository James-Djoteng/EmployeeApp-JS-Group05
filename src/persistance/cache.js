import redis from 'redis';
import { promisify } from 'util';

const client = redis.createClient();

// Function to set data in cache
export async function set(key, value) {
  const setAsync = promisify(client.set).bind(client);
  return setAsync(key, JSON.stringify(value));
}

// Function to get data from cache
export async function get(key) {
  return new Promise((resolve, reject) => {
    client.get(key, (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(JSON.parse(data));
    });
  });
}

// Function to get all data from cache
export async function getAll(pattern) {
  const keysAsync = promisify(client.keys).bind(client);
  const getAsync = promisify(client.get).bind(client);
  const keys = await keysAsync(pattern);
  const data = await Promise.all(keys.map((key) => getAsync(key)));
  return data.map((item) => JSON.parse(item));
}

// Function to delete data from cache
export async function del(key) {
  const delAsync = promisify(client.del).bind(client);
  return delAsync(key);
}
