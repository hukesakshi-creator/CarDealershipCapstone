import React, { useState } from "react";

export default function Register({ onRegister }) {
  const [form, setForm] = useState({ username: "", first_name: "", last_name: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const update = (event) => setForm({ ...form, [event.target.name]: event.target.value });
  const submit = async (event) => {
    event.preventDefault();
    if (form.password.length < 8) { setMessage("Password must contain at least 8 characters."); return; }
    if (onRegister) await onRegister(form);
    setMessage("Form validated. Connect this component to your registration API to create the account.");
  };
  return <main className="register-card"><h1>Sign up</h1><form onSubmit={submit}>
    <label>Username<input name="username" value={form.username} onChange={update} required /></label>
    <label>First Name<input name="first_name" value={form.first_name} onChange={update} required /></label>
    <label>Last Name<input name="last_name" value={form.last_name} onChange={update} required /></label>
    <label>Email<input type="email" name="email" value={form.email} onChange={update} required /></label>
    <label>Password<input type="password" name="password" value={form.password} onChange={update} minLength={8} required /></label>
    <button type="submit">Register</button></form>{message && <p role="status">{message}</p>}</main>;
}
