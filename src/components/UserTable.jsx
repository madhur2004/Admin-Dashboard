import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Search, Edit2, Trash2, Save, X } from "lucide-react";
import {
  fetchUsers,
  toggleUserSelection,
  toggleAllUsers,
  deleteUsers,
  setCurrentPage,
  setSearchQuery,
  startEditing,
  updateUser,
  cancelEditing,
} from "../store/userSlice";

const ROWS_PER_PAGE = 10;

export default function UserTable() {
  const dispatch = useDispatch();
  const {
    users,
    loading,
    error,
    selectedUsers,
    currentPage,
    searchQuery,
    editingUser,
  } = useSelector((state) => state.users);

  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const filteredUsers = users.filter((user) =>
    Object.values(user).some((value) =>
      value.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredUsers.length / ROWS_PER_PAGE);
  const startIndex = (currentPage - 1) * ROWS_PER_PAGE;
  const displayedUsers = filteredUsers.slice(
    startIndex,
    startIndex + ROWS_PER_PAGE
  );

  const handleSearch = (e) => {
    dispatch(setSearchQuery(e.target.value));
  };

  const handleEdit = (user) => {
    dispatch(startEditing(user.id));
    setEditForm(user);
  };

  const handleSave = () => {
    if (editForm.id) {
      dispatch(updateUser(editForm));
    }
  };

  const handleCancel = () => {
    dispatch(cancelEditing());
    setEditForm({});
  };

  const handleDeleteSelected = () => {
    dispatch(deleteUsers(selectedUsers));
  };

  if (loading) return <div className="py-4 text-center">Loading...</div>;
  if (error)
    return <div className="py-4 text-center text-red-500">{error}</div>;

  return (
    <div className="container px-4 py-8 mx-auto">
      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Search by name, email or role..."
          value={searchQuery}
          onChange={handleSearch}
          className="w-full px-4 py-2 pr-10 border rounded-lg"
        />
        <Search
          className="search-icon absolute right-3 top-2.5 text-gray-400"
          size={20}
        />
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={
                    displayedUsers.length > 0 &&
                    displayedUsers.every((user) =>
                      selectedUsers.includes(user.id)
                    )
                  }
                  onChange={() =>
                    dispatch(
                      toggleAllUsers(displayedUsers.map((user) => user.id))
                    )
                  }
                  className="rounded"
                />
              </th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Name
              </th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Email
              </th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Role
              </th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {displayedUsers.map((user) => (
              <tr
                key={user.id}
                className={selectedUsers.includes(user.id) ? "bg-gray-50" : ""}
              >
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user.id)}
                    onChange={() => dispatch(toggleUserSelection(user.id))}
                    className="rounded"
                  />
                </td>
                <td className="px-6 py-4">
                  {editingUser === user.id ? (
                    <input
                      type="text"
                      value={editForm.name || ""}
                      onChange={(e) =>
                        setEditForm({ ...editForm, name: e.target.value })
                      }
                      className="w-full px-2 py-1 border rounded"
                    />
                  ) : (
                    user.name
                  )}
                </td>
                <td className="px-6 py-4">
                  {editingUser === user.id ? (
                    <input
                      type="email"
                      value={editForm.email || ""}
                      onChange={(e) =>
                        setEditForm({ ...editForm, email: e.target.value })
                      }
                      className="w-full px-2 py-1 border rounded"
                    />
                  ) : (
                    user.email
                  )}
                </td>
                <td className="px-6 py-4">
                  {editingUser === user.id ? (
                    <input
                      type="text"
                      value={editForm.role || ""}
                      onChange={(e) =>
                        setEditForm({ ...editForm, role: e.target.value })
                      }
                      className="w-full px-2 py-1 border rounded"
                    />
                  ) : (
                    user.role
                  )}
                </td>
                <td className="px-6 py-4">
                  {editingUser === user.id ? (
                    <div className="space-x-2">
                      <button
                        onClick={handleSave}
                        className="p-1 text-green-600 save hover:text-green-900"
                      >
                        <Save size={18} />
                      </button>
                      <button
                        onClick={handleCancel}
                        className="p-1 text-red-600 cancel hover:text-red-900"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ) : (
                    <div className="space-x-2">
                      <button
                        onClick={() => handleEdit(user)}
                        className="p-1 text-blue-600 edit hover:text-blue-900"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => dispatch(deleteUsers([user.id]))}
                        className="p-1 text-red-600 delete hover:text-red-900"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-4">
        <button
          onClick={handleDeleteSelected}
          disabled={selectedUsers.length === 0}
          className="px-4 py-2 text-white bg-red-600 rounded-lg delete-selected disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Delete Selected
        </button>

        <div className="flex space-x-2">
          <button
            onClick={() => dispatch(setCurrentPage(1))}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-100 rounded-md first-page disabled:opacity-50"
          >
            First
          </button>
          <button
            onClick={() => dispatch(setCurrentPage(currentPage - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-100 rounded-md previous-page disabled:opacity-50"
          >
            Previous
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i + 1}
              onClick={() => dispatch(setCurrentPage(i + 1))}
              className={`px-3 py-1 rounded-md ${
                currentPage === i + 1 ? "bg-blue-500 text-white" : "bg-gray-100"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => dispatch(setCurrentPage(currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-gray-100 rounded-md next-page disabled:opacity-50"
          >
            Next
          </button>
          <button
            onClick={() => dispatch(setCurrentPage(totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-gray-100 rounded-md last-page disabled:opacity-50"
          >
            Last
          </button>
        </div>
      </div>
    </div>
  );
}
