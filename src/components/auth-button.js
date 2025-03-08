// components/auth-button.tsx
'use client';

import {useAuthStore} from '@/stores/auth-store';
import {GoogleAuthProvider, signInWithPopup, signOut} from 'firebase/auth';
import {auth} from '@/lib/firebase/client';

export function AuthButton() {
    const {user, loading} = useAuthStore();

    const handleLogin = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const idToken = await result.user.getIdToken();

            // Set server session
            await fetch('/api/session/login', {
                method: 'POST',
                body: JSON.stringify({idToken}),
                headers: {'Content-Type': 'application/json'},
            });
        } catch (error) {
            console.error('Page error:', error);
        }
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            await fetch('/api/session/logout', {method: 'POST'});
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    if (loading) return <div>Loading...</div>;

    return user ? (
        <button onClick={handleLogout}>Sign out</button>
    ) : (
        <button onClick={handleLogin}>Sign in with Google</button>
    );
}