import React from "react";
import {doc, getDoc} from "firebase/firestore";
import {db} from "@/lib/firebase/client";
import UpdateTraineeLeadClient from "@/components/sections/training/trainee/UpdateTraineeClient";

export default async function UpdateTraineeLeadPage({params}) {
    const {id} = params;
    let traineeData = null;

    try {
        const docRef = doc(db, "trainee", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            traineeData = {id: docSnap.id, ...docSnap.data()};
        } else {
            // You may want to handle the case where the document does not exist
            throw new Error("Trainee not found");
        }
    } catch (error) {
        console.error("Error fetching trainee data:", error);
        // Optionally render an error message or redirect
    }

    return <UpdateTraineeLeadClient initialData={traineeData}/>;
}
