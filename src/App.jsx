import React from "react";
import { Provider } from "react-redux";
import { store } from "./store/store";
import UserTable from "./components/UserTable";

function App() {
  return (
    <>
      <Provider store={store}>
        <div className="min-h-screen bg-gray-100">
          <header className="bg-white shadow">
            <div className="px-4 py-6 mx-auto max-w-7xl">
              <h1 className="text-3xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
            </div>
          </header>
          <main>
            <UserTable />
          </main>
        </div>
      </Provider>
    </>
  );
}

export default App;
