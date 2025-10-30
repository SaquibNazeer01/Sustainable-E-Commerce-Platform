import React, { createContext, useContext, useState } from 'react';
import { USERS } from '../constants';
import type { User } from '../types';

// Extend User type for password field
type UserWithPassword = User & { password?: string };

export interface UserContextType {
  user: UserWithPassword | null;
  users: UserWithPassword[];
  login: (username: string, password: string) => boolean;
  register: (username: string, password: string) => boolean;
  logout: () => void;
}



const UserContext = createContext<UserContextType>({
  user: null,
  users: [],
  login: () => false,
  register: () => false,
  logout: () => {},
});

export const useUser = () => useContext(UserContext);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Convert USERS to UserWithPassword[] (existing users have no password)
  const [user, setUser] = useState<UserWithPassword | null>(null);
  const [users, setUsers] = useState<UserWithPassword[]>(USERS);

  const login = (username: string, password: string) => {
    const found = users.find(u => u.name === username && u.password === password);
    if (found) {
      setUser(found);
      return true;
    }
    return false;
  };

  const register = (username: string, password: string) => {
    if (!username || !password) return false;
    if (users.some(u => u.name === username)) return false;
    const newUser: UserWithPassword = {
      id: users.length ? Math.max(...users.map(u => u.id)) + 1 : 1,
      name: username,
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200',
      ecoPoints: 0,
      impact: { co2Saved: 0, wasteReduced: 0, energyConserved: 0, co2Offset: 0 },
      password,
    };
    setUsers(prev => [...prev, newUser]);
    setUser(newUser);
    return true;
  };

  const logout = () => setUser(null);

  return (
    <UserContext.Provider value={{ user, users, login, register, logout }}>
      {children}
    </UserContext.Provider>
  );
};
