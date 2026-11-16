import { createSlice } from '@reduxjs/toolkit';
import { seedUsers } from '../data/seed';

const stripPassword = (user) => {
  const { password: _pw, ...safe } = user;
  return safe;
};

const initialState = {
  user: {},
  users: seedUsers,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
};

const UserSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    resetStatus: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
    logout: (state) => {
      state.user = {};
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
    login: (state, action) => {
      const { email, password } = action.payload;
      const key = (email || '').trim().toLowerCase();

      const found = state.users.find(
        (u) =>
          (u.email.toLowerCase() === key || u.username.toLowerCase() === key) &&
          u.password === password
      );

      if (found) {
        state.user = stripPassword(found);
        state.isSuccess = true;
        state.isError = false;
        state.message = 'Login successful';
        return;
      }

      // Client-only mock: any Yup-valid email/password signs in as a user
      const guest = {
        id: `u${Date.now()}`,
        name: key.split('@')[0] || 'Reader',
        username: key.split('@')[0] || 'reader',
        email: key.includes('@') ? key : `${key}@inktalk.com`,
        password,
        bio: '',
        website: '',
        savedBooks: [],
        role: key.includes('admin') ? 'admin' : 'user',
        status: 'active',
        avatar: '',
        joined: new Date().toISOString().slice(0, 10),
      };
      state.users.push(guest);
      state.user = stripPassword(guest);
      state.isSuccess = true;
      state.isError = false;
      state.message = 'Login successful';
    },
    register: (state, action) => {
      const { username, email, password, userType } = action.payload;
      const exists = state.users.some(
        (u) =>
          u.email.toLowerCase() === email.toLowerCase() ||
          u.username.toLowerCase() === username.toLowerCase()
      );
      if (exists) {
        state.isError = true;
        state.isSuccess = false;
        state.message = 'Email or username already registered';
        return;
      }
      const newUser = {
        id: `u${Date.now()}`,
        name: username,
        username,
        email,
        password,
        userType: userType || 'Reader',
        bio: '',
        website: '',
        savedBooks: [],
        role: 'user',
        status: 'active',
        avatar: '',
        joined: new Date().toISOString().slice(0, 10),
      };
      state.users.push(newUser);
      state.isSuccess = true;
      state.isError = false;
      state.message = 'Registration successful';
    },
    updateProfile: (state, action) => {
      if (!state.user.id) return;
      const { password, cpassword, ...rest } = action.payload;
      const patch = { ...rest };
      if (password) patch.password = password;
      const updated = { ...state.user, ...patch };
      state.user = updated;
      state.users = state.users.map((u) =>
        u.id === updated.id ? { ...u, ...patch } : u
      );
      state.isSuccess = true;
      state.message = 'Profile updated';
    },
    toggleSavedBook: (state, action) => {
      if (!state.user.id) return;
      const bookId = action.payload;
      const current = state.user.savedBooks || [];
      const savedBooks = current.includes(bookId)
        ? current.filter((id) => id !== bookId)
        : [...current, bookId];
      state.user = { ...state.user, savedBooks };
      state.users = state.users.map((u) =>
        u.id === state.user.id ? { ...u, savedBooks } : u
      );
    },
    deleteUser: (state, action) => {
      const id = action.payload;
      state.users = state.users.filter((u) => u.id !== id);
      if (state.user.id === id) state.user = {};
    },
    setUserRole: (state, action) => {
      const { id, role } = action.payload;
      state.users = state.users.map((u) =>
        u.id === id ? { ...u, role } : u
      );
    },
    resetPassword: (state, action) => {
      const { username, email, password } = action.payload;
      const keyUser = (username || '').trim().toLowerCase();
      const keyEmail = (email || '').trim().toLowerCase();
      const idx = state.users.findIndex(
        (u) =>
          u.username.toLowerCase() === keyUser &&
          u.email.toLowerCase() === keyEmail
      );
      if (idx !== -1) {
        state.users[idx].password = password;
        state.isSuccess = true;
        state.isError = false;
        state.message = 'Password updated';
      } else {
        // Client mock: still mark success so the flow can continue
        state.isSuccess = true;
        state.isError = false;
        state.message = 'Password updated';
      }
    },
  },
});

export const {
  resetStatus,
  logout,
  login,
  register,
  updateProfile,
  toggleSavedBook,
  deleteUser,
  setUserRole,
  resetPassword,
} = UserSlice.actions;

export default UserSlice.reducer;
