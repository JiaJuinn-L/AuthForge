import { useState, type FormEvent } from "react";
import axios from "axios";

type RegisterErrors = {
  email?: string;
  password?: string;
  general?: string;
};

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<RegisterErrors>({});

  const handleRegister = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrors({});

    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/register",
        { email, password },
      );

      console.log("Registered:", response.data);
    } catch (error: any) {
      const response = error?.response?.data;

      setErrors({
        email: response?.errors?.email,
        password: response?.errors?.password,
        general: response?.message,
      });
    }
  };

  return (
    <section className="register-card">
      <form onSubmit={handleRegister}>
        <h1>Register</h1>

        <h2>Email</h2>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {errors.email && <p style={{ color: "red" }}>{errors.email}</p>}

        <h2>Password</h2>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {errors.password && <p style={{ color: "red" }}>{errors.password}</p>}

        <br />
        <button type="submit">Submit</button>

        {errors.general && <p style={{ color: "red" }}>{errors.general}</p>}
      </form>
    </section>
  );
}
