const User = {
  id: '',
  name: '',
  email: '',
  role: ''
};
const UserState = {
  users: [],
  loading: false,
  error: null,
  selectedUsers: [],
  currentPage: 1,
  searchQuery: '',
  editingUser: null
};