import React, { useState, useEffect } from "react";

const App = () => {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age: "",
    isActive: true,
  });

  // Function to fetch users from the server
  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:23000/users");
      const data = await response.json();
      setUsers(data);
      setMessage("Users fetched successfully!");
    } catch (error) {
      console.error("Error fetching data:", error);
      setMessage("Error fetching users.");
    }
  };

  // Function to send a POST request
  const createUser = async (event) => {
    event.preventDefault(); // Prevent form submission default behavior
    try {
      const response = await fetch("http://localhost:23000/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          age: parseInt(formData.age), // Ensure age is a number
        }),
      });

      const data = await response.json();
      setMessage(data.message);
      setFormData({ name: "", email: "", age: "", isActive: true }); // Reset form
      fetchUsers(); // Refresh the user list after adding a new user
    } catch (error) {
      console.error("Error creating user:", error);
      setMessage("Error creating user.");
    }
  };

  // Function to send a DELETE request
  const deleteUser = async (id) => {
    try {
      const response = await fetch(`http://localhost:23000/delete/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();
      setMessage(data.message);
      fetchUsers(); // Refresh the user list after deleting a user
    } catch (error) {
      console.error("Error deleting user:", error);
      setMessage("Error deleting user.");
    }
  };

  // Fetch users when the component loads
  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <div>
      <h1>React with Express</h1>
      <p>{message}</p>

      <h2>Create a New User</h2>
      <form onSubmit={createUser}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Age:</label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleInputChange}
            />
            Active
          </label>
        </div>
        <button type="submit">Add User</button>
      </form>

      <h2>Users List</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.name} - {user.email} ({user.age} years old) -{" "}
            {user.isActive ? "Active" : "Inactive"}
            <button onClick={() => deleteUser(user.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
