import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./App.css";
import FeatureCard from "./FeatureCard";
import UrlInput from "./UrlInput";
import { Routes, Route } from "react-router-dom";
import Login from "./Login";
import Signup from "./Signup";
const API = "http://localhost:3001/api/links";

const faqs = [
  {
    question: "What is a URL shortener?",
    answer:
      "A URL shortener converts a long web address into a shorter link that is easier to share. When someone opens the short link, they are redirected to the original website.",
  },
  {
    question: "How does a URL shortener work?",
    answer:
      "The service saves the original URL with a unique code. When someone visits the short URL, the server looks up that code and redirects the visitor to the original address.",
  },
  {
    question: "What are the benefits of short links?",
    answer:
      "Short links are easier to share in messages, social media posts, presentations, and marketing campaigns. They also make long web addresses look cleaner.",
  },
  {
    question: "Can I create a custom short link?",
    answer:
      "This project currently generates a random short code. Custom aliases and branded domains can be added as future features.",
  },
  {
    question: "Is TinyLink free to use?",
    answer:
      "This is a student project intended for demonstration. It does not currently offer paid plans or a public hosted service.",
  },
  {
    question: "Why does my short link use localhost?",
    answer:
      "The project is running on your computer. Localhost links work on your computer while the backend is running. To share links publicly, the application must be deployed to a public server.",
  },
];

function App() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState("");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  async function loadHistory() {
    try {
      const response = await fetch(API);

      if (!response.ok) {
        throw new Error("Could not load your links.");
      }

      const data = await response.json();
      setHistory(data);
    } catch {
      setError("Backend is not running. Start it with: node server.js");
    }
  }

  useEffect(() => {
    loadHistory();
  }, []);

  async function handleShorten(event) {
    event.preventDefault();
    setError("");
    setShortUrl("");
    setCopied("");

    if (!url.trim()) {
      setError("Please enter a URL first.");
      return;
    }

    let validUrl;

    try {
      validUrl = new URL(url.trim());
      if (!["http:", "https:"].includes(validUrl.protocol)) {
        throw new Error();
      }
    } catch {
      setError("Enter a valid URL beginning with https:// or http://");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ originalUrl: validUrl.href }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Could not create the short link.");
      }

      setShortUrl(data.shortUrl);
      setUrl("");
      await loadHistory();
    } catch (err) {
      setError(err.message || "Could not connect to the backend.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy(link) {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(link);
      setError("");
    } catch {
      setError("Copy failed. Select and copy the link manually.");
    }
  }

  async function handleDelete(id) {
    try {
      const response = await fetch(
        `${API}/${encodeURIComponent(id)}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        throw new Error("Could not delete this link.");
      }

      setHistory((items) => items.filter((item) => item.id !== id));
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="app">
      {/* NAVBAR */}
      <header className="navbar">
        <a className="logo" href="#home" aria-label="TinyLink home">
          <span className="logo-icon">↗</span>
          <span>TinyLink</span>
        </a>

        <nav className="nav-links" aria-label="Main navigation">
          <a href="#plans">Plans</a>
          <a href="#features">Features</a>
          <a href="#about">About</a>
          <a href="#faq">FAQs</a>
        </nav>

        <div className="nav-actions">
          <Link className="login-button" to="/login">
            Log In
          </Link>
          <Link className="signup-button" to="/signup">
            Sign Up
          </Link>
        </div>
      </header>

      <main>
        {/* HERO AND SHORTENER */}
        <section className="hero" id="home">
          <div className="hero-inner">
            <div className="hero-copy">
              <span className="eyebrow">SIMPLE LINK MANAGEMENT</span>

              <h1>
                Short links.
                <br />
                <span>Big possibilities.</span>
              </h1>

              <p>
                Make long URLs short, clean, and easy to share.
                Manage your links with a simple, modern interface.
              </p>

              <div className="hero-actions">
                <a className="primary-cta" href="#shortener">
                  Shorten a Link
                </a>
                <a className="secondary-cta" href="#features">
                  Explore Features
                </a>
              </div>

              <div className="hero-trust">
                <span>✓ Easy to use</span>
                <span>✓ Fast redirects</span>
                <span>✓ Responsive design</span>
              </div>
            </div>

            <div className="shortener-card" id="shortener">
              <div className="shortener-heading">
                <span className="shortener-icon">↗</span>
                <div>
                  <h2>Shorten a Link</h2>
                  <p>Paste your long URL below to get started.</p>
                </div>
              </div>

              <form onSubmit={handleShorten}>
                <UrlInput url={url} setUrl={setUrl} />

                <button
                  className="shorten-button"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Creating link..." : "Shorten Link →"}
                </button>
              </form>

              {error && (
                <p className="error-message" role="alert">
                  {error}
                </p>
              )}

              {shortUrl && (
                <div className="result-card">
                  <p className="result-label">Your short link is ready</p>
                  <a
                    className="result-url"
                    href={shortUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {shortUrl}
                  </a>
                  <button
                    className="copy-button"
                    type="button"
                    onClick={() => handleCopy(shortUrl)}
                  >
                    {copied === shortUrl ? "Copied!" : "Copy Link"}
                  </button>
                </div>
              )}

              <p className="form-note">
                By using TinyLink, you agree to use links responsibly.
              </p>
            </div>
          </div>
        </section>

        {/* RECENT LINKS */}
        <section className="history-section section-container" id="history">
          <div className="section-heading">
            <span className="section-kicker">YOUR DASHBOARD</span>
            <h2>Your Recent Links</h2>
            <p>Your recently created short links appear here.</p>
          </div>

          {history.length === 0 ? (
            <div className="empty-history">
              <span className="empty-icon">↗</span>
              <h3>No links yet</h3>
              <p>Create your first short link using the form above.</p>
            </div>
          ) : (
            <div className="history-list">
              {history.map((item) => (
                <article className="history-item" key={item.id}>
                  <div className="history-link-info">
                    <span className="history-label">SHORT LINK</span>
                    <a href={item.shortUrl}>{item.shortUrl}</a>
                    <p className="original-url">{item.originalUrl}</p>
                  </div>

                  <div className="history-actions">
                    <button
                      className="copy-button"
                      type="button"
                      onClick={() => handleCopy(item.shortUrl)}
                    >
                      {copied === item.shortUrl ? "Copied!" : "Copy"}
                    </button>
                    <button
                      className="delete-button"
                      type="button"
                      onClick={() => handleDelete(item.id)}
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* PLANS / BENEFITS SECTION */}
        <section className="plans-section" id="plans">
          <div className="section-container">
            <div className="section-heading">
              <span className="section-kicker">BUILT FOR EVERYDAY SHARING</span>
              <h2>Everything you need to manage links</h2>
              <p>
                Start with simple link shortening and explore more ways to
                organize and share your URLs.
              </p>
            </div>

            <div className="plans-grid">
              <article className="plan-card">
                <span className="plan-icon">↗</span>
                <h3>Simple Short Links</h3>
                <p>
                  Turn long web addresses into compact links that are easier
                  to share with others.
                </p>
                <a href="#shortener">Try it now →</a>
              </article>

              <article className="plan-card featured-plan">
                <span className="plan-icon">▣</span>
                <h3>Organized History</h3>
                <p>
                  Review links created during your session and copy or delete
                  them whenever needed.
                </p>
                <a href="#history">View your links →</a>
              </article>

              <article className="plan-card">
                <span className="plan-icon">⌁</span>
                <h3>Responsive Layout</h3>
                <p>
                  Use the same clean interface on a laptop, tablet, or mobile
                  screen.
                </p>
                <a href="#features">Explore features →</a>
              </article>
            </div>
          </div>
        </section>

        {/* IMAGE SECTION 1 */}
        <section className="story-section story-light" id="about">
          <div className="story-inner">
            <div className="story-image-wrap">
              <img
                className="story-image"
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1100&q=85"
                alt="Digital analytics dashboard on a computer screen"
                loading="lazy"
              />
            </div>

            <div className="story-copy">
              <span className="section-kicker">CLEAR AND SIMPLE</span>
              <h2>Make every link easier to share</h2>
              <p>
                Long URLs can look messy in messages and posts. TinyLink
                gives you a cleaner way to share useful web pages.
              </p>
              <p>
                Create a short link, copy it, and share it wherever your
                audience needs it.
              </p>
              <a className="text-link" href="#shortener">
                Create a short link →
              </a>
            </div>
          </div>
        </section>

        {/* IMAGE SECTION 2 */}
        <section className="story-section story-blue">
          <div className="story-inner story-reverse">
            <div className="story-image-wrap">
              <img
                className="story-image"
                src="https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1100&q=85"
                alt="Team working together in a modern office"
                loading="lazy"
              />
            </div>

            <div className="story-copy">
              <span className="section-kicker">MADE FOR YOUR WORKFLOW</span>
              <h2>Keep your links organized</h2>
              <p>
                Find the links you created in the Recent Links section.
                Copy a short URL again or remove an entry you no longer need.
              </p>
              <p>
                The interface is designed to keep important actions easy to
                find without cluttering the page.
              </p>
              <a className="text-link" href="#history">
                Explore recent links →
              </a>
            </div>
          </div>
        </section>

        {/* IMAGE SECTION 3 */}
        <section className="story-section story-light">
          <div className="story-inner">
            <div className="story-image-wrap">
              <img
                className="story-image"
                src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1100&q=85"
                alt="Person using a laptop for online work"
                loading="lazy"
              />
            </div>

            <div className="story-copy">
              <span className="section-kicker">WORK ACROSS DEVICES</span>
              <h2>A smooth experience on every screen</h2>
              <p>
                TinyLink uses a responsive layout so the main content,
                buttons, and images adjust to different screen sizes.
              </p>
              <p>
                Whether you are working on a desktop or a phone, the key
                features stay easy to access.
              </p>
              <a className="text-link" href="#features">
                See the features →
              </a>
            </div>
          </div>
        </section>

        {/* FEATURES SECTION BEFORE FAQ */}
        <section className="features-section" id="features">
          <div className="section-container">
            <div className="section-heading">
              <span className="section-kicker">WHY TINYLINK</span>
              <h2>Useful features. No clutter.</h2>
              <p>
                The essentials for creating and managing short links in one
                clean interface.
              </p>
            </div>

            <div className="features-grid">
              <FeatureCard
                icon="⚡"
                title="Fast and Simple"
                description="Create short links with a straightforward form."
              />
              <FeatureCard
                icon="🔗"
                title="Easy to Share"
                description="Copy short links and share them where needed."
              />
              <FeatureCard
                icon="📱"
                title="Responsive Design"
                description="A layout that adapts to desktop and mobile screens."
              />
            </div>
          </div>
        </section>

        {/* FAQ — KEEP THIS AS THE ONLY FAQ SECTION */}
        <section className="faq-section" id="faq">
          <div className="faq-inner">
            <div className="faq-intro">
              <span className="section-kicker">HELP CENTER</span>
              <h2>Frequently Asked Questions</h2>
              <p>
                Quick answers to common questions about using TinyLink.
              </p>
            </div>

            <div className="faq-list">
              {faqs.map((faq) => (
                <details className="faq-item" key={faq.question}>
                  <summary>{faq.question}</summary>
                  <p>{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="site-footer">
        <div className="footer-main">
          <div className="footer-brand">
            <a className="logo footer-logo" href="#home">
              <span className="logo-icon">↗</span>
              <span>TinyLink</span>
            </a>
            <p>
              A simple URL shortener project built with React, CSS, and
              JavaScript.
            </p>
          </div>

          <div className="footer-column">
            <h3>Explore</h3>
            <a href="#plans">Benefits</a>
            <a href="#features">Features</a>
            <a href="#history">Recent Links</a>
          </div>

          <div className="footer-column">
            <h3>Help</h3>
            <a href="#faq">FAQs</a>
            <a href="#shortener">Shorten a Link</a>
            <Link to="/login">Log In</Link>
          </div>

          <div className="footer-column">
            <h3>Get Started</h3>
            <p>Create a short link in just a few steps.</p>
            <a className="footer-cta" href="#shortener">
              Get Started →
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} TinyLink. Student project.</p>
          <a href="#home">Back to top ↑</a>
        </div>
      </footer>
    </div>
  );
}

export default App;
