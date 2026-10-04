import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE_URL = 'https://app-bookstore-backend-b3b8f4eabrfja0d3.southeastasia-01.azurewebsites.net';

function App() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/books`)
      .then(res => {
        setBooks(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching books:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif', maxWidth: '1000px', margin: '0 auto' }}>
      <h1>📚 Cloud Bookstore</h1>
      <p>Live inventory from Azure Cosmos DB Backend</p>

      {loading ? (
        <p>Loading books from cloud database...</p>
      ) : (
        <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', marginTop: '1.5rem' }}>
          {books.map(book => (
            <div key={book._id} style={{ border: '1px solid #ddd', padding: '1.25rem', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
              <h3 style={{ margin: '0 0 0.5rem 0' }}>{book.title}</h3>
              <p style={{ margin: '0.25rem 0', color: '#555' }}><strong>Author:</strong> {book.author}</p>
              <p style={{ margin: '0.25rem 0', color: '#777' }}><strong>Genre:</strong> {book.genre}</p>
              <p style={{ margin: '0.75rem 0 0 0', fontSize: '1.2rem', color: '#2b8a3e', fontWeight: 'bold' }}>
                ${book.price}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;