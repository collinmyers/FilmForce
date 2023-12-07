// Import necessary React components and functions from 'react' and 'react-dom'
import React from 'react';
import ReactDOM from 'react-dom/client';

// Import components and functions from 'react-router-dom'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import individual page components
import LoginPage from './pages/Auth/Login';
import SignupPage from './pages/Auth/Signup';
import PasswordResetPage from './pages/Auth/PasswordReset';
import HomePage from './pages/Main/Home';
import MovieProfilePage from './pages/Main/Movie';
import Settings from './pages/Main/Settings';
import PrivateRoutes from './utils/PrivateRoute';
import SearchPage from './pages/Main/Search';
import UserReviews from './pages/Main/UserReviews';

// Define the main App component
export default function App() {
    return (
        // Use React.StrictMode for additional development features
        <React.StrictMode>
            {/* Initialize the React Router with BrowserRouter */}
            <Router>
                {/* Define the application's routes using the Routes component */}
                <Routes>
                    <Route path='/' element={<HomePage />} />
                    <Route path='/Login' element={<LoginPage />} />
                    <Route path='/Signup' element={<SignupPage />} />
                    <Route path='/PasswordReset' element={<PasswordResetPage />} />
                    <Route path='/Search' element={<SearchPage />} />

                    {/* Nested route for individual movie profiles */}
                    <Route path='/Movie/:id' element={<MovieProfilePage />} />

                    {/* Nested route for private routes (requires authentication) */}
                    <Route element={<PrivateRoutes />}>
                        {/* Sub-routes for authenticated users */}
                        <Route path='/Settings' element={<Settings />} />
                        <Route path=':id/UserReviews' element={<UserReviews />} />
                    </Route>

                    {/* Default route for unknown paths */}
                    <Route path="*" element={<p>There is nothing here: 404!</p>} />
                </Routes>
            </Router>
        </React.StrictMode>
    );
}

// Use ReactDOM.createRoot to render the App component into the root element
ReactDOM.createRoot(document.getElementById('root')).render(<App />);
