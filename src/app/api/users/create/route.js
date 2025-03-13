// app/api/create/route.js

import {admin, db} from '@/lib/firebase/admin';


export async function POST(req) {

    try {
        const {name, email, phone, password, role, createdBy, createdAt} = await req.json();
        if (!name || !email || !phone || !password || !role || !createdBy || !createdAt) {
            return Response.json({
                error: "Missing required parameters", data: {
                    name, email, phone, password, role, createdBy, createdAt
                }
            }, {status: 401});
        }

        // Step 1: Create the Firebase Authentication account
        let userRecord;
        try {
            userRecord = await admin.auth().createUser({
                email,
                password,
                displayName: name,
                phoneNumber: phone, // Ensure proper format, e.g., "+1234567890"
            });
        } catch (authError) {
            // Handle Firebase Auth errors (like duplicate email, invalid phone, etc.)
            console.error('Error creating auth account:', authError);
            return Response.json({error: authError}, {
                status: 400,
            });
        }

        // Step 2: Create a Firestore document in the "users" collection.
        // If Firestore fails, roll back the Auth account creation.
        try {
            await db.collection('users').add({
                name,
                email,
                phone,
                password,
                role,
                createdBy,
                createdAt,
                uid: userRecord.uid, // Link to the Auth user record
            });
        } catch (firestoreError) {
            console.error('Error creating Firestore document:', firestoreError);
            // Rollback: Delete the created auth user to keep consistency.
            try {
                await admin.auth().deleteUser(userRecord.uid);
            } catch (rollbackError) {
                console.error('Error during rollback (deleting auth user):', rollbackError);
            }
            return Response.json({error: firestoreError}, {
                status: 400,
            })
        }

        // Everything succeeded
        return Response.json({message: 'User created successfully', uid: userRecord.uid}, {
            status: 201,
        });
    } catch (error) {
        console.error('General error in createUser endpoint:', error);
        // If it's a validation error from Yup, return details.
        if (error.name === 'ValidationError') {
            return Response.json({errors: error.errors}, {
                status: 500,
            });
        }
        return Response.json({error: error.message}, {
            status: 500,
        });
    }
}
