require('dotenv').config();

const Discord = require('discord.js');

const admin = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.cert(
    {
      type: process.env.type,
      project_id: process.env.project_id,
      private_key_id: process.env.private_key_id,
      private_key: process.env.private_key,
      client_email: process.env.client_email,
      client_id: process.env.client_id,
      auth_uri: process.env.auth_uri,
      token_uri: process.env.token_uri,
      auth_provider_x509_cert_url: process.env.auth_provider_x509_cert_url,
      client_x509_cert_url: process.env.client_x509_cert_url
    }
  )
});

const plugins = require('./plugins');

const client = new Discord.Client();

client.on('ready', () => {
  console.log('Bip bop, I am ready!');
});

client.on('error', (error) => {
  console.warn(error);
});

client.setMaxListeners(0);

plugins.forEach((plugin) => plugin(client));

client.login(process.env.token);
