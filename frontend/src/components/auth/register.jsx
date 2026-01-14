import { useState } from "react";
import { apiRequest } from "../../services/api";
import "./register.css";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await apiRequest("/auth/register", "POST", form);
      setSuccess("Registration successful! Please login.");
      setForm({ name: "", email: "", password: "" });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form className="auth-box" onSubmit={handleSubmit}>
      <h2>Register</h2>

      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}

      <input
        name="name"
        placeholder="Name"
        required
        onChange={handleChange}
        value={form.name}
      />

      <input
        type="email"
        name="email"
        placeholder="Email"
        required
        onChange={handleChange}
        value={form.email}
      />

      <input
        type="password"
        name="password"
        placeholder="Password"
        required
        onChange={handleChange}
        value={form.password}
      />

      <button>Register</button>
    </form>
  );
};

export default Register;
