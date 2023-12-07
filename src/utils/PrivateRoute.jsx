// Import necessary components and functions from React Router and Firebase
import { Outlet, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../services/firebaseConfig';

// Define the PrivateRoutes component
export default function PrivateRoutes() {
    // State variables to manage the component's state
    const [loggedIn, setLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // useEffect to handle authentication state changes
    useEffect(() => {
        // Subscribe to authentication state changes
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                // User is signed in
                console.log('User is signed in:', user);
                setLoggedIn(true);
            } else {
                // No user is signed in
                console.log('No user is signed in.');
                setLoggedIn(false);
            }
            setIsLoading(false);
        }, (error) => {
            // Handle errors in authentication state change
            console.error('Auth state change error:', error);
            setIsLoading(false);
        });

        // Cleanup function to unsubscribe from the authentication state change listener
        return () => unsubscribe();
    }, []);

    // If the component is still loading, return nothing
    if (isLoading) {
        return null;
    }

    // Log the current authentication status
    console.log('loggedIn:', loggedIn);

    // Render the PrivateRoutes component
    return (
        // If logged in, render the nested routes (Outlet), otherwise navigate to the login page
        loggedIn ? <Outlet /> : <Navigate to="/login" />
    );
}
