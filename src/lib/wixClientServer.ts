import { OAuthStrategy, createClient } from "@wix/sdk";
import { collections, products } from "@wix/stores";
import { checkout, orders } from "@wix/ecom";
import { members } from "@wix/members";
import { cookies } from "next/headers";

// Identity client: "who is this member?". Reads the refreshToken cookie the auth
// flow persisted, so server components can resolve the logged-in member.
//
// NOTE: `cookies()` is async in Next 16 (it was sync when this bundle was
// written). Without the await, `.get()` would be read off a Promise.
export const wixClientServer = async () => {
  let refreshToken;

  try {
    const cookieStore = await cookies();
    refreshToken = JSON.parse(cookieStore.get("refreshToken")?.value || "{}");
  } catch {
    refreshToken = {};
  }

  return createClient({
    modules: { products, collections, orders, checkout, members },
    auth: OAuthStrategy({
      clientId: process.env.NEXT_PUBLIC_WIX_CLIENT_ID!,
      tokens: {
        refreshToken,
        accessToken: { value: "", expiresAt: 0 },
      },
    }),
  });
};
