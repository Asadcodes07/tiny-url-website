
import express from "express";
import cors from "cors";
import { randomBytes } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const app = express();
const PORT = 3001;

const root = path.dirname(fileURLToPath(import.meta.url));
const databaseFile = path.join(root, "links.json");

app.use(cors());
app.use(express.json());

async function readLinks() {
  try {
    return JSON.parse(await readFile(databaseFile, "utf8"));
  } catch (error) {
    if (error.code === "ENOENT") return [];
    throw error;
  }
}

async function saveLinks(links) {
  await writeFile(databaseFile, JSON.stringify(links, null, 2));
}

function isValidUrl(value) {
  try {
    const url = new URL(value);
    return (
      (url.protocol === "http:" || url.protocol === "https:") &&
      Boolean(url.hostname)
    );
  } catch {
    return false;
  }
}

app.get("/api/links", async (req, res) => {
  try {
    res.json(await readLinks());
  } catch {
    res.status(500).json({ error: "Could not read links." });
  }
});

app.post("/api/links", async (req, res) => {
  try {
    const originalUrl = String(req.body.originalUrl || "").trim();

    if (!isValidUrl(originalUrl)) {
      return res.status(400).json({
        error: "Enter a valid HTTP or HTTPS URL.",
      });
    }

    const links = await readLinks();
    let code;

    do {
      code = randomBytes(4).toString("hex");
    } while (links.some((link) => link.code === code));

    const link = {
      id: code,
      code,
      originalUrl,
      shortUrl: `http://localhost:${PORT}/${code}`,
      createdAt: new Date().toISOString(),
    };

    links.unshift(link);
    await saveLinks(links);
    res.status(201).json(link);
  } catch {
    res.status(500).json({ error: "Could not create short link." });
  }
});

app.delete("/api/links/:id", async (req, res) => {
  try {
    const links = await readLinks();
    const updated = links.filter((link) => link.id !== req.params.id);

    if (updated.length === links.length) {
      return res.status(404).json({ error: "Link not found." });
    }

    await saveLinks(updated);
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: "Could not delete link." });
  }
});

app.get("/:code", async (req, res, next) => {
  if (req.params.code === "favicon.ico") return next();

  try {
    const links = await readLinks();
    const link = links.find((item) => item.code === req.params.code);

    if (!link) return res.status(404).send("Short link not found.");

    res.redirect(302, link.originalUrl);
  } catch {
    res.status(500).send("Could not redirect this link.");
  }
});

app.listen(PORT, () => {
  console.log(`TinyLink backend running at http://localhost:${PORT}`);
});