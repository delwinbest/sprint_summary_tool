import mongoose from 'mongoose';
import { app } from './app';
import { UserCreatedListener } from './events/listeners/user-created-listener';
import { natsWrapper } from './nats-wrapper';

const start = async () => {
  console.log('Auth App starting...');
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY is not defined');
  }
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is not defined');
  }
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error('NATS_CLIENT_ID is not defined');
  }
  if (!process.env.NATS_URL) {
    throw new Error('NATS_URL is not defined');
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error('NATS_CLUSTER_ID is not defined');
  }
  try {
    console.log('Connecting to NATS server', process.env.NATS_URL);
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL,
    );
    natsWrapper.client.on('close', () => {
      console.log('NATS connection closed!');
      process.exit();
    });
    process.on('SIGINT', () => {
      natsWrapper.client.close();
    });
    process.on('SIGTERM', () => {
      natsWrapper.client.close();
    });

    new UserCreatedListener(natsWrapper.client).listen();

    console.log('Connecting to ', process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
  } catch (err) {
    throw new Error(err);
    return;
  }
  app.listen(3000, () => {
    console.log('Listening on port 3000...');
  });
};

start();
