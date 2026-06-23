import { sessionStorage } from "../shopify.server";
import { ApiVersion } from "@shopify/shopify-app-remix/server";
import { createAdminApiClient } from "@shopify/admin-api-client";

export async function getAdminClient() {
  const shop = process.env.SHOP;  
  const session =
    await sessionStorage.loadSession(
      `offline_${shop}`
    );

  if (!session) {
       return json(
           { error: "Offline session missing. Reinstall app." },
           { status: 401 }
         );
  }

  return createAdminApiClient({
    storeDomain: shop,
    apiVersion: ApiVersion.April25,
    accessToken: session.accessToken,
  });
}