import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const emptyForm = { itemName: '', description: '', type: 'Lost', location: '', date: '', contactInfo: '' };

export default function Dashboard() {
  const navigate  = useNavigate();
  const token     = localStorage.getItem('token');
  const user      = JSON.parse(localStorage.getItem('user') || '{}');
  const headers   = { Authorization: `Bearer ${token}` };

  const [items,    setItems]    = useState([]);
  const [search,   setSearch]   = useState('');
  const [form,     setForm]     = useState(emptyForm);
  const [editId,   setEditId]   = useState(null);
  const [editForm, setEditForm] = useState({});
  const [msg,      setMsg]      = useState('');
  const [error,    setError]    = useState('');

  const flash = (type, text) => {
    if (type === 'success') { setMsg(text); setTimeout(() => setMsg(''), 3000); }
    else                    { setError(text); setTimeout(() => setError(''), 4000); }
  };

  const fetchItems = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/api/items`, { headers });
      setItems(res.data);
    } catch {
      flash('error', 'Failed to load items');
    }
  }, [token]);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const handleSearch = async () => {
    if (!search.trim()) return fetchItems();
    try {
      const res = await axios.get(`${API}/api/items/search?name=${encodeURIComponent(search)}`, { headers });
      setItems(res.data);
    } catch {
      flash('error', 'Search failed');
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/api/items`, form, { headers });
      flash('success', 'Item reported successfully!');
      setForm(emptyForm);
      fetchItems();
    } catch (err) {
      flash('error', err.response?.data?.message || 'Error adding item');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this item?')) return;
    try {
      await axios.delete(`${API}/api/items/${id}`, { headers });
      flash('success', 'Item deleted.');
      fetchItems();
    } catch (err) {
      flash('error', err.response?.data?.message || 'Error deleting item');
    }
  };

  const startEdit = (item) => {
    setEditId(item._id);
    setEditForm({
      itemName:    item.itemName,
      description: item.description || '',
      type:        item.type,
      location:    item.location,
      contactInfo: item.contactInfo
    });
  };

  const handleUpdate = async (id) => {
    try {
      await axios.put(`${API}/api/items/${id}`, editForm, { headers });
      setEditId(null);
      flash('success', 'Item updated!');
      fetchItems();
    } catch (err) {
      flash('error', err.response?.data?.message || 'Unauthorized or error updating');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="container">
      {/* Header */}
      <div className="header">
        <h2>Lost &amp; Found — Campus</h2>
        <div>
          <span>Welcome, {user.name}</span>
          <button onClick={logout} className="btn btn-danger">Logout</button>
        </div>
      </div>

      {msg   && <div className="alert success">{msg}</div>}
      {error && <div className="alert error">{error}</div>}

      {/* Search */}
      <div className="card">
        <h3>Search Items</h3>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by item name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
          />
          <button onClick={handleSearch} className="btn btn-primary">Search</button>
          <button onClick={() => { setSearch(''); fetchItems(); }} className="btn btn-outline">Reset</button>
        </div>
      </div>

      {/* Report Item */}
      <div className="card">
        <h3>Report an Item</h3>
        <form onSubmit={handleAdd} className="form-grid">
          <input
            required placeholder="Item Name"
            value={form.itemName}
            onChange={e => setForm({ ...form, itemName: e.target.value })}
          />
          <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
            <option>Lost</option>
            <option>Found</option>
          </select>
          <input
            required placeholder="Location"
            value={form.location}
            onChange={e => setForm({ ...form, location: e.target.value })}
          />
          <input
            required placeholder="Contact Info (phone/email)"
            value={form.contactInfo}
            onChange={e => setForm({ ...form, contactInfo: e.target.value })}
          />
          <input
            type="date"
            value={form.date}
            onChange={e => setForm({ ...form, date: e.target.value })}
          />
          <input
            placeholder="Description (optional)"
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
          />
          <button type="submit" className="btn btn-primary span2">Add Item</button>
        </form>
      </div>

      {/* Items List */}
      <div className="card">
        <h3>All Reported Items ({items.length})</h3>
        {items.length === 0 ? (
          <p style={{ color: '#888', fontSize: 14 }}>No items reported yet.</p>
        ) : (
          <div className="items-grid">
            {items.map(item => (
              <div key={item._id} className={`item-card ${item.type === 'Lost' ? 'lost' : 'found'}`}>
                {editId === item._id ? (
                  <div className="edit-form">
                    <input
                      value={editForm.itemName}
                      onChange={e => setEditForm({ ...editForm, itemName: e.target.value })}
                      placeholder="Item Name"
                    />
                    <select
                      value={editForm.type}
                      onChange={e => setEditForm({ ...editForm, type: e.target.value })}
                    >
                      <option>Lost</option>
                      <option>Found</option>
                    </select>
                    <input
                      value={editForm.location}
                      onChange={e => setEditForm({ ...editForm, location: e.target.value })}
                      placeholder="Location"
                    />
                    <input
                      value={editForm.contactInfo}
                      onChange={e => setEditForm({ ...editForm, contactInfo: e.target.value })}
                      placeholder="Contact Info"
                    />
                    <input
                      value={editForm.description}
                      onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                      placeholder="Description"
                    />
                    <div className="edit-actions">
                      <button onClick={() => handleUpdate(item._id)} className="btn btn-primary">Save</button>
                      <button onClick={() => setEditId(null)} className="btn btn-outline">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <span className={`badge badge-${item.type === 'Lost' ? 'lost' : 'found'}`}>{item.type}</span>
                    <h4>{item.itemName}</h4>
                    {item.description && <p>{item.description}</p>}
                    <p><strong>Location:</strong> {item.location}</p>
                    <p><strong>Contact:</strong> {item.contactInfo}</p>
                    <p><strong>Reported by:</strong> {item.user?.name}</p>
                    <p><strong>Date:</strong> {new Date(item.date || item.createdAt).toLocaleDateString()}</p>
                    <div className="actions">
                      <button onClick={() => startEdit(item)} className="btn btn-outline">Edit</button>
                      <button onClick={() => handleDelete(item._id)} className="btn btn-danger">Delete</button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
