// app/api/delete/route.js

import {admin, db} from '@/lib/firebase/admin';

export async function DELETE(req) {
    try {
        // Expecting the following JSON payload:
        // { uid }
        const {uid} = await req.json();

        if (!uid) {
            return Response.json({error: 'Missing required parameter: uid'}, {status: 400});
        }

        // Step 1: Delete the Firestore document(s) associated with the user.
        try {
            const querySnapshot = await db.collection('users').where('uid', '==', uid).get();
            if (!querySnapshot.empty) {
                const deletePromises = [];
                querySnapshot.forEach((doc) => {
                    deletePromises.push(doc.ref.delete());
                });
                await Promise.all(deletePromises);
            }
        } catch (firestoreError) {
            console.error('Error deleting Firestore document:', firestoreError);
            return Response.json({error: firestoreError.message}, {status: 500});
        }

        // Step 2: Delete the Firebase Authentication account.
        try {
            await admin.auth().deleteUser(uid);
        } catch (authError) {
            console.error('Error deleting auth user:', authError);
            return Response.json({error: authError.message}, {status: 400});
        }

        return Response.json({message: 'User deleted successfully', uid}, {status: 200});
    } catch (error) {
        console.error('General error in delete endpoint:', error);
        return Response.json({error: error.message}, {status: 500});
    }
}