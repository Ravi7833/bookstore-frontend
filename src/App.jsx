import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE_URL = 'https://app-bookstore-backend-b3b8f4eabrfja0d3.southeastasia-01.azurewebsites.net';

// Enable cookies across cross-origin requests for session persistence
axios.defaults.withCredentials = true;

function App() {
  const [books, setBooks] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch books inventory
    axios.get(`${API_BASE_URL}/api/books`)
      .then(res => {
        setBooks(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching books:', err);
        setLoading(false);
      });

    // Check if user is logged in via OAuth callback or active session
    axios.get(`${API_BASE_URL}/auth/google/callback`)
      .then(res => {
        if (res.data && res.data.user) {
          setUser(res.data.user);
        }
      })
      .catch(() => {
        // User not logged in, remain in guest mode
      });
  }, []);

  const handleGoogleLogin = () => {
    window.location.href = `${API_BASE_URL}/auth/google`;
  };

  const handleAddToCart = (bookId) => {
    axios.post(`${API_BASE_URL}/api/cart`, { bookId, quantity: 1 })
      .then(res => {
        alert('Book added to cart successfully!');
      })
      .catch(err => {
        if (err.response && err.response.status === 401) {
          alert('Please login with Google first to add items to your cart.');
        } else {
          alert('Failed to update cart. Please try again.');
        }
      });
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif', maxWidth: '1000px', margin: '0 auto' }}>
      
      {/* Header Section */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>
        <div>
          <h1 style={{ margin: 0 }}>📚 Cloud Bookstore</h1>
          <p style={{ margin: '0.25rem 0 0 0', color: '#666' }}>Live inventory from Azure Cosmos DB Backend</p>
        </div>

        <div>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              {user.picture && (
                <img 
                  src={user.picture} 
                  alt={user.name} 
                  style={{ width: '36px', height: '36px', borderRadius: '50%' }} 
                />
              )}
              <span style={{ fontWeight: '500' }}>{user.name}</span>
            </div>
          ) : (
            <button
              onClick={handleGoogleLogin}
              style={{
                backgroundColor: '#4285F4',
                color: '#fff',
                border: 'none',
                padding: '0.6rem 1.2rem',
                borderRadius: '6px',
                fontSize: '0.95rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              Login with Google
            </button>
          )}
        </div>
      </header>

      {/* Main Content / Inventory */}
      {loading ? (
        <p>Loading books from cloud database...</p>
      ) : (
        <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))' }}>
          {books.map(book => (
            <div key={book._id} style={{ border: '1px solid #ddd', padding: '1.25rem', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ margin: '0 0 0.5rem 0' }}>{book.title}</h3>
                <p style={{ margin: '0.25rem 0', color: '#555' }}><strong>Author:</strong> {book.author}</p>
                <p style={{ margin: '0.25rem 0', color: '#777' }}><strong>Genre:</strong> {book.genre}</p>
                <p style={{ margin: '0.75rem 0 0 0', fontSize: '1.2rem', color: '#2b8a3e', fontWeight: 'bold' }}>
                  ${book.price}
                </p>
              </div>

              <button
                onClick={() => handleAddToCart(book._id)}
                style={{
                  marginTop: '1rem',
                  backgroundColor: '#0078d4',
                  color: '#fff',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '4px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;