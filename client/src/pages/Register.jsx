import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.name || !formData.email || !formData.password) {
      setError("Please fill in all fields.");
      return;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      setSubmitting(true);
      await register(formData.name, formData.email, formData.password, formData.role);
      setSuccess("Registration successful! Redirecting to events...");
      setTimeout(() => {
        navigate("/events");
      }, 700);
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 px-6 py-16">
      <div className="mx-auto max-w-md rounded-xl bg-white p-8 shadow-md">
        <h1 className="text-3xl font-bold text-slate-900">Create Account</h1>
        <p className="mt-2 text-sm text-slate-600">Register for EventHub with JWT authentication</p>

        {error && (
          <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700 border border-red-200">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-4 rounded-lg bg-green-50 p-3 text-sm text-green-700 border border-green-200">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Priya Patel"
              required
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:border-indigo-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="priya@example.com"
              required
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:border-indigo-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="At least 6 characters"
              required
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:border-indigo-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:border-indigo-500 focus:outline-none bg-white"
            >
              <option value="user">User (Standard Student)</option>
              <option value="admin">Admin (Event Organizer)</option>
            </select>
            <p className="mt-1 text-xs text-slate-500">Admins can access restricted admin dashboard.</p>
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-indigo-600 px-4 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-50"
          >
            {submitting ? "Registering..." : "Register"}
          </button>
        </form>

        <div className="mt-6 border-t border-slate-100 pt-4 text-center text-sm text-slate-600">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-indigo-600 hover:underline">
            Login here
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;