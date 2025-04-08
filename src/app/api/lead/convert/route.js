import {NextResponse} from "next/server";
import {collection, doc, runTransaction, serverTimestamp} from "firebase/firestore"; // Import necessary Firestore functions
import {db} from "@/lib/firebase/client"; // Make sure db is correctly initialized Firestore instance

// API route to convert a lead to a client (expects JSON body)
export async function POST(req) {
    try {
        // 1. Parse JSON body from the request
        const body = await req.json();
        const {id: leadId} = body; // Extract leadId from the parsed JSON object

        // 2. Validate Input
        if (!leadId) {
            // Updated error message to reflect JSON expectation
            return NextResponse.json({message: "Lead ID is required in the JSON request body."}, {status: 400});
        }

        // 3. Define Firestore References (no changes needed here)
        const leadsCollectionRef = collection(db, "leads"); // Collection ref for leads
        const clientsCollectionRef = collection(db, "clients"); // Collection ref for clients
        const leadDocRef = doc(leadsCollectionRef, leadId); // Specific document ref for the lead

        // 4. Perform Atomic Operation using Firestore Transaction
        const newClientId = await runTransaction(db, async (transaction) => {
            // 4a. Get the lead document within the transaction
            const leadSnap = await transaction.get(leadDocRef);

            if (!leadSnap.exists()) {
                // Throw error to abort transaction if lead doesn't exist
                throw new Error("Lead document not found.");
            }

            const leadData = leadSnap.data();

            // 4b. Prepare data for the new client document (No TS types)
            const clientData = {
                ...leadData, // Spread existing lead data
                // Add client-specific fields
                originalLeadId: leadId,
                conversionDate: serverTimestamp(), // Use Firestore server timestamp
                // Add any other fields required for a client record
            };

            // 4c. Create a reference for the new client document (Firestore auto-generates ID)
            const newClientRef = doc(clientsCollectionRef);

            // 4d. Create the new client document within the transaction
            transaction.set(newClientRef, clientData);

            // 4e. Update the original lead document within the transaction
            transaction.update(leadDocRef, {
                response: "Converted", // Set status based on your defined values
                convertedToClientId: newClientRef.id, // Store the new client ID for reference
                conversionDate: serverTimestamp(), // Optionally store conversion date on lead too
                // Optionally clear follow-up info if desired
                // followUpDate: null,
                // followUpTime: null,
            });

            // Return the new client ID from the transaction function
            return newClientRef.id;
        });

        // 5. Transaction Successful - Return Success Response
        console.log(`Lead ${leadId} converted to Client ${newClientId}`);
        return NextResponse.json(
            {message: "Lead successfully converted to client.", clientId: newClientId},
            {status: 201} // 201 Created
        );

    } catch (error) {
        // 6. Handle Errors (from input parsing, validation, or transaction)
        console.error("Error converting lead to client:", error);

        // Check if the error is due to invalid JSON parsing
        if (error instanceof SyntaxError) {
            return NextResponse.json({message: "Invalid JSON format in request body."}, {status: 400}); // Bad Request
        }

        // Check for specific errors thrown from the transaction
        if (error.message === "Lead document not found.") {
            return NextResponse.json({message: error.message}, {status: 404}); // Not Found
        }

        // Generic server error for other issues
        return NextResponse.json(
            // Use error.message if available, otherwise provide a generic message
            {message: error.message || "An unexpected error occurred during conversion."},
            {status: 500}
        );
    }
}