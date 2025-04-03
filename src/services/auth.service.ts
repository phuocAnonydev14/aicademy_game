import { atomAuth, authStore } from "@/store/auth";
import type { AuthOK, User, UserOther } from "@/types/auth";
import { API_URL } from "@/utils/api";
import { type APIResult, AppError, req } from "@/utils/api";
import {
  type UseQueryResult,
  skipToken,
  useQuery,
} from "@tanstack/react-query";
import { useAtomValue } from "jotai";

export function renderGoogleSignIn(target: HTMLElement | null) {
  if (!target || !window.google?.accounts?.id) {
    return;
  }

  window.google.accounts.id.renderButton(target, {
    type: "standard",
    theme: "outline",
    size: "large",
    text: "signin_with",
    shape: "pill",
    width: target.clientWidth,
  });
}

export function loginWithGoogle({ credential }: { credential: string }) {
  return req<AuthOK>(`${API_URL}/auth/social/google`, {
    method: "POST",
    body: JSON.stringify({
      id_token: credential,
    }),
    headers: {
      "content-type": "application/json",
    },
  }).then((body) => {
    if ("code" in body) {
      // TODO: unable to exchange id token for our JWT
      return body;
    }

    authStore.set(atomAuth, body.data);
    return body;
  });
}

export function loginWithEmailChallenge({ email }: { email: string }) {
  return req<string>(`${API_URL}/auth/email/login`, {
    method: "POST",
    body: JSON.stringify({
      email,
    }),
    headers: {
      "content-type": "application/json",
    },
  });
}

export function loginWithEmail({ email, otp }: { email: string; otp: string }) {
  return req<AuthOK>(`${API_URL}/auth/email/verify`, {
    method: "POST",
    body: JSON.stringify({
      email,
      code: otp,
    }),
    headers: {
      "content-type": "application/json",
    },
  }).then((body) => {
    if ("code" in body) {
      // TODO: unable to exchange id token for our JWT
      return body;
    }

    authStore.set(atomAuth, body.data);
    return body;
  });
}

export function fetchProfile(params: {
  jwt: string;
  id: string;
}): Promise<APIResult<UserOther>>;
export function fetchProfile(params: { jwt: string }): Promise<APIResult<User>>;
export function fetchProfile(params: {
  jwt: string;
  id?: string;
}): Promise<APIResult<User | UserOther>> {
  return req<typeof params extends { id: string } ? UserOther : User>(
    `${API_URL}/auth/profile${params.id ? `/${params.id}` : ""}`,
    {
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${params.jwt}`,
      },
    },
  );
}

export function useProfile(): UseQueryResult<APIResult<User>, Error>;
export function useProfile(
  id: string,
): UseQueryResult<APIResult<UserOther>, Error>;

export function useProfile(id?: string) {
  const auth = useAtomValue(atomAuth);

  return useQuery({
    queryKey: ["profile", id, auth?.jwt],
    queryFn: !auth?.jwt
      ? skipToken
      : id
        ? () => fetchProfile({ id, jwt: auth.jwt })
        : () => fetchProfile({ jwt: auth.jwt }),
    retry(failureCount, error) {
      if (error instanceof AppError && error.code === "Authn") {
        return false;
      }

      if (failureCount < 2) {
        return true;
      }

      return false;
    },
  });
}
