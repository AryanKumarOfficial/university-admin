// app/api/create/route.js

import {admin, db} from '@/lib/firebase/admin';
import {jwtVerify} from 'jose';
import {cookies} from 'next/headers';

// Helper function to verify authentication
async function verifyAuth(req) {
    // Bypass authentication in non-production environments
    console.log("Current environment:", process.env.NODE_ENV);

    if (process.env.NODE_ENV !== 'production') {
        return {
            authenticated: true,
            user: {role: 'Admin'} // Mock admin user for development
        };
    }

    const cookieStore = await cookies();
    const token = cookieStore.get("firebase-auth-token")?.value ?? null;

    if (!token) {
        return {
            authenticated: false,
            error: 'Authentication required'
        };
    }

    try {
        const secretKey = new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET);
        const {payload: decoded} = await jwtVerify(token, secretKey, {
            algorithms: ['HS256'],
        });

        if (!decoded || !decoded.payload || decoded.payload.role !== 'Admin') {
            return {
                authenticated: false,
                error: 'Insufficient permissions - Admin role required'
            };
        }

        return {
            authenticated: true,
            user: decoded.payload
        };
    } catch (error) {
        console.error('JWT verification error:', error);
        return {
            authenticated: false,
            error: 'Invalid authentication token'
        };
    }
}

export async function POST(req) {
    // Verify authentication before proceeding
    const authResult = await verifyAuth(req);

    if (!authResult.authenticated) {
        return Response.json({error: authResult.error}, {status: 401});
    }

    try {

        const {name, email, phone, password, role, createdBy, createdAt} = await req.json();
        if (!name || !email || !phone || !password || !role || !createdBy || !createdAt) {
            const missingFields = [];
            if (!name) missingFields.push('name');
            if (!email) missingFields.push('email');
            if (!phone) missingFields.push('phone');
            if (!password) missingFields.push('password');
            if (!role) missingFields.push('role');
            if (!createdBy) missingFields.push('createdBy');
            if (!createdAt) missingFields.push('createdAt');
            
            return Response.json({
                error: `Missing required parameters: ${missingFields.join(', ')}`,
                code: 'missing_fields',
                missingFields
            }, {status: 400}); // Using 400 instead of 401 for validation errors
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
            let errorMessage = 'Failed to create user account';
            
            // Extract specific error messages from Firebase Auth errors
            if (authError.code === 'auth/email-already-exists') {
                errorMessage = 'Email is already in use. Please use a different email.';
            } else if (authError.code === 'auth/invalid-phone-number') {
                errorMessage = 'Invalid phone number format. Please use country code + 10 digits (e.g., +911234567890).';
            } else if (authError.code === 'auth/weak-password') {
                errorMessage = 'Password is too weak. Please use a stronger password.';
            } else if (authError.message) {
                errorMessage = authError.message;
            }
            
            return Response.json({error: errorMessage, code: authError.code || 'unknown_error'}, {
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
            
            let errorMessage = 'Failed to create user database record';
            if (firestoreError.message) {
                errorMessage = firestoreError.message;
            }
            
            return Response.json({
                error: errorMessage,
                code: firestoreError.code || 'database_error'
            }, {
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
            return Response.json({
                error: 'Validation failed',
                validationErrors: error.errors,
                details: error.errors
            }, {
                status: 400, // Using 400 instead of 500 for validation errors
            });
        }
        
        // Handle other types of errors
        return Response.json({
            error: error.message || 'An unexpected error occurred',
            code: error.code || 'unknown_error'
        }, {
            status: 500,
        });
    }
}

export async function GET() {
    try {
        const users = [];
        const snapshot = await db.collection('users').get();
        snapshot.forEach((doc) => {
            users.push({
                id: doc.id,
                ...doc.data(),
            });
        });
        return Response.json({users}, {status: 200});
    } catch (error) {
        console.error('Error getting users:', error);
        return Response.json({error: error.message}, {status: 500});
    }
}