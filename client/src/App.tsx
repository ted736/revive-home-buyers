import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import HomePage from "@/pages/Home";
import CityPage from "@/pages/CityPage";
import BlogPostPage from "@/pages/BlogPost";
import AccessDeals from "@/pages/AccessDeals";
import { CITIES } from "@/data/cities";

function Router() {
  return (
    <>
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
