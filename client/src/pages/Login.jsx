import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.email || !formData.password) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      setSubmitting(true);
      const data = await login(formData.email, formData.password);
      setSuccess(`Login successful! Welcome ${data.user.name} (${data.user.role})`);
      setTimeout(() => {
        if (data.user.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/events");
        }
      }, 700);
    } catch (err) {
      setError(err.message || "Invalid email or password");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 px-6 py-16">
      <div className="mx-auto max-w-md rounded-xl bg-white p-8 shadow-md">
        <h1 className="text-3xl font-bold text-slate-900">Sign In</h1>
        <p className="mt-2 text-sm text-slate-600">Access your EventHub account</p>

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
            <label className="mb-1 block text-sm font-medium text-slate-700">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="user@example.com"
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
              placeholder="••••••••"
              required
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:border-indigo-500 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-indigo-600 px-4 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-50"
          >
            {submitting ? "Signing in..." : "Login"}
          </button>
        </form>

        <div className="mt-6 border-t border-slate-100 pt-4 text-center text-sm text-slate-600">
          Don't have an account?{" "}
          <Link to="/register" className="font-semibold text-indigo-600 hover:underline">
            Register here
          </Link>
        </div>

        <div className="mt-4 rounded-lg bg-slate-50 p-3 text-xs text-slate-500">
          <p className="font-semibold text-slate-700">Demo Accounts:</p>
          <p>• Admin: <span className="font-mono">admin@eventhub.com</span> / <span className="font-mono">admin123</span></p>
          <p>• Student: <span className="font-mono">student@eventhub.com</span> / <span className="font-mono">student123</span></p>
        </div>
      </div>
    </div>
  );
}

export default Login;