import '../../styles/hub.css'
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useState, useEffect } from 'react';
import { auth } from '../../../services/firebaseConfig';
import { useNavigate } from 'react-router-dom';


const Search = () => {
    return (
        <div>
          <header className="site-header sh-home">
            <h1>Welcome to Film<span id="home-force">Force</span></h1>
            <p>For the Love of Cinema</p>
          </header>
      
          <nav className="main-nav">
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/Search">Search</a></li>
              {loggedIn && <li><a href="/Settings">Settings</a></li>}
              {loggedIn ? (
                <li><a onClick={handleLogout} id='logout'>Logout</a></li>
              ) : (
                <li><a href="/Login">Login</a></li>
              )}
            </ul>
          </nav>
      
          <main className="content" id="search-section">
            <div className="search-bar">
              <input type="text" placeholder="Search for movies" />
              <button onClick={handleSearch}>Search</button>
            </div>
            
    
          </main>
        </div>
      );

};

export default Search