import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();
  return (
    <div className="home-container">
      <h2>Inventory Management</h2>
      <p style={{ margin: '1rem 0', color: '#64748b' }}>
        Welcome! Click below to add new inventory items.
      </p>
      <button className="btn btn-primary" onClick={() => navigate('/addItem')}>
        Add New Item
      </button> <br/><br/>
      <button className="btn btn-primary" onClick={() => navigate('/displayItem')}>
        Display Item
      </button>
    </div>
  );
}

export default Home;

