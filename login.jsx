import { useState } from "react";

export default function Login() {
  const [user, setUser] = useState("");

  const login = () => {
    localStorage.setItem("user", user);
    window.location.href = "/demo";
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>AriLinc Login</h2>
      <input onChange={(e) => setUser(e.target.value)} placeholder="Company Name" />
      <button onClick={login}>Enter Demo</button>
    </div>
  );
}
