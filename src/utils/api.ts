export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8811";
import { logOut } from "@/store/auth";
import type { Entries } from "type-fest";

export type APIResult<T> =
  | {
      data: T;
    }
  | {
      code: string;
      message: string;
    };

export function req<T>(
  url: string,
  config: RequestInit = {},
): Promise<APIResult<T>> {
  return fetch(url, config)
    .then((response) => response.json())
    .then((data) => data as APIResult<T>)
    .then((body) => {
      if ("code" in body) {
        throw AppErrorFromAPI(body.code, body.message);
      }

      return body;
    })
    .catch((err: AppError) => {
      // TODO: this might be too much magic
      if (err.code === "Authn") {
        logOut();
      }
      throw err;
    });
}

export const AppErrors = {
  Other: ["unknown", 500],
  Invalid: ["invalid-request", 400],
  Authn: ["authentication", 401],
  Authz: ["authorization", 403],
  NotExist: ["resource-not-found", 404],
  Exist: ["resource-already-exists", 409],
  Validation: ["validation", 422],
  Captcha: ["captcha", 422],
  RateLimiting: ["rate-limiting", 429],
  Database: ["database-query", 500],
  Service: ["internal-service-failure", 500],
} as const;

type AppErrorCode = keyof typeof AppErrors;

export class AppError extends Error {
  code: AppErrorCode;
  httpCode: number;
  constructor(code: AppErrorCode, message: string) {
    super(code, {
      cause: message,
    });
    this.code = code;
    this.httpCode = AppErrors[code][1];
  }
}

function AppErrorFromAPI(code: string, message: string) {
  const err = (Object.entries(AppErrors) as Entries<typeof AppErrors>).find(
    ([k, v]) => {
      return v[0] === code;
    },
  ) satisfies [string, (typeof AppErrors)[AppErrorCode]] | undefined;

  if (!err) {
    return new AppError("Other", message);
  }

  return new AppError(err[0], message);
}
