import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import HomePage from "@/pages/Home";
import CityPage from "@/pages/CityPage";
import BlogPostPage from "@/pages/BlogPost";
import AccessDeals from "@/pages/AccessDeals";
import { CITIES } from "@/data/cities";

// TEMPORARY DEBUG BANNER — visible only when ?debug=1 in URL.
// Shows wouter's pathname + registered routes so we can diagnose city-page 404s.
function DebugBanner() {
  const [pathname] = useLocation();
  const url = typeof window !== "undefined" ? window.location.href : "";
  const routes = typeof window !== "undefined" ? (window as unknown as { __WOUTER_ROUTES__?: string[] }).__WOUTER_ROUTES__ ?? [] : [];
  const showDebug = typeof window !== "undefined" && window.location.search.includes("debug=1");
  if (!showDebug) return null;
  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 99999, background: "#ff3b30", color: "white", padding: "10px 14px", fontFamily: "monospace", fontSize: 12, lineHeight: 1.5, whiteSpace: "pre-wrap" }}>
      DEBUG · wouter pathname: <strong>{pathname}</strong>
      {"\n"}DEBUG · window.location.href: <strong>{url}</strong>
      {"\n"}DEBUG · registered routes: {routes.join(" | ")}
    </div>
  );
}

function Router() {
  return (
    <>
      <DebugBanner />
      <Switch>
        <Route path={"/"} component={HomePage} />
        {/* City landing pages — one explicit literal Route per slug.
            The previous `/sell-my-house-fast-:city` param-style route never
            matched because wouter's regexparam parser only recognises `:name`
            params at the START of a path segment (after `/`). With a mid-segment
            colon, regexparam compiles `:city` as a literal string — silently
            failing every city URL. Listing each path explicitly avoids the
            parser quirk entirely and matches bulletproof. */}
        {CITIES.map((c) => (
          <Route key={c.slug} path={`/sell-my-house-fast-${c.slug}`}>
            <CityPage slug={c.slug} />
          </Route>
        ))}
        {/* Blog post pages — slug is matched in client/src/content/blog/index.ts */}
        <Route path={"/blog/:slug"} component={BlogPostPage} />
        {/* Cash buyer registration — /deals is canonical; /access-deals kept as alias */}
        <Route path={"/deals"} component={AccessDeals} />
        <Route path={"/access-deals"} component={AccessDeals} />
        <Route path={"/404"} component={NotFound} />
        {/* Final fallback route */}
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
