import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { ToastProvider } from "@/cedar";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', padding: '0 var(--space-4)', backgroundColor: 'var(--bg-base)' }}>
      <div style={{ maxWidth: 448, textAlign: 'center' }}>
        <h1 style={{ fontSize: 'var(--title-lg)', fontWeight: 700, color: 'var(--text-base)', fontFamily: 'var(--font-base)' }}>404</h1>
        <h2 style={{ marginTop: 'var(--space-4)', fontSize: 'var(--heading-lg)', fontWeight: 600, color: 'var(--text-base)', fontFamily: 'var(--font-base)' }}>Page not found</h2>
        <p style={{ marginTop: 'var(--space-2)', fontSize: 'var(--body-sm)', color: 'var(--text-subtle)', fontFamily: 'var(--font-base)' }}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div style={{ marginTop: 'var(--space-6)' }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRadius: 'var(--radius-lg)', backgroundColor: 'var(--action-primary)', padding: 'var(--space-2) var(--space-4)', fontSize: 'var(--body-sm)', fontWeight: 500, color: 'var(--action-on-primary)', fontFamily: 'var(--font-base)', textDecoration: 'none' }}>
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', padding: '0 var(--space-4)', backgroundColor: 'var(--bg-base)' }}>
      <div style={{ maxWidth: 448, textAlign: 'center' }}>
        <h1 style={{ fontSize: 'var(--heading-lg)', fontWeight: 600, color: 'var(--text-base)', fontFamily: 'var(--font-base)' }}>This page didn't load</h1>
        <p style={{ marginTop: 'var(--space-2)', fontSize: 'var(--body-sm)', color: 'var(--text-subtle)', fontFamily: 'var(--font-base)' }}>
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div style={{ marginTop: 'var(--space-6)', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 'var(--space-2)' }}>
          <button
            onClick={() => { router.invalidate(); reset(); }}
            style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRadius: 'var(--radius-lg)', backgroundColor: 'var(--action-primary)', padding: 'var(--space-2) var(--space-4)', fontSize: 'var(--body-sm)', fontWeight: 500, color: 'var(--action-on-primary)', fontFamily: 'var(--font-base)', border: 'none', cursor: 'pointer' }}>
            Try again
          </button>
          <a href="/" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-base)', padding: 'var(--space-2) var(--space-4)', fontSize: 'var(--body-sm)', fontWeight: 500, color: 'var(--text-base)', fontFamily: 'var(--font-base)', textDecoration: 'none' }}>
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Cedar Ops — Design System Adoption Tracker" },
      { name: "description", content: "Track adoption of the Cedar design system across products, components, and teams." },
      { property: "og:title", content: "Cedar Ops — Design System Adoption Tracker" },
      { property: "og:description", content: "Track adoption of the Cedar design system across products, components, and teams." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
      { rel: "icon", href: "/favicon.ico", type: "image/png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function NavLink({ to, children, exact }: { to: string; children: ReactNode; exact?: boolean }) {
  return (
    <Link
      to={to}
      activeOptions={{ exact }}
      style={{
        display: 'inline-flex',
        height: 36,
        alignItems: 'center',
        padding: '0 var(--space-3)',
        fontSize: 'var(--size-xs)',
        fontWeight: 500,
        fontFamily: 'var(--font-base)',
        color: 'var(--text-subtle)',
        textDecoration: 'none',
        borderBottom: '2px solid transparent',
        marginBottom: -1,
        transition: 'color 0.15s',
      }}
      activeProps={{
        style: {
          display: 'inline-flex',
          height: 36,
          alignItems: 'center',
          padding: '0 var(--space-3)',
          fontSize: 'var(--size-xs)',
          fontWeight: 500,
          fontFamily: 'var(--font-base)',
          color: 'var(--action-primary)',
          textDecoration: 'none',
          borderBottom: '2px solid var(--action-primary)',
          marginBottom: -1,
          transition: 'color 0.15s',
        },
      }}
    >
      {children}
    </Link>
  );
}

function TopNav() {
  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 40, borderBottom: '1px solid var(--border-subtle)', backgroundColor: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(8px)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 var(--space-6)' }}>
        <div style={{ display: 'flex', height: 56, alignItems: 'center', gap: 'var(--space-8)' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', textDecoration: 'none' }}>
            <img src="/favicon.svg" alt="" style={{ height: 24, width: 24, borderRadius: 'var(--radius-md)' }} />
            <span style={{ fontSize: 'var(--size-xs)', fontWeight: 600, letterSpacing: '-0.01em', color: 'var(--text-base)', fontFamily: 'var(--font-base)' }}>Cedar Ops</span>
          </Link>
          <nav style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
            <NavLink to="/" exact>Overview</NavLink>
            <NavLink to="/components">Components</NavLink>
            <NavLink to="/settings">Settings</NavLink>
          </nav>
        </div>
      </div>
    </header>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-base)', color: 'var(--text-base)' }}>
          <TopNav />
          <main style={{ maxWidth: 1280, margin: '0 auto', padding: 'var(--space-8) var(--space-6)' }}>
            <Outlet />
          </main>
        </div>
      </ToastProvider>
    </QueryClientProvider>
  );
}
