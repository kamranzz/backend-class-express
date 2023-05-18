import { useEffect, useState } from "react";
import Modal from "react-modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
import "./App.css";

function App() {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({});
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editUserId, setEditUserId] = useState(null);
  const [editUserData, setEditUserData] = useState({});

  useEffect(() => {
    fetch("http://localhost:7070/api/list")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        setNewUser({ name: "" });
      });
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    fetch("http://localhost:7070/api/list", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(newUser),
    });
    setUsers([...users, newUser]);
  }

  function handleChange(e) {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  }

  function handleSearch(e) {
    fetch(`http://localhost:7070/api/list?name=${e.target.value}`)
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }

  function handleDelete(user) {
    if (window.confirm("Are you sure you want to delete?")) {
      fetch(`http://localhost:7070/api/list/${user.id}`, {
        method: "DELETE",
      });
      setUsers(users.filter((pro) => pro.id !== user.id));
    }
  }
  function toggleCompletion(user) {
    const updatedUser = { ...user, completed: !user.completed };
    fetch(`http://localhost:7070/api/list/${updatedUser.id}`, {
      method: "PUT",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(updatedUser),
    });
    setUsers(
      users.map((u) => (u.id === updatedUser.id ? updatedUser : u))
    );
  }
  

  function openEditModal(user) {
    setEditModalOpen(true);
    setEditUserId(user.id);
    setEditUserData({ name: user.name });
  }

  function closeEditModal() {
    setEditModalOpen(false);
    setEditUserId(null);
    setEditUserData({});
  }

  function handleEditSubmit(e) {
    e.preventDefault();
    fetch(`http://localhost:7070/api/list/${editUserId}`, {
      method: "PUT",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(editUserData),
    });

    // Update the users list with the edited user
    setUsers(
      users.map((user) => {
        if (user.id === editUserId) {
          return { ...user, ...editUserData };
        }
        return user;
      })
    );

    closeEditModal();
  }

  function handleEditChange(e) {
    setEditUserData({ ...editUserData, [e.target.name]: e.target.value });
  }

  return (
    <div className="container">

    <>
    <input onChange={(e) => handleSearch(e)} placeholder="Search list" />

      <h1>ToDo List</h1>

      <form onSubmit={(e) => handleSubmit(e)}>
        <input
        className="input"
          onChange={(e) => handleChange(e)}
          name="name"
          placeholder="add list..."
          type="text"
        />
        <button>Add User</button>
      </form>

 
<ul>
  {users &&
    users.map((user) => (
      <li key={user.id} className={user.completed ? "completed" : ""}>
        {user.name}
        <button onClick={() => handleDelete(user)}>
          <FontAwesomeIcon className="faTrash" icon={faTrash} />
        </button>
        <button onClick={() => openEditModal(user)}>
          <FontAwesomeIcon className="faEdit" icon={faEdit} />
        </button>
        <button onClick={() => toggleCompletion(user)}>
          {user.completed ? "Undone" : "Done"}
        </button>
      </li>
    ))}
</ul>

      {/* Edit User Modal */}
      <Modal
      className={"ReactModal__Content"}
        isOpen={editModalOpen}
        onRequestClose={closeEditModal}
        contentLabel="Edit User"
      >
        <h2>Edit User</h2>
        <form onSubmit={handleEditSubmit}>
          <input
            onChange={handleEditChange}
            name="name"
            placeholder="User name"
            type="text"
            value={editUserData.name || ""}
          />
          <button>Save</button>
          <button onClick={closeEditModal}>Cancel</button>
        </form>
      </Modal>
    </>
    </div>
  );
}

export default App;
