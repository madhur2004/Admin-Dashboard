import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
  const response = await fetch('https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json');
  if (!response.ok) throw new Error('Failed to fetch users');
  return response.json();
});

const initialState = {
  users: [],
  loading: false,
  error: null,
  selectedUsers: [],
  currentPage: 1,
  searchQuery: '',
  editingUser: null,
};

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    toggleUserSelection: (state, action) => {
      const userId = action.payload;
      if (state.selectedUsers.includes(userId)) {
        state.selectedUsers = state.selectedUsers.filter(id => id !== userId);
      } else {
        state.selectedUsers.push(userId);
      }
    },
    toggleAllUsers: (state, action) => {
      const pageUserIds = action.payload;
      const allSelected = pageUserIds.every(id => state.selectedUsers.includes(id));
      if (allSelected) {
        state.selectedUsers = state.selectedUsers.filter(id => !pageUserIds.includes(id));
      } else {
        const newSelected = [...new Set([...state.selectedUsers, ...pageUserIds])];
        state.selectedUsers = newSelected;
      }
    },
    deleteUsers: (state, action) => {
      const userIds = action.payload;
      state.users = state.users.filter(user => !userIds.includes(user.id));
      state.selectedUsers = state.selectedUsers.filter(id => !userIds.includes(id));
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
      state.currentPage = 1;
    },
    startEditing: (state, action) => {
      state.editingUser = action.payload;
    },
    updateUser: (state, action) => {
      const index = state.users.findIndex(user => user.id === action.payload.id);
      if (index !== -1) {
        state.users[index] = action.payload;
      }
      state.editingUser = null;
    },
    cancelEditing: (state) => {
      state.editingUser = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch users';
      });
  },
});

export const {
  toggleUserSelection,
  toggleAllUsers,
  deleteUsers,
  setCurrentPage,
  setSearchQuery,
  startEditing,
  updateUser,
  cancelEditing,
} = userSlice.actions;

export default userSlice.reducer;
