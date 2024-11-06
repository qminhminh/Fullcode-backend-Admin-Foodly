const admin = require('firebase-admin')
require('dotenv').config();

const serviceAccount = {
    type: process.env.FIREBASE_TYPE,
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'), // Chuyển ký tự `\n` thành dòng mới
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: process.env.FIREBASE_AUTH_URI,
    token_uri: process.env.FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_CERT_URL,
    client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL,
};
const fireBaseConnection = async () => {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://foodly-flutter-dc94b-default-rtdb.firebaseio.com"
      });
      console.log("Connected to Firebase");
      
}

async function sendPushNotification(deviceToken, messageBody) {
    const message = {
        notification: {
            title: 'Your Notification Title',
            body: messageBody
        },
        token: deviceToken
    };

    try {
        const response = await admin.messaging().send(message);
        console.log('Successfully sent message:', response);
    } catch (error) {
        console.error('Error sending message:', error);
    }
}


module.exports = {fireBaseConnection, sendPushNotification};