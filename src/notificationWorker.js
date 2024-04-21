import { dequeueNotification } from './services/queue';

async function processNotifications() {
  try {
    const notification = await dequeueNotification();
    // Your logic to send notifications based on the notification type
    console.log('Sending notification:', notification);
    // Call processNotifications again to continue processing notifications
    processNotifications();
  } catch (error) {
    console.error('An error occurred while processing notifications:', error);
  }
}

processNotifications();
