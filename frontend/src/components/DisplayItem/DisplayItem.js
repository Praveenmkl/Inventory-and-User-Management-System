import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function DisplayItem() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Modal states
  const [selectedItem, setSelectedItem] = useState(null); // for view details modal
  const [editingItem, setEditingItem] = useState(null); // for edit item modal
  const [editFormData, setEditFormData] = useState({
    itemName: '',
    itemCategory: '',
    itemDetails: '',
    itemImage: null,
  });

  const fetchItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('http://localhost:8080/inventory');
      setItems(response.data || []);
    } catch (err) {
      console.error('Error fetching inventory items:', err);
      setError('Failed to fetch inventory items. Please check if backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await axios.delete(`http://localhost:8080/inventory/${id}`);
        setItems(items.filter((item) => item.id !== id));
      } catch (err) {
        console.error('Error deleting item:', err);
        alert('Failed to delete item.');
      }
    }
  };

  const handleEditClick = (item) => {
    setEditingItem(item);
    setEditFormData({
      itemName: item.itemName || '',
      itemCategory: item.itemCategory || '',
      itemDetails: item.itemDetails || '',
      itemImage: null,
    });
  };

  const handleEditInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'itemImage') {
      setEditFormData((prev) => ({ ...prev, itemImage: files[0] }));
    } else {
      setEditFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingItem) return;

    let imageName = editingItem.itemImage;
    if (editFormData.itemImage) {
      const formData = new FormData();
      formData.append('file', editFormData.itemImage);
      try {
        const uploadRes = await axios.post('http://localhost:8080/inventory/itemImg', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        imageName = uploadRes.data;
      } catch (err) {
        console.error('Error uploading image:', err);
        alert('Failed to upload new image');
        return;
      }
    }

    const updatedData = {
      itemName: editFormData.itemName,
      itemCategory: editFormData.itemCategory,
      itemDetails: editFormData.itemDetails,
      itemImage: imageName,
    };

    try {
      await axios.put(`http://localhost:8080/inventory/${editingItem.id}`, updatedData);
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.id === editingItem.id ? { ...item, ...updatedData } : item
        )
      );
      setEditingItem(null);
      alert('Item updated successfully!');
    } catch (err) {
      console.error('Error updating item:', err);
      alert('Failed to update item.');
    }
  };

  // Filtered items based on search and category
  const filteredItems = items.filter((item) => {
    const matchesSearch =
      (item.itemName && item.itemName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.itemDetails && item.itemDetails.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.id && item.id.toString().includes(searchTerm));

    const matchesCategory =
      categoryFilter === 'All' || item.itemCategory === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const getBadgeClass = (category) => {
    switch (category ? category.toLowerCase() : '') {
      case 'food':
        return 'badge-food';
      case 'beverage':
        return 'badge-beverage';
      case 'dessert':
        return 'badge-dessert';
      default:
        return 'badge-other';
    }
  };

  return (
    <div className="display-container">
      <div className="display-card">
        {/* Header section */}
        <div className="display-header">
          <div>
            <h2>Inventory Display</h2>
            <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.25rem' }}>
              View, search, and manage all items in the inventory system.
            </p>
          </div>
          <div className="header-actions">
            <button className="btn btn-secondary" onClick={() => navigate('/')}>
              Home
            </button>
            <button className="btn btn-primary" onClick={() => navigate('/addItem')}>
              + Add Item
            </button>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="filter-bar">
          <input
            type="text"
            className="search-input"
            placeholder="Search by ID, Name, or Details..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="category-select"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="All">All Categories</option>
            <option value="Food">Food</option>
            <option value="Beverage">Beverage</option>
            <option value="Dessert">Dessert</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Main Content / Loading / Error */}
        {loading ? (
          <div className="empty-state">
            <p>Loading inventory items...</p>
          </div>
        ) : error ? (
          <div className="empty-state" style={{ color: '#ef4444' }}>
            <p>{error}</p>
            <button
              className="btn btn-secondary"
              onClick={fetchItems}
              style={{ marginTop: '1rem' }}
            >
              Retry
            </button>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="empty-state">
            <p>No inventory items found.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="item-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Image</th>
                  <th>Item Name</th>
                  <th>Category</th>
                  <th>Details</th>
                  <th style={{ textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => (
                  <tr key={item.id}>
                    <td><strong>#{item.id}</strong></td>
                    <td>
                      {item.itemImage ? (
                        <img
                          src={`http://localhost:8080/upload/${item.itemImage}`}
                          alt={item.itemName}
                          className="item-thumbnail"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div
                        className="no-image"
                        style={{ display: item.itemImage ? 'none' : 'flex' }}
                      >
                        No Img
                      </div>
                    </td>
                    <td><strong>{item.itemName}</strong></td>
                    <td>
                      <span className={`badge ${getBadgeClass(item.itemCategory)}`}>
                        {item.itemCategory || 'Uncategorized'}
                      </span>
                    </td>
                    <td style={{ maxWidth: '250px' }}>
                      {item.itemDetails && item.itemDetails.length > 60
                        ? `${item.itemDetails.substring(0, 60)}...`
                        : item.itemDetails || '-'}
                    </td>
                    <td style={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
                      <button
                        className="btn btn-info btn-sm"
                        onClick={() => setSelectedItem(item)}
                      >
                        View
                      </button>
                      <button
                        className="btn btn-warning btn-sm"
                        onClick={() => handleEditClick(item)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(item.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* View Item Details Modal */}
      {selectedItem && (
        <div className="modal-overlay" onClick={() => setSelectedItem(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Item Details (#{selectedItem.id})</h3>
              <button className="close-btn" onClick={() => setSelectedItem(null)}>
                &times;
              </button>
            </div>
            <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
              {selectedItem.itemImage && (
                <img
                  src={`http://localhost:8080/upload/${selectedItem.itemImage}`}
                  alt={selectedItem.itemName}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '200px',
                    borderRadius: '8px',
                    objectFit: 'contain',
                    border: '1px solid #e2e8f0',
                  }}
                  onError={(e) => (e.target.style.display = 'none')}
                />
              )}
            </div>
            <div className="item-form">
              <div>
                <strong>Name: </strong> {selectedItem.itemName}
              </div>
              <div>
                <strong>Category: </strong>
                <span className={`badge ${getBadgeClass(selectedItem.itemCategory)}`}>
                  {selectedItem.itemCategory || 'N/A'}
                </span>
              </div>
              <div>
                <strong>Details: </strong>
                <p style={{ marginTop: '0.25rem', color: '#475569' }}>
                  {selectedItem.itemDetails || 'No details provided.'}
                </p>
              </div>
            </div>
            <div className="form-actions" style={{ marginTop: '1.5rem' }}>
              <button className="btn btn-secondary" onClick={() => setSelectedItem(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Item Modal */}
      {editingItem && (
        <div className="modal-overlay" onClick={() => setEditingItem(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Edit Item (#{editingItem.id})</h3>
              <button className="close-btn" onClick={() => setEditingItem(null)}>
                &times;
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="item-form">
              <div className="form-group">
                <label htmlFor="editItemName">Item Name:</label>
                <input
                  type="text"
                  id="editItemName"
                  name="itemName"
                  value={editFormData.itemName}
                  onChange={handleEditInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="editItemCategory">Item Category:</label>
                <select
                  id="editItemCategory"
                  name="itemCategory"
                  value={editFormData.itemCategory}
                  onChange={handleEditInputChange}
                  required
                >
                  <option value="">Select Category</option>
                  <option value="Food">Food</option>
                  <option value="Beverage">Beverage</option>
                  <option value="Dessert">Dessert</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="editItemDetails">Item Details:</label>
                <textarea
                  id="editItemDetails"
                  name="itemDetails"
                  value={editFormData.itemDetails}
                  onChange={handleEditInputChange}
                  rows={3}
                ></textarea>
              </div>

              <div className="form-group">
                <label htmlFor="editItemImage">Change Image (Optional):</label>
                <input
                  type="file"
                  id="editItemImage"
                  name="itemImage"
                  accept="image/*"
                  onChange={handleEditInputChange}
                />
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setEditingItem(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default DisplayItem;