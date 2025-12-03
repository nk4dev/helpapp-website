/**
 * openApp.ts
 *
 * Cross-platform deep link opener utility for the website.
 *
 * Purpose:
 * - When the user clicks a deep link on the website (helpapp://...), attempt to open the app on the device.
 * - If the app is not installed or the link did not open, fall back to a store page (if available) or a provided fallback URL.
 * - Works across Android (intent:// fallback) and iOS (basic fallback support).
 *
 * Usage:
 * import { openDeepLink } from '../../lib/openApp';
 *
 * // Native link format examples:
 * // helpapp://map
 * // helpapp://?viewmap=view&lat=35&lng=139&login=true
 *
 * openDeepLink('helpapp://?viewmap=view&lat=35&lng=139&login=true', {
 *   // optional values
 *   androidPackage: 'jp.ac.chuo.app.machinaka',
 *   androidFallbackUrl: 'https://play.google.com/store/apps/details?id=jp.ac.chuo.app.machinaka',
 *   iosFallbackUrl: 'https://apps.apple.com/app/your-app-id',
 *   timeout: 1500, // milliseconds
 * }).then((result) => {
 *   // result: 'opened' | 'fallback' | 'unsupported'
 * });
 */

export type OpenAppResult = "opened" | "fallback" | "unsupported";

export type OpenAppOptions = {
  // Android native package id. Defaulted to the Android package we have in the project.
  // Replace if your real package differs.
  androidPackage?: string;

  // Fallback URLs if the app is not installed (optional).
  // If not provided, we will attempt to use PlayStore URL for Android when androidPackage is available
  androidFallbackUrl?: string;
  iosFallbackUrl?: string;
  // Time to wait for the page to go hidden (defaults to 1500 ms)
  timeout?: number;

  // Whether to use Android Intent format when attempting open on Android (defaults to true).
  useIntentForAndroid?: boolean;

  // Debug flag to log some details (optional).
  debug?: boolean;
};

// A tiny helper - if we're rendering on the server, we can't interact with window.
const isBrowser =
  typeof window !== "undefined" && typeof document !== "undefined";

/**
 * buildIntentUrl
 *
 * Helper to create an Android intent:// url from a deep link.
 * For example:
 *   helpapp://?viewmap=view -> intent://?viewmap=view#Intent;scheme=helpapp;package=jp.ac.chuo.app.machinaka;end
 */
export function buildIntentUrl(deepLink: string, packageName: string) {
  try {
    const scheme = deepLink.split(":")[0] || "helpapp";
    // Remove scheme:// prefix
    const afterScheme = deepLink.replace(/^[a-zA-Z][\w+.-]*:\/\//, "");
    // Build intent URL
    return `intent://${afterScheme}#Intent;scheme=${scheme};package=${packageName};end`;
  } catch (e) {
    return "";
  }
}

// Ensure the deep link has a host so the installed app's intent-filter matches.
// Default host is the production website host used in the Android manifest,
// this mirrors the `Authority` entries registered in the app.
function ensureHostForDeepLink(
  deepLink: string,
  defaultHost = "helpapp-website.vercel.app",
) {
  try {
    const m = deepLink.match(/^([a-zA-Z][\w+.-]*):\/\/([^/?#]*)(.*)$/);
    if (!m) {
      return deepLink;
    }
    const scheme = m[1];
    const host = m[2];
    const rest = m[3] || "";
    if (!host || host === "") {
      return `${scheme}://${defaultHost}${rest}`;
    }
    return deepLink;
  } catch (err) {
    return deepLink;
  }
}

/**
 * openDeepLink
 *
 * Cross-platform opener that tries to open an app from a deep link.
 * Detects if the app likely opened (by checking page visibility) and triggers fallback otherwise.
 *
 * Notes:
 * - Should be called from a user gesture (like button click). Browsers often block non-user initiated navigation to custom schemes.
 * - The open-detection is heuristic. It's commonly implemented using a timeout + visibility changes.
 *
 * Returns:
 * - 'opened'  => The page likely lost visibility shortly after opening the link (app opened)
 * - 'fallback' => The app didn't open within the timeout, we performed fallback redirect (if a URL was configured) or the user remained on the page
 * - 'unsupported' => Not running in a browser environment (SSR)
 */
export async function openDeepLink(
  deepLink: string,
  options?: OpenAppOptions,
): Promise<OpenAppResult> {
  if (!isBrowser) {
    return "unsupported";
  }
  const {
    androidPackage = "jp.ac.chuo.app.machinaka",
    androidFallbackUrl,
    iosFallbackUrl,
    timeout = 1500,
    useIntentForAndroid = true,
    debug = false,
  } = options || {};

  const ua = navigator.userAgent || "";
  const isAndroid = /android/i.test(ua);
  const isiOS = /iPhone|iPad|iPod/i.test(ua);

  // Default Play Store URL for Android if androidPackage is present
  const defaultAndroidStore = androidPackage
    ? `https://play.google.com/store/apps/details?id=${androidPackage}`
    : undefined;

  const fallbackForAndroid = androidFallbackUrl || defaultAndroidStore;

  // Guard a little: ensure this is a deep link
  if (!deepLink || !deepLink.includes("://")) {
    if (debug)
      console.warn("openDeepLink: Invalid deep link passed:", deepLink);
    return "unsupported";
  }

  const scheme = deepLink.split(":")[0];

  if (debug) {
    console.debug("[openDeepLink] platform", { isAndroid, isiOS });
    console.debug("[openDeepLink] deeplink", deepLink);
  }

  let timer: number | undefined = undefined;
  let resolved = false;
  let intentAttemptTimer: number | undefined = undefined;

  return new Promise<OpenAppResult>((resolve) => {
    // Clean up listeners/timeouts
    function cleanup() {
      if (timer) {
        window.clearTimeout(timer);
      }
      document.removeEventListener("visibilitychange", onVisibilityChanged);
      window.removeEventListener("pagehide", onPageHide);
      window.removeEventListener("blur", onWindowBlur);
    }

    // If the document becomes hidden, it's likely the app opened (or user switched tabs).
    function onVisibilityChanged() {
      if (document.visibilityState === "hidden") {
        resolved = true;
        cleanup();
        if (debug)
          console.debug("[openDeepLink] visibilitychange -> app likely opened");
        resolve("opened");
      }
    }

    // `pagehide` is also useful on some mobile browsers/Android.
    function onPageHide() {
      resolved = true;
      cleanup();
      if (debug) console.debug("[openDeepLink] pagehide -> app likely opened");
      resolve("opened");
    }

    // Some mobile browsers trigger blur on window when opening an app
    function onWindowBlur() {
      // We don't resolve immediately on blur only; but it's a helpful signal.
      resolved = true;
      cleanup();
      if (debug) console.debug("[openDeepLink] blur -> app likely opened");
      resolve("opened");
    }

    document.addEventListener("visibilitychange", onVisibilityChanged);
    window.addEventListener("pagehide", onPageHide);
    window.addEventListener("blur", onWindowBlur);

    // Prepare the URL we'll actually try first.
    // Normalize host for Android to a host the app is registered to accept (helpapp-website.vercel.app),
    // because the Activity resolver shows host-based registration for helpapp scheme.
    const normalizedDeep = isAndroid
      ? ensureHostForDeepLink(deepLink, "helpapp-website.vercel.app")
      : deepLink;
    const normalizedIntent =
      isAndroid && useIntentForAndroid && androidPackage
        ? buildIntentUrl(normalizedDeep, androidPackage)
        : "";

    // First try the (normalized) custom scheme directly (works in many browsers)
    tryOpen(normalizedDeep);

    // After a short delay, try the intent:// variant on Android/Chrome.
    if (normalizedIntent) {
      intentAttemptTimer = window.setTimeout(() => {
        if (resolved) return;
        tryOpen(normalizedIntent);
      }, 350);
    }

    // Function to actually try to open the URL in various ways
    function tryOpen(url: string) {
      if (debug) console.debug("[openDeepLink] tryOpen", url);
      // Best-effort: location.assign will usually work if called from a user gesture
      try {
        // We try to use location.href first in order to keep the navigation within the same tab
        window.location.href = url;
        return;
      } catch (e) {
        // some browsers may throw for non-HTTP protocols; fallback to anchor click
      }
      // Fallback: create a hidden anchor and click it (sometimes works for custom schemes)
      try {
        const a = document.createElement("a");
        a.href = url;
        a.style.display = "none";
        // open in same tab; not target blank to avoid popup blockers
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } catch (e) {
        if (debug) console.debug("[openDeepLink] anchor fallback failed", e);
      }
      // Last resort: create an iframe and set src (works in some older browsers)
      try {
        const iframe = document.createElement("iframe");
        iframe.style.display = "none";
        iframe.src = url;
        document.body.appendChild(iframe);
        setTimeout(() => {
          try {
            document.body.removeChild(iframe);
          } catch (e) {}
        }, 2000);
      } catch (e) {
        if (debug) console.debug("[openDeepLink] iframe fallback failed", e);
      }
    }

    // Start attempt
    // Start attempt was already executed above with the normalizedDeep/intent attempts

    // Setup fallback timer - if the app didn't open within `timeout`, use fallback (if any)
    timer = window.setTimeout(() => {
      if (resolved) {
        return; // already opened
      }
      cleanup();
      if (debug)
        console.debug(
          "[openDeepLink] timeout reached, performing fallback if available",
        );

      // Attempt platform-appropriate fallback
      if (isAndroid && fallbackForAndroid) {
        // On Android, the PlayStore fallback might be covered by intent scheme already (so this is a secondary fallback)
        window.location.href = fallbackForAndroid;
        resolve("fallback");
        return;
      }

      if (isiOS && iosFallbackUrl) {
        window.location.href = iosFallbackUrl;
        resolve("fallback");
        return;
      }

      // No fallback - we just resolve fallback, letting the caller decide what to display
      resolve("fallback");
    }, timeout);
  });

  process.env.NODE_ENV === "development" && console.log("openDeepLink called");
}

// Default export for convenience
export default openDeepLink;
