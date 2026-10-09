import { Link } from "react-router-dom";
import "./Auth.css";

function Signup() {
  function handleSignup(event) {
    event.preventDefault();
    alert("Signup form submitted. Account creation is not connected yet.");
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <Link to="/" className="auth-brand">
          <span className="auth-brand-icon">↗</span>
          TinyLink
        </Link>

        <h1>Create your account</h1>
        <p className="auth-subtitle">
          Start creating and managing short links.
        </p>

        <form className="auth-form" onSubmit={handleSignup}>
          <label htmlFor="signup-name">Full name</label>
          <input
            id="signup-name"
            type="text"
            placeholder="Enter your full name"
            autoComplete="name"
            required
          />

          <label htmlFor="signup-email">Email address</label>
          <input
            id="signup-email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            required
          />

          <label htmlFor="signup-password">Password</label>
          <input
            id="signup-password"
            type="password"
            placeholder="Create a password"
            autoComplete="new-password"
            minLength={8}
            required
          />

          <button type="submit" className="auth-submit">
            Create Account
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Log in</Link>
        </p>

        <Link to="/" className="auth-home">
          ← Back to homepage
        </Link>
      </section>
    </main>
  );
}

export default Signup;