'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { encryptPassword, decryptPassword } from '@/lib/encryption';

interface VaultItem {
  _id: string;
  title: string;
  username: string;
  encryptedPassword: string;
  url?: string;
  notes?: string;
  createdAt: string;
}

export default function VaultList() {
  const { data: session } = useSession();
  const [items, setItems] = useState<VaultItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [decryptedPasswords, setDecryptedPasswords] = useState<{ [key: string]: string }>({});

// Add these state variables
const [exportLoading, setExportLoading] = useState(false);
// Add these state variables
const [importLoading, setImportLoading] = useState(false);
const [showImportModal, setShowImportModal] = useState(false);

// Add these import functions
const handleImportClick = () => {
  setShowImportModal(true);
};

const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const content = e.target?.result as string;
      const data = JSON.parse(content);
      processImportedData(data);
    } catch (error) {
      alert('Invalid file format. Please upload a valid JSON export file.');
    }
  };
  reader.readAsText(file);
};

const processImportedData = async (data: any) => {
  setImportLoading(true);
  try {
    // Validate the import data structure
    if (!data.items || !Array.isArray(data.items)) {
      throw new Error('Invalid file format: missing items array');
    }

    let importedCount = 0;
    let skippedCount = 0;

    // Process each item
    for (const item of data.items) {
      if (!item.title || !item.username) {
        skippedCount++;
        continue;
      }

      try {
        // Check if item already exists
        const existingItem = items.find(
          existing => 
            existing.title === item.title && 
            existing.username === item.username
        );

        if (existingItem) {
          skippedCount++;
          continue;
        }

        // Generate a random password for imported items
        // (since we don't store passwords in exports for security)
        const randomPassword = generateRandomPassword();
        const encryptionKey = 'temporary-key';
        const encryptedPassword = encryptPassword(randomPassword, encryptionKey);

        // Create the new item
        await fetch('/api/vault/items', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: item.title,
            username: item.username,
            encryptedPassword: encryptedPassword,
            url: item.url || '',
            notes: item.notes || '',
          }),
        });

        importedCount++;
      } catch (error) {
        console.error('Error importing item:', item.title, error);
        skippedCount++;
      }
    }

    setShowImportModal(false);
    fetchVaultItems(); // Refresh the list
    
    alert(`Import completed!\n\nImported: ${importedCount} items\nSkipped: ${skippedCount} items\n\nNote: New passwords were generated for imported items for security.`);
    
  } catch (error) {
    console.error('Import error:', error);
    alert('Failed to import data. Please check the file format.');
  } finally {
    setImportLoading(false);
  }
};

// Helper function to generate random passwords for imported items
const generateRandomPassword = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < 16; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

// Add these export functions
const exportVault = async (format: 'json' | 'csv') => {
  setExportLoading(true);
  try {
    const response = await fetch('/api/vault/export');
    if (response.ok) {
      const data = await response.json();
      
      if (format === 'json') {
        exportAsJSON(data.items);
      } else {
        exportAsCSV(data.items);
      }
    } else {
      alert('Failed to export vault');
    }
  } catch (error) {
    console.error('Export error:', error);
    alert('Failed to export vault');
  } finally {
    setExportLoading(false);
  }
};

const exportAsJSON = (items: VaultItem[]) => {
  const exportData = {
    exportedAt: new Date().toISOString(),
    version: '1.0',
    items: items.map(item => ({
      title: item.title,
      username: item.username,
      // Note: We can't export decrypted passwords for security
      url: item.url,
      notes: item.notes,
      createdAt: item.createdAt,
    }))
  };

  const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
    type: 'application/json' 
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `secure-vault-export-${new Date().toISOString().split('T')[0]}.json`;
  link.click();
  URL.revokeObjectURL(url);
};

const exportAsCSV = (items: VaultItem[]) => {
  const headers = ['Title', 'Username', 'URL', 'Notes', 'Created At'];
  const csvData = items.map(item => [
    `"${item.title.replace(/"/g, '""')}"`,
    `"${item.username.replace(/"/g, '""')}"`,
    `"${item.url?.replace(/"/g, '""') || ''}"`,
    `"${item.notes?.replace(/"/g, '""') || ''}"`,
    `"${new Date(item.createdAt).toLocaleDateString()}"`
  ]);

  const csvContent = [headers, ...csvData]
    .map(row => row.join(','))
    .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `secure-vault-export-${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
  URL.revokeObjectURL(url);
};


  // Form state
  const [formData, setFormData] = useState({
    title: '',
    username: '',
    password: '',
    url: '',
    notes: '',
  });

  const [editingItem, setEditingItem] = useState<VaultItem | null>(null);
const [editFormData, setEditFormData] = useState({
  title: '',
  username: '',
  password: '',
  url: '',
  notes: '',
});

  // Fetch vault items
  const fetchVaultItems = async () => {
    try {
      const response = await fetch('/api/vault/items');
      if (response.ok) {
        const data = await response.json();
        setItems(data.items || []);
      }
    } catch (error) {
      console.error('Error fetching vault items:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVaultItems();
  }, []);

  // Add new vault item
  const handleAddItem = async (e: React.FormEvent) => {
  e.preventDefault();
  
  console.log('1. Form submitted');
  console.log('2. Form data:', formData);
  
  if (!session?.user?.email) {
    console.log('3. No session found');
    return;
  }

  try {
    console.log('4. Starting encryption process');
    
    // For now, we'll store the password as-is (we'll add encryption in the next step)
    const encryptionKey = 'temporary-key';
    const encryptedPassword = encryptPassword(formData.password, encryptionKey);
    
    console.log('5. Password encrypted');
    console.log('6. Making API call to /api/vault/items');

    const response = await fetch('/api/vault/items', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: formData.title,
        username: formData.username,
        encryptedPassword: encryptedPassword,
        url: formData.url,
        notes: formData.notes,
      }),
    });

    console.log('7. API Response status:', response.status);
    console.log('8. API Response ok:', response.ok);

    if (response.ok) {
      const result = await response.json();
      console.log('9. Success! Response data:', result);
      
      setFormData({ title: '', username: '', password: '', url: '', notes: '' });
      setShowAddForm(false);
      fetchVaultItems(); // Refresh the list
      
      console.log('10. Form reset and list refreshed');
    } else {
      const errorData = await response.json();
      console.log('9. Error response:', errorData);
      alert(`Failed to add item: ${errorData.error}`);
    }
  } catch (error) {
    console.error('10. Catch block error:', error);
    alert('Failed to add item - check console for details');
  }
};

  // Decrypt password for viewing
  const handleViewPassword = async (itemId: string, encryptedPassword: string) => {
    try {
      const encryptionKey = 'temporary-key'; // We'll improve this later
      const decrypted = decryptPassword(encryptedPassword, encryptionKey);
      
      setDecryptedPasswords(prev => ({
        ...prev,
        [itemId]: decrypted,
      }));

      // Auto-clear after 30 seconds
      setTimeout(() => {
        setDecryptedPasswords(prev => {
          const newState = { ...prev };
          delete newState[itemId];
          return newState;
        });
      }, 30000);
    } catch (error) {
      console.error('Error decrypting password:', error);
      alert('Failed to decrypt password');
    }
  };

  // Copy to clipboard
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert('Copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  // Filter items based on search
  const filteredItems = items.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.url?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }
  // Delete vault item
const handleDeleteItem = async (itemId: string) => {
  if (!confirm('Are you sure you want to delete this item?')) {
    return;
  }

  try {
    const response = await fetch(`/api/vault/items/${itemId}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      fetchVaultItems(); // Refresh the list
      alert('Item deleted successfully');
    } else {
      alert('Failed to delete item');
    }
  } catch (error) {
    console.error('Error deleting vault item:', error);
    alert('Failed to delete item');
  }
};

// Hide password
const handleHidePassword = (itemId: string) => {
  setDecryptedPasswords(prev => {
    const newState = { ...prev };
    delete newState[itemId];
    return newState;
  });
};

// Edit item - we'll implement this later, for now just show an alert
// Replace the handleEditItem function
const handleEditItem = (item: VaultItem) => {
  setEditingItem(item);
  setEditFormData({
    title: item.title,
    username: item.username,
    password: '', // We'll decrypt when needed
    url: item.url || '',
    notes: item.notes || '',
  });
};

// Save edited item
const handleSaveEdit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (!editingItem || !session?.user?.email) return;

  try {
    const encryptionKey = 'temporary-key';
    const encryptedPassword = editFormData.password 
      ? encryptPassword(editFormData.password, encryptionKey)
      : editingItem.encryptedPassword; // Keep existing if password not changed

    const response = await fetch(`/api/vault/items/${editingItem._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: editFormData.title,
        username: editFormData.username,
        encryptedPassword: encryptedPassword,
        url: editFormData.url,
        notes: editFormData.notes,
      }),
    });

    if (response.ok) {
      setEditingItem(null);
      setEditFormData({ title: '', username: '', password: '', url: '', notes: '' });
      fetchVaultItems();
      alert('Item updated successfully!');
    } else {
      alert('Failed to update item');
    }
  } catch (error) {
    console.error('Error updating vault item:', error);
    alert('Failed to update item');
  }
};

// Cancel edit
const handleCancelEdit = () => {
  setEditingItem(null);
  setEditFormData({ title: '', username: '', password: '', url: '', notes: '' });
};



  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transition-colors duration-200">
      <div className="flex justify-between items-center mb-6">
  <h2 className="text-2xl font-bold text-gray-800">My Vault</h2>

<div className="flex space-x-2">
  {/* Import Button */}
  <button
    onClick={handleImportClick}
    disabled={importLoading}
    className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 disabled:opacity-50 flex items-center space-x-1"
  >
    <span>{importLoading ? 'Importing...' : 'Import'}</span>
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
    </svg>
  </button>

  {/* Export Button */}
  <div className="relative group">
    <button
      disabled={exportLoading || items.length === 0}
      className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center space-x-1"
    >
      <span>{exportLoading ? 'Exporting...' : 'Export'}</span>
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    </button>
    
    {/* Export Dropdown menu */}
    <div className="absolute right-0 mt-1 w-40 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
      <button
        onClick={() => exportVault('json')}
        disabled={exportLoading || items.length === 0}
        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50"
      >
        Export as JSON
      </button>
      <button
        onClick={() => exportVault('csv')}
        disabled={exportLoading || items.length === 0}
        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50"
      >
        Export as CSV
      </button>
    </div>
  </div>
  
  <button
    onClick={() => setShowAddForm(true)}
    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
  >
    Add New Item
  </button>
</div>
</div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search vault items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 "
        />
      </div>

      {/* Add Item Form */}
      {showAddForm && (
        <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
          <h3 className="text-lg font-semibold mb-4">Add New Item</h3>
          <form onSubmit={handleAddItem} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Title (e.g., Gmail, Facebook)"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="text"
                placeholder="Username or Email"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className=" px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="url"
                placeholder="URL (optional)"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <textarea
              placeholder="Notes (optional)"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
            <div className="flex space-x-2">
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
      {/* Import Modal */}
{showImportModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg shadow-md w-96">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Import Vault Data</h3>
      
      <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
        <p className="text-sm text-yellow-800">
          <strong>Note:</strong> Import from JSON export files only. 
          New passwords will be generated for imported items for security.
        </p>
      </div>

      <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
        <input
          type="file"
          accept=".json"
          onChange={handleFileUpload}
          className="hidden"
          id="import-file"
        />
        <label
          htmlFor="import-file"
          className="cursor-pointer block"
        >
          <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
          </svg>
          <p className="text-gray-600">Click to upload JSON file</p>
          <p className="text-sm text-gray-400 mt-1">.json files only</p>
        </label>
      </div>

      <div className="flex justify-end space-x-2 mt-6">
        <button
          onClick={() => setShowImportModal(false)}
          className="px-4 py-2 text-gray-600 hover:text-gray-800"
          disabled={importLoading}
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}

      {/* Edit Item Form */}
{editingItem && (
  <div className="mb-6 p-4 border border-blue-200 rounded-lg bg-blue-50">
    <h3 className="text-lg font-semibold mb-4 text-blue-800">Edit Item</h3>
    <form onSubmit={handleSaveEdit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Title"
          value={editFormData.title}
          onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="text"
          placeholder="Username or Email"
          value={editFormData.username}
          onChange={(e) => setEditFormData({ ...editFormData, username: e.target.value })}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="password"
          placeholder="Password (leave empty to keep current)"
          value={editFormData.password}
          onChange={(e) => setEditFormData({ ...editFormData, password: e.target.value })}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="url"
          placeholder="URL"
          value={editFormData.url}
          onChange={(e) => setEditFormData({ ...editFormData, url: e.target.value })}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <textarea
        placeholder="Notes"
        value={editFormData.notes}
        onChange={(e) => setEditFormData({ ...editFormData, notes: e.target.value })}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        rows={3}
      />
      <div className="flex space-x-2">
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
        >
          Save Changes
        </button>
        <button
          type="button"
          onClick={handleCancelEdit}
          className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
        >
          Cancel
        </button>
      </div>
    </form>
  </div>
)}

      {/* Vault Items List */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">
            {items.length === 0 ? 'Your vault is empty' : 'No items match your search'}
          </p>
          <p className="text-sm text-gray-400">
            {items.length === 0 ? 'Add your first item to get started!' : 'Try a different search term'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredItems.map((item) => (
            <div key={item._id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-gray-800">{item.title}</h3>
                  <p className="text-gray-600">Username: {item.username}</p>
                  {item.url && (
                    <p className="text-gray-600">
                      URL:{' '}
                      <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        {item.url}
                      </a>
                    </p>
                  )}
                  <div className="mt-2 flex items-center space-x-2">
                    <span className="text-gray-600">Password: </span>
                    {decryptedPasswords[item._id] ? (
                      <span className="font-mono bg-yellow-100 px-2 py-1 rounded">
                        {decryptedPasswords[item._id]}
                      </span>
                    ) : (
                      <span className="text-gray-400">••••••••</span>
                    )}
                    <button
  onClick={() => {
    if (decryptedPasswords[item._id]) {
      handleHidePassword(item._id);
    } else {
      handleViewPassword(item._id, item.encryptedPassword);
    }
  }}
  className="text-blue-600 hover:text-blue-800 text-sm"
>
  {decryptedPasswords[item._id] ? 'Hide' : 'View'}
</button>
                    {decryptedPasswords[item._id] && (
                      <button
                        onClick={() => copyToClipboard(decryptedPasswords[item._id])}
                        className="text-green-600 hover:text-green-800 text-sm"
                      >
                        Copy
                      </button>
                    )}
                  </div>
                  {item.notes && (
                    <p className="mt-2 text-gray-600 text-sm">Notes: {item.notes}</p>
                  )}
                </div>
               <div className="flex space-x-2">
  <button 
    onClick={() => handleEditItem(item)}
    className="text-blue-600 hover:text-blue-800 text-sm"
  >
    Edit
  </button>
  <button 
    onClick={() => handleDeleteItem(item._id)}
    className="text-red-600 hover:text-red-800 text-sm"
  >
    Delete
  </button>
</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}