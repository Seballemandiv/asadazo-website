const MediaLinks = () => {
  return (
    <section className="media-links-section">
      <div className="media-container">
        <h2 className="hero-title">Follow our fire</h2>
        <p className="hero-sub">
          Videos, behind‑the‑scenes, and weekly cuts.
        </p>

        <div className="social-buttons">
          <a className="btn-outline" href="https://www.instagram.com" target="_blank" rel="noreferrer">Instagram</a>
          <a className="btn-outline" href="https://www.youtube.com" target="_blank" rel="noreferrer">YouTube</a>
          <a className="btn-outline" href="https://www.tiktok.com" target="_blank" rel="noreferrer">TikTok</a>
        </div>

        <div className="media-grid">
          <div className="media-card">Video placeholder</div>
          <div className="media-card">Video placeholder</div>
          <div className="media-card">Video placeholder</div>
        </div>
      </div>
    </section>
  );
};

export default MediaLinks;