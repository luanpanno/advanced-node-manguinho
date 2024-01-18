import dotenv from 'dotenv';

dotenv.config();

export const env = {
  facebookApi: {
    clientId: process.env.FB_CLIENT_ID ?? '',
    clientSecret: process.env.FB_CLIENT_SECRET ?? '',
  },
  port: process.env.PORT ?? 8080,
};
