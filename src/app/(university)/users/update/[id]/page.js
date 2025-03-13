// app/(university)/users/update/[id]/page.js

import UpdateClient from "@/app/(university)/users/update/[id]/UpdateClient";

export default async function UpdateClientPage({params}) {
    const {id: docId} = await params; // Destructure the id from params
    let oldData = null;

    if (docId) {
        try {
            // Use "no-store" to always fetch fresh data
            const res = await fetch(`http:localhost:3000/api/users/getById/${docId}`, {cache: "no-store"});
            if (res.ok) {
                const data = await res.json();
                oldData = data.user;
            } else {
                console.error(`Error: Could not find user with id ${docId}. Status: ${res.status}`);
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    }

    return <UpdateClient user={oldData}/>;
}
