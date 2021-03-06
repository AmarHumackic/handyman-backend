const admin = require('firebase-admin');
const serviceAccount = require('./firebase-service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const firebaseAdmin = {};
firebaseAdmin.sendMulticastNotification = (payload) => {
  const message = {
    notification: {
      title: payload.title,
      body: payload.body,
    },
    tokens: payload.tokens,
    data: payload.data || {},
  };

  return admin.messaging().sendMulticast(message);
};

module.exports = firebaseAdmin;
