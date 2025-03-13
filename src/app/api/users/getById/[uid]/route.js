// app/api/users/[uid]/route.js

import {db} from "@/lib/firebase/admin";

export async function GET(request, {params}) {

    try {
        const {uid} = await params; // Extract the UID from the route parameters
        if (!uid) return Response.json({error: "Missing required parameter: uid"}, {status: 401})
        // Query the "users" collection for a document with the given uid.
        const querySnapshot = await db.collection("users").where("uid", "==", uid).get();

        if (querySnapshot.empty) {
            return Response.json({error: "User not found"}, {status: 404});
        }

        // Since uid is unique, we expect a single document.
        let userDoc = null;
        querySnapshot.forEach((doc) => {
            userDoc = {id: doc.id, ...doc.data()};
        });

        return Response.json({user: userDoc}, {status: 200});
    } catch (error) {
        console.error("Error fetching user by uid:", error);
        return Response.json({error: error.message}, {status: 500});
    }
}
