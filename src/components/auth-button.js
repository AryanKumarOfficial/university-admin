'use client';

import {useAuthStore} from '@/stores/auth-store';
import {GoogleAuthProvider, signInWithPopup, signOut} from 'firebase/auth';
import {auth} from '@/lib/firebase/client';
import Cookies from 'js-cookie';
import React from 'react';

export function AuthButton({className}) {
    const {user, loading, logOut} = useAuthStore();

    const handleLogin = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const idToken = await result.user.getIdToken();

            // Set authentication cookie
            Cookies.set('firebase-auth-token', idToken, {expires: 1});

            // Notify server
            await fetch('/api/session/login', {
                method: 'POST',
                body: JSON.stringify({idToken}),
                headers: {'Content-Type': 'application/json'},
            });
        } catch (error) {
            console.error('Login error:', error);
        }
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            Cookies.remove('firebase-auth-token');
            await fetch('/api/session/logout', {method: 'POST'});
            logOut();
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    if (loading) return <div className={className}>Loading...</div>;

    return user ? (
        <button onClick={handleLogout} className={className}>Sign out</button>
    ) : (
        <button onClick={handleLogin} className={className}>Sign in with Google</button>
    );
}
