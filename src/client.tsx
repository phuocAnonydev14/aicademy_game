import { loginWithGoogle } from "@/services/auth.service";
/// <reference types="vinxi/types/client" />
import { hydrateRoot } from "react-dom/client";
import { StartClientPromise } from "./components/StartClientPromise";
import { createRouter } from "./router";
import { atomAuth, authStore } from "./store/auth";

const router = createRouter();

hydrateRoot(
  document,
  <StartClientPromise
    store={authStore}
    router={router}
    onResolved={() => {
      const clientID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";
      if (!clientID || !window.google.accounts) {
        return;
      }

      window.google.accounts.id.initialize({
        client_id: clientID,
        callback: (resp) => {
          loginWithGoogle({ credential: resp.credential });
        },
      });
    }}
  />
);
