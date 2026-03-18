"use client";

import { sessionHelper } from "@/lib/session";

type UnknownRecord = Record<string, unknown>;

function asRecord(value: unknown): UnknownRecord | null {
  return value && typeof value === "object" ? (value as UnknownRecord) : null;
}

function getString(value: unknown): string | null {
  return typeof value === "string" && value.length > 0 ? value : null;
}

export function normalizeAuthResponse(payload: unknown) {
  const root = asRecord(payload);
  const data = asRecord(root?.data);
  const tokens = asRecord(root?.tokens) ?? asRecord(data?.tokens);
  const user =
    asRecord(root?.user) ??
    asRecord(data?.user) ??
    asRecord(root?.data && !data?.tokens ? root.data : null);

  const accessToken =
    getString(root?.accessToken) ??
    getString(data?.accessToken) ??
    getString(tokens?.accessToken) ??
    getString(root?.token) ??
    getString(data?.token);

  const refreshToken =
    getString(root?.refreshToken) ??
    getString(data?.refreshToken) ??
    getString(tokens?.refreshToken);

  return {
    accessToken,
    refreshToken,
    user,
  };
}

export function persistAuthSession(payload: unknown) {
  const session = normalizeAuthResponse(payload);

  if (session.accessToken && session.refreshToken && session.user) {
    sessionHelper.setSession(
      session.accessToken,
      session.refreshToken,
      session.user,
    );
    return true;
  }

  return false;
}

export function getErrorMessage(error: unknown) {
  const axiosError = asRecord(error);
  const response = asRecord(axiosError?.response);
  const data = asRecord(response?.data);

  return (
    getString(data?.message) ??
    getString(data?.error) ??
    getString(axiosError?.message) ??
    "Something went wrong. Please try again."
  );
}
