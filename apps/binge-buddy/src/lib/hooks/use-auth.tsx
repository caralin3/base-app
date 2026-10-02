import { create } from 'zustand';

import { loginUser, logoutUser, registerUser } from '../firebase/auth';
import { type User } from '../firebase/types';
import { createSelectors } from '../store';

interface AuthState {
  signIn: (email: string, password: string) => void;
  signOut: () => void;
  status: 'idle' | 'signOut' | 'signIn';
  register: (email: string, password: string) => void;
  user: User | null;
}

const _useAuth = create<AuthState>((set, get) => ({
  status: 'idle',
  user: null,
  register: async (email, password) => {
    const newUser = await registerUser(email, password);
    set({
      status: 'signIn',
      user: {
        ...newUser,
        id: newUser.uid,
      },
    });
  },
  signIn: async (email, password) => {
    const user = await loginUser(email, password);
    set({
      status: 'signIn',
      user: {
        ...user,
        id: user.uid,
      },
    });
  },
  signOut: async () => {
    await logoutUser();
    set({ status: 'signOut', user: null });
  },
}));

export const useAuth = createSelectors(_useAuth);

export const register = (email: string, password: string) =>
  _useAuth.getState().register(email, password);
export const signIn = (email: string, password: string) =>
  _useAuth.getState().signIn(email, password);
export const signOut = () => _useAuth.getState().signOut();
