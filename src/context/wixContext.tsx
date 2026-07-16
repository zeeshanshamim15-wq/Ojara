"use client";

import {
  createClient,
  OAuthStrategy,
  EMPTY_TOKENS,
  type Tokens,
  type TokenStorage,
} from "@wix/sdk";
import { products, collections } from "@wix/stores";
import { checkout, currentCart, orders } from "@wix/ecom";
import { members } from "@wix/members";
import { redirects } from "@wix/redirects";
import Cookies from "js-cookie";
import { createContext, type ReactNode } from "react";

// Persist the refresh token in a cookie so a visitor's cart/session survives a
// reload. The SDK has no token-change *event* — `tokenStorage` IS the hook: the
// strategy calls setTokens() itself whenever tokens are issued or renewed.
// (An earlier revision called wixClient.auth.onChange(), which does not exist on
// IOAuthStrategy in @wix/sdk 1.21.x and threw at module load, taking down layout.)
//
// getTokens() must ALWAYS return a full Tokens object — never undefined/partial —
// so every failure path falls back to EMPTY_TOKENS. A corrupted cookie would
// otherwise make JSON.parse throw during client construction and break every Wix
// call at once (login, cart, checkout), which is why the parse is defensive.
// Tokens live in memory for the session; ONLY the refresh token is mirrored to a
// cookie so the visitor's cart survives a reload.
//
// The in-memory half is not an optimisation — it is required. getAuthHeaders()
// does: getTokens() -> (if no access token) generateVisitorTokens() -> setTokens()
// -> `Authorization: getTokens().accessToken.value`. That last call re-reads from
// THIS storage, so if getTokens() can't return the access token that setTokens()
// was just handed, the header goes out empty and every Wix call fails with
// NO_IDENTITY_IN_CONTEXT ("Authorization header is invalid"). A cookie-only
// implementation cannot round-trip the access token and silently breaks checkout.
let memoryTokens: Tokens | null = null;

const cookieTokenStorage: TokenStorage = {
  getTokens: (): Tokens => {
    if (memoryTokens) return memoryTokens;
    // First read of the session: rehydrate the refresh token from the cookie so
    // the SDK renews an access token instead of minting a brand-new visitor.
    try {
      const raw = Cookies.get("refreshToken");
      if (!raw) return EMPTY_TOKENS;
      const refreshToken = JSON.parse(raw);
      // Guard against a well-formed-JSON-but-wrong-shape cookie.
      if (!refreshToken?.value) return EMPTY_TOKENS;
      memoryTokens = { ...EMPTY_TOKENS, refreshToken };
      return memoryTokens;
    } catch {
      try {
        Cookies.remove("refreshToken");
      } catch {}
      return EMPTY_TOKENS;
    }
  },
  setTokens: (tokens: Tokens) => {
    // Keep the whole set (access token included) so getTokens() can return it.
    memoryTokens = tokens;
    // Persist only the long-lived refresh token; access tokens expire in minutes.
    if (tokens?.refreshToken?.value) {
      Cookies.set("refreshToken", JSON.stringify(tokens.refreshToken), {
        expires: 365,
      });
    }
  },
};

export const wixClient = createClient({
  modules: {
    products,
    collections,
    checkout,
    currentCart,
    orders,
    members,
    redirects,
  },
  auth: OAuthStrategy({
    clientId: process.env.NEXT_PUBLIC_WIX_CLIENT_ID!,
    // `tokens` and `tokenStorage` are mutually exclusive in the SDK types.
    tokenStorage: cookieTokenStorage,
  }),
});

export type WixClient = typeof wixClient;

export const WixClientContext = createContext<WixClient>(wixClient);

export const WixClientContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => (
  <WixClientContext.Provider value={wixClient}>
    {children}
  </WixClientContext.Provider>
);
