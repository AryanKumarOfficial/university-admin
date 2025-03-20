// src/stores/auth-store.js
import {create} from 'zustand';
import {devtools, persist, subscribeWithSelector} from 'zustand/middleware';
import {immer} from 'zustand/middleware/immer';
import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
    updateProfile
} from 'firebase/auth';
import {auth, db} from '@/lib/firebase/client'; // make sure db is exported from your firebase client config
import {collection, getDocs, query, where} from 'firebase/firestore';
import Cookies from 'js-cookie';

// Initial state for easy resetting; now includes `role`
const initialState = {
    user: null,
    role: null,
    loading: true,
    error: null,
    hydrated: false,
};

// A set of state listener callbacks that get invoked on every state change.
const stateListeners = new Set();

/**
 * Notifies all registered listeners of the current state.
 */
const notifyListeners = (state) => {
    stateListeners.forEach((listener) => listener(state));
};

/**
 * Create a highly extensible and robust auth store.
 */

export const useAuthStore = create(
    devtools(
        subscribeWithSelector(
            persist(
                immer((set, get) => ({
                    ...initialState,

                    // Fetches the user's role from Firestore based on uid.
                    fetchUserRole: async (uid) => {
                        try {
                            // Query the "users" collection where the field "uid" equals the provided uid.
                            const q = query(collection(db, 'users'), where('uid', '==', uid));
                            const querySnapshot = await getDocs(q);
                            if (!querySnapshot.empty) {
                                // Assuming there's only one document per user uid
                                const docData = querySnapshot.docs[0].data();
                                set((state) => {
                                    state.role = docData.role;
                                });
                            } else {
                                console.error('No user document found for uid:', uid);
                                set((state) => {
                                    state.role = null;
                                });
                            }
                        } catch (error) {
                            console.error('Error fetching user role:', error);
                        }
                    },

                    // Initializes the auth state by subscribing to Firebase auth changes.
                    // Returns a function to unsubscribe from the listener.
                    initialize: () => {
                        set((state) => {
                            state.loading = true;
                        });
                        const unsubscribe = onAuthStateChanged(
                            auth,
                            async (user) => {
                                set((state) => {
                                    state.user = user;
                                    state.loading = false;
                                    state.error = null;
                                });
                                if (user) {
                                    // Retrieve the user's role from Firestore using uid.
                                    await get().fetchUserRole(user.uid);
                                } else {
                                    set((state) => {
                                        state.role = null;
                                    });
                                }
                                notifyListeners(get());
                            },
                            (error) => {
                                const errorMessage =
                                    error instanceof Error ? error.message : 'Unknown error';
                                set((state) => {
                                    state.loading = false;
                                    state.error = errorMessage;
                                });
                                notifyListeners(get());
                            }
                        );
                        return unsubscribe;
                    },

                    // Registers a new user and updates the auth state.
                    signUp: async (name, email, password) => {
                        set((state) => {
                            state.loading = true;
                            state.error = null;
                        });
                        try {
                            const userCredential = await createUserWithEmailAndPassword(
                                auth,
                                email,
                                password
                            );
                            // Update the user's display name.
                            await updateProfile(userCredential.user, {displayName: name});
                            const token = await userCredential.user.getIdToken();
                            Cookies.set('firebase-auth-token', token, {expires: 1});
                            set((state) => {
                                state.user = userCredential.user;
                                state.loading = false;
                            });
                            // Fetch and update the role for the newly registered user.
                            await get().fetchUserRole(userCredential.user.uid);
                            notifyListeners(get());
                        } catch (error) {
                            const errorMessage =
                                error instanceof Error ? error.message : 'Sign up failed';
                            set((state) => {
                                state.error = errorMessage;
                                state.loading = false;
                            });
                            notifyListeners(get());
                            console.error('SignUp Error:', error);
                            throw error;
                        }
                    },

                    // Logs in an existing user and updates the auth state.
                    signIn: async (email, password) => {
                        set((state) => {
                            state.loading = true;
                            state.error = null;
                        });
                        try {
                            const userCredential = await signInWithEmailAndPassword(
                                auth,
                                email,
                                password
                            );
                            const token = await userCredential.user.getIdToken();
                            Cookies.set('firebase-auth-token', token, {expires: 1});
                            set((state) => {
                                state.user = userCredential.user;
                                state.loading = false;
                            });
                            // Fetch and update the user role upon sign in.
                            await get().fetchUserRole(userCredential.user.uid);
                            notifyListeners(get());
                        } catch (error) {
                            const errorMessage =
                                error instanceof Error ? error.message : 'Sign in failed';
                            set((state) => {
                                state.error = errorMessage;
                                state.loading = false;
                            });
                            notifyListeners(get());
                            console.error('SignIn Error:', error);
                            throw error;
                        }
                    },

                    // Logs out the current user, clears caches, and resets state.
                    logOut: async () => {
                        set((state) => {
                            state.loading = true;
                        });
                        try {
                            await signOut(auth);
                            Cookies.remove('firebase-auth-token');
                            // Clear persisted storage to avoid stale data rehydration.
                            if (typeof window !== 'undefined') {
                                window.localStorage.removeItem('auth-store');
                                console.log('Local storage cleared for auth-store.');
                            }
                            set((state) => {
                                state.user = null;
                                state.role = null;
                                state.loading = false;
                                state.error = null;
                            });
                            notifyListeners(get());
                        } catch (error) {
                            const errorMessage =
                                error instanceof Error ? error.message : 'Logout failed';
                            set((state) => {
                                state.error = errorMessage;
                                state.loading = false;
                            });
                            notifyListeners(get());
                            console.error('LogOut Error:', error);
                            throw error;
                        }
                    },

                    // Forces a refresh of the Firebase token.
                    refreshToken: async () => {
                        if (get().user) {
                            try {
                                const token = await get().user.getIdToken(true);
                                Cookies.set('firebase-auth-token', token, {expires: 1});
                                console.log('Token refreshed successfully.');
                            } catch (error) {
                                console.error('Token refresh error:', error);
                            }
                        }
                    },

                    // Completely resets the store to its initial state.
                    reset: () => {
                        set({...initialState}, true); // Replace state entirely.
                        notifyListeners(get());
                        console.log('Auth store state reset.');
                    },

                    // Registers a state listener callback to be invoked on every state change.
                    addStateListener: (listener) => {
                        stateListeners.add(listener);
                    },
                })),
                {
                    name: 'auth-store', // Unique key for persistence.
                    // Persist only the user property to avoid caching transient data.
                    partialize: (state) => ({user: state.user}),
                    // Callback after rehydration from persistent storage.
                    onRehydrateStorage: () => (state) => {
                        if (state) {
                            state.hydrated = true;
                            notifyListeners(state);
                            console.log('Rehydration complete');
                        }
                    },
                }
            )
        ),
        {
            enabled: process.env.NODE_ENV !== 'production',
        }
    )
);
