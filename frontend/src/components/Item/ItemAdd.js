import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function ItemAdd() {
  const navigate = useNavigate();
  const [Inventory, setInventory] = useState({
    itemId: '',
    itemName: '',
    itemCategory: '',
    itemDetails: '',
    itemImage: null,
  });

  const { itemId, itemName, itemCategory, itemDetails, itemImage } = Inventory;

  const onInputChange = (e) => {
    const { name, value, type, files } = e.target;
    if (name === 'itemImage') {
      setInventory((prev) => ({
        ...prev,
        [name]: files[0],
      }));
    } else {
      setInventory((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    let imageName = '';
    if (itemImage) {
      const formData = new FormData();
      formData.append('file', itemImage);
      try {
        const response = await axios.post(
          'http://localhost:8080/inventory/itemImg',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );
        imageName = response.data;
      } catch (error) {
        console.error('Error uploading image:', error);
        alert('Image upload failed');
        return;
      }
    }

    const updatedInventory = {
      itemName,
      itemCategory,
      itemDetails,
      itemImage: imageName,
    };

    try {
      await axios.post('http://localhost:8080/inventory', updatedInventory);
      alert('Item added successfully');
      navigate('/');
    } catch (error) {
      console.error('Error adding item:', error);
      alert('Failed to add item');
    }
  };


  return (
    <div className="form-container">
      <div className="form-card">
        <div className="form-header">
          <h2>Add New Item</h2>
          <p>Fill in the details below to add an item to the inventory system.</p>
        </div>

        <form onSubmit={onSubmit} className="item-form">
          {/* Item ID */}
          <div className="form-group">
            <label htmlFor="itemId">Item ID:</label>
            <input
              type="text"
              id="itemId"
              name="itemId"
              value={itemId}
              onChange={onInputChange}
              placeholder="Enter item ID"
              required
            />
          </div>

          {/* Item Name */}
          <div className="form-group">
            <label htmlFor="itemName">Item Name:</label>
            <input
              type="text"
              id="itemName"
              name="itemName"
              value={itemName}
              onChange={onInputChange}
              placeholder="Enter item name"
              required
            />
          </div>

          {/* Item Category */}
          <div className="form-group">
            <label htmlFor="itemCategory">Item Category:</label>
            <select
              id="itemCategory"
              name="itemCategory"
              value={itemCategory}
              onChange={onInputChange}
              required
            >
              <option value="">Select Category</option>
              <option value="Food">Food</option>
              <option value="Beverage">Beverage</option>
              <option value="Dessert">Dessert</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Item Details */}
          <div className="form-group">
            <label htmlFor="itemDetails">Item Details:</label>
            <textarea
              id="itemDetails"
              name="itemDetails"
              value={itemDetails}
              onChange={onInputChange}
              placeholder="Enter item details"
              rows={4}
            ></textarea>
          </div>

          {/* Item Image (File Upload) */}
          <div className="form-group">
            <label htmlFor="itemImage">Item Image:</label>
            <input
              type="file"
              id="itemImage"
              name="itemImage"
              accept="image/*"
              onChange={onInputChange}
            />
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/')}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Add Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ItemAdd;




