"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Button, Input } from "@/components/UIComponents";
import { register } from "@/query/auth";
import { AuthShell } from "./AuthShell";
import { getErrorMessage, persistAuthSession } from "./auth-utils";

export function RegisterForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "user",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const updateField =
    (field: keyof typeof form) =>
    (
      event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => {
      setForm((current) => ({ ...current, [field]: event.target.value }));
    };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await register(form);
      const persisted = persistAuthSession(response);
      router.push(persisted ? "/dashboard" : "/auth/login");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthShell
      title="Create account"
      description="Register with the role and profile details expected by the current auth API."
      footer={
        <span>
          Already have an account?{" "}
          <Link href="/auth/login" className="font-semibold text-cyan-700">
            Sign in
          </Link>
        </span>
      }
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="grid gap-5 sm:grid-cols-2">
          <Input
            label="First Name"
            placeholder="Jane"
            value={form.firstName}
            onChange={updateField("firstName")}
            required
          />
          <Input
            label="Last Name"
            placeholder="Doe"
            value={form.lastName}
            onChange={updateField("lastName")}
            required
          />
        </div>

        <Input
          label="Email"
          type="email"
          placeholder="you@company.com"
          value={form.email}
          onChange={updateField("email")}
          required
        />

        <Input
          label="Password"
          type="password"
          placeholder="Create a secure password"
          value={form.password}
          onChange={updateField("password")}
          required
        />

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <Button type="submit" className="w-full justify-center" isLoading={isLoading}>
          Create Account
        </Button>
      </form>
    </AuthShell>
  );
}
