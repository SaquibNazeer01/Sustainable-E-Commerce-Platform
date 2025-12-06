import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

const RegisterPage: React.FC = () => {
  const { register } = useUser();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [registered, setRegistered] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Please enter both username and password.');
      return;
    }
    const success = register(username, password);
    if (success) {
      setRegistered(true);
      setError('');
    } else {
      setError('Username already exists or invalid input.');
    }
  };

  if (registered) {
    return (
      <div className="max-w-md mx-auto p-8 text-center bg-white rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4 text-green-700">Registration Successful!</h2>
        <p className="mb-6 text-gray-600">You can now log in with your credentials.</p>
        <button
          onClick={() => navigate('/login')}
          className="bg-green-600 text-white px-6 py-2 rounded shadow hover:bg-green-700 transition"
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-8 bg-white rounded-lg shadow">
      <h2 className="text-3xl font-bold mb-6 text-green-700 text-center">Create Your Account</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder="Choose a username"
          className="p-3 rounded w-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
        />
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Choose a password"
          className="p-3 rounded w-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
        />
        {error && <div className="text-red-500 mb-2 text-center">{error}</div>}
        <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded w-full font-semibold shadow hover:bg-green-700 transition">Register</button>
      </form>
      <div className="mt-6 text-center">
        <span className="text-gray-500">Already have an account?</span>
        <button
          type="button"
          onClick={() => navigate('/login')}
          className="ml-2 text-green-700 underline hover:text-green-900"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default RegisterPage;
