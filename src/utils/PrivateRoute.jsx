import { Outlet, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../services/firebaseConfig'; // Assuming this is correctly imported

export default function PrivateRoutes() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                console.log('User is signed in:', user);
                setLoggedIn(true);
            } else {
                console.log('No user is signed in.');
                setLoggedIn(false);
            }
            setIsLoading(false);
        }, (error) => {
            console.error('Auth state change error:', error);
            setIsLoading(false);
        });
        return () => unsubscribe();
    }, []);

    if (isLoading) {
        return;
    }

    console.log('loggedIn:', loggedIn);

    return (
        loggedIn ? <Outlet /> : <Navigate to="/login" />
    );
}
