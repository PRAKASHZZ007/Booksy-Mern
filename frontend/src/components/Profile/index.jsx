import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Header from "../Header";
import "./index.css";

const Profile = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    mobile: "",
    dob: ""
  });

  const [edit, setEdit] = useState(false);

  // LOAD PROFILE
  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch("http://localhost:5000/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ FIXED
          },
        });

        const data = await res.json();

        if (res.ok) {
          setUser(data.user);
        } else {
          toast.error(data.message);
        }
      } catch {
        toast.error("Failed to load profile");
      }
    };

    load();
  }, []);

  // UPDATE PROFILE
  const update = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/auth/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ✅ FIXED
        },
        body: JSON.stringify(user),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Profile updated");
        setUser(data.user);
        setEdit(false);
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error("Update failed");
    }
  };

  // DELETE ACCOUNT
  const deleteAccount = async () => {
    const confirmDelete = window.confirm("Are you sure?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${import.meta.env.VITE_API_URL}api/auth/delete`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`, // ✅ FIXED
        },
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Account deleted");
        localStorage.clear();
        window.location.href = "/";
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <>
      <Header />

      <div className="profile-container">
        <div className="profile-card">

          <h2 className="profile-title">Your Account</h2>

          <div className="field">
            <label>Name</label>
            <input
              value={user.name}
              disabled={!edit}
              onChange={(e) =>
                setUser({ ...user, name: e.target.value })
              }
            />
          </div>

          <div className="field">
            <label>Email</label>
            <input value={user.email} disabled />
          </div>

          <div className="field">
            <label>Mobile</label>
            <input
              value={user.mobile}
              disabled={!edit}
              onChange={(e) =>
                setUser({ ...user, mobile: e.target.value })
              }
            />
          </div>

          <div className="field">
            <label>Date of Birth</label>
            <input
              type="date"
              value={user.dob || ""}
              disabled={!edit}
              onChange={(e) =>
                setUser({ ...user, dob: e.target.value })
              }
            />
          </div>

          <div className="btn-group">
            {edit ? (
              <>
                <button className="save-btn" onClick={update}>
                  Save Changes
                </button>

                <button
                  className="cancel-btn"
                  onClick={() => setEdit(false)}
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                className="edit-btn"
                onClick={() => setEdit(true)}
              >
                Edit Profile
              </button>
            )}
          </div>

          {/* DELETE BUTTON */}
          <button className="delete-btn" onClick={deleteAccount}>
            Delete Account
          </button>

        </div>
      </div>
    </>
  );
};

export default Profile;