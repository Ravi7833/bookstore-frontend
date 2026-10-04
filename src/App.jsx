import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE_URL = 'https://app-bookstore-backend-b3b8f4eabrfja0d3.southeastasia-01.azurewebsites.net';

axios.defaults.withCredentials = true;

function App() {
  const [books, setBooks] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);
  const [showCart, setShowCart] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [zipCode, setZipCode] = useState('');

  useEffect(() => {
    // Fetch books
    axios.get(`${API_BASE_URL}/api/books`)
      .then(res => {
        setBooks(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    // Fetch auth status
    axios.get(`${API_BASE_URL}/api/me`)
      .then(res => {
        if (res.data && res.data.user) {
          setUser(res.data.user);
        }
      })
      .catch(() => {});
  }, []);

  const handleGoogleLogin = () => {
    window.location.href = `${API_BASE_URL}/auth/google`;
  };

  const handleAddToCart = (bookId) => {
    axios.post(`${API_BASE_URL}/api/cart`, { bookId, quantity: 1 })
      .then(res => {
        alert('Book added to cart successfully!');
        setCartCount(prev => prev + 1);
      })
      .catch(err => {
        if (err.response && err.response.status === 401) {
          alert('Please login with Google first to add items to cart.');
        } else {
          alert('Error adding item to cart.');
        }
      });
  };

  const handleCheckout = (e) => {
    e.preventDefault();
    if (!street || !city || !zipCode) {
      alert('Please fill out all address fields.');
      return;
    }

    axios.post(`${API_BASE_URL}/api/checkout`, {
      billingAddress: { street, city, zipCode }
    })
      .then(res => {
        alert(`Checkout successful! Order ID: ${res.data.orderId}\nInvoice sent to ${user.email}`);
        setShowCart(false);
        setCartCount(0);
      })
      .catch(err => {
        alert(err.response?.data?.message || 'Checkout failed.');
      });
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif', maxWidth: '1000px', margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>
        <div>
          <h1 style={{ margin: 0 }}>📚 Cloud Bookstore</h1>
          <p style={{ margin: '0.25rem 0 0 0', color: '#666' }}>Live inventory from Azure Cosmos DB Backend</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {user ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {user.picture && <img src={user.picture} alt={user.name} style={{ width: '36px', height: '36px', borderRadius: '50%' }} />}
                <span style={{ fontWeight: '600' }}>{user.name}</span>
              </div>
              <button 
                onClick={() => setShowCart(!showCart)}
                style={{ backgroundColor: '#28a745', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                🛒 Cart ({cartCount})
              </button>
            </>
          ) : (
            <button
              onClick={handleGoogleLogin}
              style={{ backgroundColor: '#4285F4', color: '#fff', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              Login with Google
            </button>
          )}
        </div>
      </header>

      {/* Cart Modal */}
      {showCart && (
        <div style={{ border: '2px solid #28a745', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem', backgroundColor: '#f9fff9' }}>
          <h3>🛒 Checkout & Billing Address</h3>
          <form onSubmit={handleCheckout} style={{ display: 'grid', gap: '0.75rem', maxWidth: '400px' }}>
            <input type="text" placeholder="Street Address" value={street} onChange={e => setStreet(e.target.value)} required style={{ padding: '0.5rem' }} />
            <input type="text" placeholder="City" value={city} onChange={e => setCity(e.target.value)} required style={{ padding: '0.5rem' }} />
            <input type="text" placeholder="Zip Code" value={zipCode} onChange={e => setZipCode(e.target.value)} required style={{ padding: '0.5rem' }} />
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
              <button type="submit" style={{ backgroundColor: '#0078d4', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                Complete Order & Dispatch Email
              </button>
              <button type="button" onClick={() => setShowCart(false)} style={{ backgroundColor: '#666', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}>
                Close
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Book Grid */}
      {loading ? (
        <p>Loading books from database...</p>
      ) : (
        <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))' }}>
          {books.map(book => (
            <div key={book._id} style={{ border: '1px solid #ddd', padding: '1.25rem', borderRadius: '8px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ margin: '0 0 0.5rem 0' }}>{book.title}</h3>
                <p style={{ margin: '0.25rem 0', color: '#555' }}><strong>Author:</strong> {book.author}</p>
                <p style={{ margin: '0.25rem 0', color: '#777' }}><strong>Genre:</strong> {book.genre}</p>
                <p style={{ margin: '0.75rem 0 0 0', fontSize: '1.2rem', color: '#2b8a3e', fontWeight: 'bold' }}>${book.price}</p>
              </div>
              <button
                onClick={() => handleAddToCart(book._id)}
                style={{ marginTop: '1rem', backgroundColor: '#0078d4', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', fontWeight: '600', cursor: 'pointer' }}
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