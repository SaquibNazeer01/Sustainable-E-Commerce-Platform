import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const { user, login, logout } = useUser();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  if (user) {
    return (
      <div className="max-w-md mx-auto p-8 text-center bg-white rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4 text-green-700">Welcome, {user.username}!</h2>
        <button onClick={logout} className="bg-red-500 text-white px-6 py-2 rounded shadow hover:bg-red-700 transition">Logout</button>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Please enter both username and password.');
      return;
    }
    const success = login(username, password);
    if (!success) {
      setError('Invalid username or password.');
    }
  };

  return (
    <div className="max-w-md mx-auto p-8 bg-white rounded-lg shadow">
      <h2 className="text-3xl font-bold mb-6 text-green-700 text-center">Login to Your Account</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder="Username"
          className="p-3 rounded w-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
        />
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Password"
          className="p-3 rounded w-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
        />
        {error && <div className="text-red-500 mb-2 text-center">{error}</div>}
        <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded w-full font-semibold shadow hover:bg-green-700 transition">Login</button>
      </form>
      <div className="mt-6 text-center">
        <span className="text-gray-500">Don't have an account?</span>
        <button
          type="button"
          onClick={() => navigate('/register')}
          className="ml-2 text-green-700 underline hover:text-green-900"
        >
          Register
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
