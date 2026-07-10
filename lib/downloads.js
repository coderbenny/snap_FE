// Single source of truth for download links, source repositories, and
// per-platform metadata. Consumed by the /download page, the home-page
// cross-platform section, and JSON-LD SEO metadata so everything stays in sync.
//
// Snapit is distributed via GitHub Releases (open source) rather than a private
// CDN. The `releases/latest` URLs always resolve to the newest published build,
// so they never go stale when a new version is tagged.

export const GITHUB_ORG = 'coderbenny';

// Source repositories, split by client.
export const REPOS = {
  desktop: `https://github.com/${GITHUB_ORG}/snap_PC`, // macOS + Windows (Flutter)
  mobile: `https://github.com/${GITHUB_ORG}/snap_mobile`, // Android (Flutter)
  backend: `https://github.com/${GITHUB_ORG}/snap_BE`, // Flask API + sync
  web: `https://github.com/${GITHUB_ORG}/snap_FE`, // this website + dashboard
};

// Release pages. macOS + Windows ship from the desktop repo; Android from mobile.
export const DESKTOP_RELEASES = `${REPOS.desktop}/releases/latest`;
export const MOBILE_RELEASES = `${REPOS.mobile}/releases/latest`;

// Homebrew tap for the macOS cask.
export const HOMEBREW_TAP = `${GITHUB_ORG}/tap`;

// Ordered list of supported platforms. `id` maps to an icon in the UI layer so
// this module stays free of React/JSX and can be imported anywhere.
export const PLATFORMS = [
  {
    id: 'macos',
    name: 'macOS',
    badge: 'Universal',
    requirement: 'macOS 10.14 or later · Apple Silicon & Intel',
    href: DESKTOP_RELEASES,
    repo: REPOS.desktop,
  },
  {
    id: 'windows',
    name: 'Windows',
    badge: 'x64',
    requirement: 'Windows 10 (build 1903) or later · 64-bit',
    href: DESKTOP_RELEASES,
    repo: REPOS.desktop,
  },
  {
    id: 'android',
    name: 'Android',
    badge: 'Beta',
    requirement: 'Android phone or tablet · direct APK install',
    href: MOBILE_RELEASES,
    repo: REPOS.mobile,
  },
];
