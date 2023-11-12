import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/Auth/Login';
import SignupPage from './pages/Auth/Signup';
import PasswordResetPage from './pages/Auth/PasswordReset';
import HomePage from './pages/Main/Home';
import MovieProfilePage from './pages/Main/Movie';
import Settings from './pages/Main/Settings';
import PrivateRoutes from './utils/PrivateRoute';
import SearchPage from './pages/Main/Search';

export default function App() {
    return (
        <React.StrictMode>
            <Router>
                <Routes>
                    <Route path='/' element={<HomePage />} />
                    <Route path='/Login' element={<LoginPage />} />
                    <Route path='/Signup' element={<SignupPage />} />
                    <Route path='/PasswordReset' element={<PasswordResetPage />} />
                    <Route path='/Search' element={<SearchPage />} />

                    <Route path='/Movie/:id' element={<MovieProfilePage />} />

                    <Route element={<PrivateRoutes />}>
                        <Route path='/Settings' element={<Settings />} />
                    </Route>

                    <Route path="*" element={<p>There is nothing here: 404!</p>} />
                </Routes>
            </Router>
        </React.StrictMode>
    );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
