const MediaLinks = () => {
  return (
    <section className="media-links-section">
      <div className="container">
        <h2 className="title" style={{ marginBottom: '1rem' }}>Follow our fire</h2>
        <p style={{ opacity: 0.9, marginBottom: '1.25rem' }}>
          Videos, behind‑the‑scenes, and weekly cuts.
        </p>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
          <a className="btn-outline" href="https://www.instagram.com" target="_blank" rel="noreferrer">Instagram</a>
          <a className="btn-outline" href="https://www.youtube.com" target="_blank" rel="noreferrer">YouTube</a>
          <a className="btn-outline" href="https://www.tiktok.com" target="_blank" rel="noreferrer">TikTok</a>
        </div>

        <div style={{ display: 'grid', gap: '12px', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}>
          <div className="card" style={{ aspectRatio: '16 / 9' }}>Video placeholder</div>
          <div className="card" style={{ aspectRatio: '16 / 9' }}>Video placeholder</div>
          <div className="card" style={{ aspectRatio: '16 / 9' }}>Video placeholder</div>
        </div>
      </div>
    </section>
  );
};

export default MediaLinks;