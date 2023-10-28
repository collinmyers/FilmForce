import { Outlet, Navigate } from 'react-router-dom'
import { onAuthStateChanged } from 'firebase/auth';
import { useState, useEffect } from 'react';
import { auth } from '../../services/';

export default function PrivateRoutes() {

    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setLoggedIn(true);
            }
        });
    }, []);

    return (
        loggedIn ? <Outlet /> : <Navigate to="/login" />
    )
}