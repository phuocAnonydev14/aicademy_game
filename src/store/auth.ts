import type { AuthOK } from "@/types/auth";
import { getDefaultStore } from "jotai";
import { RESET, atomWithStorage } from "jotai/utils";

export const atomAuth = atomWithStorage<AuthOK | null>("auth", null);
export const authStore = getDefaultStore();

export function logOut() {
  authStore.set(atomAuth, RESET);
}
