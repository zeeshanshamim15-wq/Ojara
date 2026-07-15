"use client";

import { createClient, OAuthStrategy } from "@wix/sdk";
import { products, collections } from "@wix/stores";
import { checkout, currentCart, orders } from "@wix/ecom";
import { members } from "@wix/members";
import { redirects } from "@wix/redirects";
import Cookies from "js-cookie";
import { createContext, type ReactNode } from "react";

// Parse the persisted refresh token defensively. A corrupted / half-written
// cookie would otherwise make JSON.parse throw at module load, which crashes the
// entire Wix client — breaking login, cart, and every other Wix call at once.
const parseRefreshToken = () => {
  try {
    const raw = Cookies.get("refreshToken");
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    try {
      Cookies.remove("refreshToken");
    } catch {}
    return {};
  }
};

const wixClient = createClient({
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
    tokens: {
      refreshToken: parseRefreshToken(),
      accessToken: { value: "", expiresAt: 0 },
    },
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
