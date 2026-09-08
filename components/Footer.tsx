export function Footer() {
  return (
    <footer className="border-t border-petale-200 bg-white py-12">
      <div className="container-mx">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div>
            <p className="font-display text-xl font-bold text-petale-950">petale</p>
            <p className="mt-1 text-sm text-petale-600">
              © 2026 petale · Fait avec amour à Paris
            </p>
          </div>

          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-petale-700">
            <a href="/confidentialite" className="hover:text-petale-950">
              Confidentialité
            </a>
            <a href="/cgu" className="hover:text-petale-950">
              CGU
            </a>
            <a href="mailto:customer@petale.love" className="hover:text-petale-950">
              Contact
            </a>
            <a
              href="https://twitter.com/petale_ai"
              target="_blank"
              rel="noreferrer noopener"
              className="hover:text-petale-950"
            >
              Twitter
            </a>
            <a
              href="https://instagram.com/petale.ai"
              target="_blank"
              rel="noreferrer noopener"
              className="hover:text-petale-950"
            >
              Instagram
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}