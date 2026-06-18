/** Footer — light canvas, multi-column, per DESIGN-airtable.md. */
export default function Footer() {
  return (
    <footer className="page-footer" role="contentinfo">
      <div className="fi">
        <div className="fl">
          <img src="/school/assets/logo.png" alt="re:form" />
          <p>An honest conversation about faith, life, and finding our way back to God.</p>
        </div>
        <div className="fr">
          <div>
            <p className="col-h">School</p>
            <p><a href="/school">Overview</a></p>
            <p><a href="/school/courses">Courses</a></p>
            <p><a href="/school/login">Sign in</a></p>
          </div>
          <div>
            <p className="col-h">re:form</p>
            <p><a href="/journal">Reform Journal</a></p>
            <p><a href="/learn">Learn of God</a></p>
            <p><a href="https://youtube.com/@ReformPodcast" target="_blank" rel="noopener">Podcast</a></p>
          </div>
        </div>
      </div>
      <hr className="fd" aria-hidden="true" />
      <div className="fb">&copy; re:form &middot; A Seventh-day Adventist Ministry &middot; All rights reserved</div>
    </footer>
  );
}
