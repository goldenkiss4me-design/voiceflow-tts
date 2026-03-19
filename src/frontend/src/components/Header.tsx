import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

const LOGO_BARS = [
  { id: "lb1", h: 3 },
  { id: "lb2", h: 5 },
  { id: "lb3", h: 7 },
  { id: "lb4", h: 5 },
  { id: "lb5", h: 3 },
  { id: "lb6", h: 7 },
  { id: "lb7", h: 4 },
];
const NAV_LINKS = ["Features", "Pricing", "API"];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border shadow-xs">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-end gap-[2px] h-6">
            {LOGO_BARS.map((bar) => (
              <div
                key={bar.id}
                className="w-[3px] rounded-full bg-primary"
                style={{ height: `${bar.h * 3}px` }}
              />
            ))}
          </div>
          <span className="font-bold text-xl text-foreground tracking-tight">
            Vox<span className="text-primary">Flow</span>
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <button
              type="button"
              key={link}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              data-ocid="header.link"
            >
              {link}
            </button>
          ))}
          <button
            type="button"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
            data-ocid="header.link"
          >
            Resources <ChevronDown className="h-3.5 w-3.5" />
          </button>
        </nav>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="hidden md:inline-flex text-sm font-medium"
            data-ocid="header.link"
          >
            Login
          </Button>
          <Button
            size="sm"
            className="hidden md:inline-flex text-sm font-semibold rounded-full px-5"
            data-ocid="header.primary_button"
          >
            Try Free
          </Button>
        </div>
      </div>
    </header>
  );
}
