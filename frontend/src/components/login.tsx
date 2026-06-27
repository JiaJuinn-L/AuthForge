import { useState, type FormEvent } from "react";
import axios from "axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/login",
        { email, password },
      );
      console.log("Login:", response.data);
    } catch (error: any) {
      setError(error?.response?.data?.message || "Login failed");
      console.error("Login failed:", error);
    }
  };
  return (
    <section className="login-card ">
      <form onSubmit={handleLogin}>
        <h1>Login</h1>
        <h2>Email</h2>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <h2>Password</h2>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br /> <br />
        <button type="submit">Submit</button>
        {error ? <p style={{ color: "red" }}>{error}</p> : null}
      </form>
    </section>
  );
}
