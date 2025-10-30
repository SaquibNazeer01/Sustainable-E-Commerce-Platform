
import React, { useState } from 'react';
import { useUser } from '../context/UserContext';

const AccountSection: React.FC = () => {

  const { user, users, logout } = useUser();
  const [editMode, setEditMode] = useState(false);
  const [username, setUsername] = useState(user ? user.name : '');
  const [avatar, setAvatar] = useState(user ? user.avatar : '');
  const [success, setSuccess] = useState(false);


  // If not logged in, use a default user object for editing
  const displayUser = user || {
    id: 0,
    name: username,
    avatar: avatar || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200',
    ecoPoints: 0,
    impact: { co2Saved: 0, wasteReduced: 0, energyConserved: 0, co2Offset: 0 },
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // Update user in context (simulate update in users array)
    const idx = users.findIndex(u => u.id === user.id);
    if (idx !== -1) {
      users[idx] = { ...users[idx], name: username, avatar };
      user.name = username;
      user.avatar = avatar;
      setSuccess(true);
      setEditMode(false);
      setTimeout(() => setSuccess(false), 2000);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-8 text-center max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Welcome, {displayUser.name || 'Guest'}!</h2>
      <img src={displayUser.avatar} alt={displayUser.name} className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-brand-green shadow-lg" />
      {success && <div className="text-green-600 font-semibold mb-2">Profile updated!</div>}
      {editMode ? (
        <form onSubmit={handleSave} className="space-y-4 mb-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="p-2 rounded w-full border"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Avatar URL</label>
            <input
              type="text"
              value={avatar}
              onChange={e => setAvatar(e.target.value)}
              className="p-2 rounded w-full border"
              required
            />
          </div>
          <div className="flex justify-center gap-2">
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700 transition">Save</button>
            <button type="button" onClick={() => setEditMode(false)} className="bg-gray-300 text-gray-800 px-4 py-2 rounded shadow hover:bg-gray-400 transition">Cancel</button>
          </div>
        </form>
      ) : (
        <>
          <p className="mb-4 text-gray-600">This is your private account section. You can manage your profile and see personalized info here.</p>
          <button onClick={() => setEditMode(true)} className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition mr-2">Edit Profile</button>
        </>
      )}
      <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded shadow hover:bg-red-700 transition mt-4">Logout</button>
    </div>
  );
};

export default AccountSection;
