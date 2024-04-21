import redis from 'redis';

const client = redis.createClient();

export function enqueueNotification(notification) {
  client.lpush('notifications', JSON.stringify(notification));
}

export function dequeueNotification() {
  return new Promise((resolve, reject) => {
    client.rpop('notifications', (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(data));
      }
    });
  });
}
