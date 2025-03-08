// components/AuthProvider.tsx
'use client';

import {useEffect} from 'react';
import {useAuthStore} from '@/stores/auth-store';

export default function AuthProvider({children}) {
    const initialize = useAuthStore((state) => state.initialize);

    useEffect(() => {
        const unsubscribe = initialize();
        return () => unsubscribe();
    }, [initialize]);

    return <>{children}</>;
}