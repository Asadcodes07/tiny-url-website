import { Link } from "react-router-dom";
import "./Auth.css";

function Login() {
  function handleLogin(event) {
    event.preventDefault();
    alert("Login form submitted. Authentication is not connected yet.");
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <Link to="/" className="auth-brand">
          <span className="auth-brand-icon">↗</span>
          TinyLink
        </Link>

        <h1>Welcome back</h1>
        <p className="auth-subtitle">
          Log in to manage your short links.
        </p>

        <form className="auth-form" onSubmit={handleLogin}>
          <label htmlFor="login-email">Email address</label>
          <input
            id="login-email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            required
          />

          <label htmlFor="login-password">Password</label>
          <input
            id="login-password"
            type="password"
            placeholder="Enter your password"
            autoComplete="current-password"
            required
          />

          <button type="submit" className="auth-submit">
            Log In
          </button>
        </form>

        <p className="auth-switch">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>

        <Link to="/" className="auth-home">
          ← Back to homepage
        </Link>
      </section>
    </main>
  );
}

export default Login;