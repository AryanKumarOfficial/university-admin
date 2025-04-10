// lib/firebaseAdmin.js

import admin from 'firebase-admin';
import serviceAccount from "./service_account.json"

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://console.firebase.google.com/u/1/project/sales-tracker-iqnaut/database/sales-tracker-iqnaut-default-rtdb/data/~2F"
    });
}

const db = admin.firestore();
export {admin, db};
