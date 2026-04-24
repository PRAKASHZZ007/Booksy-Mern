import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import toast from "react-hot-toast";
import "./index.css";

const AuthModal = ({ type, onClose }) => {
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    email: "",
    mobile: "",
    name: "",
    dob: "",
    password: ""
  });

  const [errors, setErrors] = useState({});

  const API = `${import.meta.env.VITE_API_URL}/api/auth`;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });

    setErrors({
      ...errors,
      [e.target.name]: ""
    });
  };

  const isGmail = (email) => /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email);
  const isMobile = (m) => /^[0-9]{10}$/.test(m);

  const validateSignup = () => {
    let temp = {};

    if (!form.email.trim()) temp.email = "Email required";
    else if (!isGmail(form.email)) temp.email = "Only Gmail allowed";

    if (!form.mobile.trim()) temp.mobile = "Mobile required";
    else if (!isMobile(form.mobile)) temp.mobile = "Invalid mobile";

    if (!form.name.trim()) temp.name = "Name required";
    if (!form.dob) temp.dob = "DOB required";

    if (!form.password) temp.password = "Password required";
    else if (form.password.length < 6)
      temp.password = "Min 6 characters required";

    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  const validateLogin = () => {
    let temp = {};

    if (!form.email.trim()) temp.email = "Email required";
    if (!form.password) temp.password = "Password required";

    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  const handleRegister = async () => {
    if (!validateSignup()) return;

    try {
      const res = await fetch(`${API}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Signup successful! Please login");

        setForm({
          email: "",
          mobile: "",
          name: "",
          dob: "",
          password: ""
        });

        onClose();
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error("Server error");
    }
  };

  const handleLogin = async () => {
    if (!validateLogin()) return;

    try {
      const res = await fetch(`${API}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("name", data.user.name);
        localStorage.setItem("email", data.user.email);

        setForm({
          email: "",
          mobile: "",
          name: "",
          dob: "",
          password: ""
        });

        toast.success(`Welcome ${data.user.name}`);
        window.dispatchEvent(new Event("login"));
        onClose();
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error("Server error");
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>

        <button className="close-btn" onClick={onClose}>×</button>

        <h2 className="modal-title">
          {type === "signup" ? "Sign Up" : "Login"}
        </h2>

        {type === "signup" ? (
          <div className="form-container">

            <input className="input" name="email" placeholder="Email"
              value={form.email} onChange={handleChange} />
            {errors.email && <p className="error-text">* {errors.email}</p>}

            <input className="input" name="mobile" placeholder="Mobile"
              value={form.mobile} onChange={handleChange} />
            {errors.mobile && <p className="error-text">* {errors.mobile}</p>}

            <input className="input" name="name" placeholder="Name"
              value={form.name} onChange={handleChange} />
            {errors.name && <p className="error-text">* {errors.name}</p>}

            <input className="input" name="dob" type="date"
              value={form.dob} onChange={handleChange} />
            {errors.dob && <p className="error-text">* {errors.dob}</p>}

            {/* PASSWORD */}
            <div className="password-field">
              <input
                className="input"
                name="password"
                placeholder="Password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
              />

              <span className="eye" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            {errors.password && <p className="error-text">* {errors.password}</p>}

            <button className="auth-btn" onClick={handleRegister}>
              CONTINUE
            </button>

          </div>
        ) : (

          <div className="form-container">

            <input className="input" name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange} />
            {errors.email && <p className="error-text">* {errors.email}</p>}

            {/* PASSWORD */}
            <div className="password-field">
              <input
                className="input"
                name="password"
                placeholder="Password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
              />

              <span className="eye" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            {errors.password && <p className="error-text">* {errors.password}</p>}

            <button className="auth-btn" onClick={handleLogin}>
              LOGIN
            </button>

          </div>
        )}

      </div>
    </div>
  );
};

export default AuthModal;