import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!formData.email || !formData.password) {
      setMessage("Please fill in all fields.");
      return;
    }
    login(formData.email);
    setMessage("Login successful!");
    setTimeout(() => { navigate("/"); }, 500);
  }

  return (
    <div className="min-h-screen bg-slate-100 px-6 py-16">
      <div className="mx-auto max-w-md rounded-xl bg-white p-8 shadow-md">
        <h1 className="text-3xl font-bold text-slate-900">Login</h1>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block font-medium">Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full rounded-lg border px-4 py-2" />
          </div>
          <div>
            <label className="mb-1 block font-medium">Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} className="w-full rounded-lg border px-4 py-2" />
          </div>
          <button type="submit" className="w-full rounded-lg bg-indigo-600 px-4 py-3 font-semibold text-white">Login</button>
          {message && <p className="text-center font-semibold text-green-600">{message}</p>}
        </form>
      </div>
    </div>
  );
}

export default Login;