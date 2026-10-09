
function UrlInput({ url, setUrl }) {
  return (
    <>
      <label htmlFor="longUrl">
        Paste your long URL
      </label>

      <input
        id="longUrl"
        type="text"
        value={url}
        onChange={(event) => setUrl(event.target.value)}
        placeholder="https://example.com/your/long/link"
      />
    </>
  );
}

export default UrlInput;