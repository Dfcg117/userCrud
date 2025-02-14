import { useEffect, useState } from "react";
import useCrudApi from "./hooks/useCrudApi";
import { FaGift, FaRegEdit, FaTrashAlt, FaUserPlus, FaCheck, FaTimes } from 'react-icons/fa'; 
import './App.css';

const initialValues = {
  first_name: '',
  last_name: '',
  email: '',
  password: '',
  birthday: '',
  image_url: '',
};

const baseUrl = 'https://users-crud-api-production-9c59.up.railway.app/api/v1/';

function App() {
  const { request, data: users, pending, error } = useCrudApi();
  const [values, setValues] = useState(initialValues);
  const [showForm, setShowForm] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [deletedUser, setDeletedUser] = useState(null);

  useEffect(() => {
    request({ url: baseUrl + 'users' });
  }, []);

  const add = (user) => {
    request({
      url: baseUrl + 'users', 
      method: 'POST',
      body: user
    }).then(() => {
      setShowForm(false); 
      request({ url: baseUrl + 'users' }); 
    });
  };

  const update = (id, userEdit) => {
    request({
      url: baseUrl + 'users/' + id,
      method: 'PUT',
      body: userEdit
    }).then(() => {
      request({ url: baseUrl + 'users' });
      setValues(initialValues);
      setShowForm(false);
    });
  };

  const remove = (id) => {
    request({
      url: baseUrl + 'users/' + id,
      method: 'DELETE',
    }).then(() => {
      request({ url: baseUrl + 'users' });
      setValues(initialValues);
      setShowForm(false);
      setDeletedUser(id);
      setShowModal(true);
    });
  };

  const handleChange = ({ name, value }) => {
    setValues({
      ...values,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formattedDate = values.birthday;
    const updatedValues = {
      ...values,
      birthday: formattedDate
    };
    if (values.id) {
      update(values.id, updatedValues);
    } else {
      add(updatedValues);
    }
  };

  const handleEdit = (user) => {
    setValues({
      ...user,
      birthday: new Date(user.birthday).toISOString().split('T')[0]
    });
    setShowForm(true);
  };

  const toggleForm = () => {
    setValues(initialValues);
    setShowForm(!showForm);
  };

  const handleCancel = () => {
    setValues(initialValues);
    setShowForm(false);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setDeletedUser(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-indigo-200 py-10">
      <div className="flex justify-between items-start px-4 max-w-screen-xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 shadow-lg">USUARIOS 👥</h1>
        <button
          onClick={toggleForm}
          className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2 px-4 rounded-md shadow-md hover:bg-blue-800 flex items-center cursor-pointer"
        >
          <FaUserPlus className="mr-2" />
          Create New User
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg relative">
            <FaTimes
              className="absolute top-2 right-2 text-xl text-gray-600 cursor-pointer hover:text-gray-800"
              onClick={handleCancel}
            />
            <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
              {values.id ? 'Edit User' : 'Create New User'}
            </h2>
            <form onSubmit={handleSubmit}>
              <input
                className="input mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                type="text"
                name="first_name"
                placeholder="First Name"
                value={values.first_name}
                onChange={(e) => handleChange(e.target)}
              />
              <input
                className="input mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                type="text"
                name="last_name"
                placeholder="Last Name"
                value={values.last_name}
                onChange={(e) => handleChange(e.target)}
              />
              <input
                className="input mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                type="email"
                name="email"
                placeholder="Email"
                value={values.email}
                onChange={(e) => handleChange(e.target)}
              />
              <input
                className="input mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                type="password"
                name="password"
                placeholder="Password"
                value={values.password}
                onChange={(e) => handleChange(e.target)}
              />
              <input
                className="input mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                type="date"
                name="birthday"
                value={values.birthday}
                onChange={(e) => handleChange(e.target)}
              />
              <input
                className="input mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                type="text"
                name="image_url"
                placeholder="Image URL"
                value={values.image_url}
                onChange={(e) => handleChange(e.target)}
              />
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 text-white py-2 px-4 rounded-md shadow-md hover:bg-indigo-800 cursor-pointer"
              >
                {values.id ? 'Update' : 'Create'}
                <FaCheck className="ml-2 inline" />
              </button>
            </form>
          </div>
        </div>
      )}

      {pending ? <p>Loading...</p> :
        <div className="mt-8 w-full max-w-screen-xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {users && users.map(user =>
            <div key={user.id} className="flex flex-col bg-white p-6 rounded-lg shadow-lg border border-gray-200 transition-all hover:shadow-xl">
              <h3 className="text-xl font-semibold text-gray-800">{user.first_name} {user.last_name}</h3>
              <div className="text-sm text-gray-700 flex items-center mb-2">
                <FaGift className="mr-2 text-gray-600" />
                <span className="font-semibold">Cumpleaños: </span>{new Date(user.birthday).toLocaleDateString()}
              </div>
              <button onClick={() => handleEdit(user)}><FaRegEdit /></button>
              <button onClick={() => remove(user.id)}><FaTrashAlt /></button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
