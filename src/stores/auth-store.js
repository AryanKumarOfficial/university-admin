// stores/auth-store.ts
import {create} from 'zustand';
import {createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile} from 'firebase/auth';
import {auth} from '@/lib/firebase/client';
import Cookies from 'js-cookie';

export const useAuthStore = create((set) => ({
    user: null,
    loading: true,
    error: null,

    initialize: () => {
        const unsubscribe = auth.onAuthStateChanged(
            (user) => {
                set({user, loading: false, error: null});
            },
            (error) => {
                set({loading: false, error: error.message});
            }
        );
        return unsubscribe;
    },

    signUp: async (name, email, password) => {
        set({loading: true, error: null});
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            // Update the user's display name
            await updateProfile(userCredential.user, {displayName: name});

            const token = await userCredential.user.getIdToken();
            Cookies.set('firebase-auth-token', token, {expires: 1}); // 1 day expiry
            set({user: userCredential.user, loading: false});
        } catch (error) {
            set({error: error.message, loading: false});
            throw error;
        }
    },

    signIn: async (email, password) => {
        set({loading: true, error: null});
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const token = await userCredential.user.getIdToken();
            Cookies.set('firebase-auth-token', token, {expires: 1});
            set({user: userCredential.user, loading: false});
        } catch (error) {
            set({error: error.message, loading: false});
            throw error;
        }
    },

    logOut: async () => {
        set({loading: true});
        try {
            await signOut(auth);
            Cookies.remove('firebase-auth-token');
            set({user: null, loading: false});
        } catch (error) {
            set({error: error.message, loading: false});
            throw error;
        }
    }
}));
