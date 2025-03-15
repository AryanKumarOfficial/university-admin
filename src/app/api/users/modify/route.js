// app/api/modify/route.js

import {admin, db} from '@/lib/firebase/admin';

export async function PUT(req) {
    try {
        // Expecting the following JSON payload:
        // { uid, name?, email?, phone?, password?, role? }
        const {uid, name, email, phone, password, role, createdBy} = await req.json();

        if (!uid) {
            console.log("uid required")
            return Response.json(
                {error: 'Missing required parameter: uid'},
                {status: 400}
            );
        }

        // Prepare update data for Firebase Authentication.
        const authUpdateData = {};
        if (name) authUpdateData.displayName = name;
        if (email) authUpdateData.email = email;
        if (phone) authUpdateData.phoneNumber = phone;
        if (password) authUpdateData.password = password;

        let updatedUserRecord;
        if (Object.keys(authUpdateData).length !== 0) {
            // Step 1: Update the Firebase Authentication account.
            try {
                updatedUserRecord = await admin.auth().updateUser(uid, authUpdateData);
                console.log("updatedUserRecord", updatedUserRecord);
            } catch (authError) {
                console.error('Error updating auth account:', authError);
                return Response.json({error: authError.message}, {status: 400});
            }
        }

        // Step 2: Update the corresponding Firestore document.
        try {
            // Assuming the Firestore document stores the uid.
            const querySnapshot = await db.collection('users').where('uid', '==', uid).get();
            if (querySnapshot.empty) {
                return Response.json({error: 'User document not found'}, {status: 404});
            }

            // Prepare Firestore update data.
            const updateData = {};
            if (name) updateData.name = name;
            if (email) updateData.email = email;
            if (phone) updateData.phone = phone;
            if (role) updateData.role = role;
            if (createdBy) updateData.createdBy = createdBy;

            const updatePromises = [];
            querySnapshot.forEach((doc) => {
                updatePromises.push(doc.ref.update(updateData));
            });
            await Promise.all(updatePromises);
        } catch (firestoreError) {
            console.error('Error updating Firestore document:', firestoreError);
            return Response.json({error: firestoreError.message}, {status: 500});
        }

        return Response.json(
            {message: 'User updated successfully', uid: updatedUserRecord ? updatedUserRecord.uid : uid},
            {status: 200}
        );
    } catch (error) {
        console.error('General error in update endpoint:', error);
        return Response.json({error: error.message}, {status: 500});
    }
}
