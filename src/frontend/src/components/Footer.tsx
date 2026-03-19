const LOGO_BARS = [
  { id: "flb1", h: 3 },
  { id: "flb2", h: 5 },
  { id: "flb3", h: 7 },
  { id: "flb4", h: 5 },
  { id: "flb5", h: 3 },
  { id: "flb6", h: 7 },
  { id: "flb7", h: 4 },
];
const FOOTER_LINKS = ["Privacy", "Terms", "Contact", "API Docs"];

export default function Footer() {
  const year = new Date().getFullYear();
  const utmLink = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`;

  return (
    <footer className="border-t border-border bg-card mt-10">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex items-end gap-[2px] h-5">
              {LOGO_BARS.map((bar) => (
                <div
                  key={bar.id}
                  className="w-[2px] rounded-full bg-primary"
                  style={{ height: `${bar.h * 2.5}px` }}
                />
              ))}
            </div>
            <span className="font-bold text-base text-foreground">
              Vox<span className="text-primary">Flow</span>
            </span>
          </div>

          <div className="flex items-center gap-6">
            {FOOTER_LINKS.map((link) => (
              <button
                key={link}
                type="button"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                {link}
              </button>
            ))}
          </div>

          <p className="text-xs text-muted-foreground">
            &copy; {year}. Built with ❤️ using{" "}
            <a
              href={utmLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-medium"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
