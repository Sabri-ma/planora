"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { login, register } from "@/services/auth";
import { ArrowLeft, Sparkles } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    password: "",
    password2: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    if (form.password !== form.password2) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      await register(form);

      await login({
        username: form.username,
        password: form.password,
      });

      router.push("/dashboard");
    } catch (err: any) {
      const data = err.response?.data;

      if (data?.username) {
        setError(data.username[0]);
      } else if (data?.email) {
        setError(data.email[0]);
      } else if (data?.password2) {
        setError(data.password2[0]);
      } else if (data?.password) {
        setError(data.password[0]);
      } else {
        setError("Could not create your account.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f8f5ef] px-6 py-8">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-[#746f67] transition hover:text-black"
        >
          <ArrowLeft size={16} />
          Back to Planora
        </Link>

        <div className="mx-auto mt-10 max-w-lg">
          <div className="mb-10 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#1f1d1a] text-white">
              <Sparkles size={20} />
            </div>

            <h1 className="mt-6 text-3xl font-semibold tracking-tight">
              Create your account
            </h1>

            <p className="mt-2 text-[#746f67]">
              Start planning your event with Planora.
            </p>
          </div>

          <div className="rounded-[28px] border border-[#e5ded3] bg-white p-7 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    First name
                  </label>

                  <input
                    type="text"
                    name="first_name"
                    value={form.first_name}
                    onChange={handleChange}
                    required
                    className="w-full rounded-2xl border border-[#ddd5ca] bg-[#fffdfa] px-4 py-3 outline-none transition focus:border-[#a98b5d]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Last name
                  </label>

                  <input
                    type="text"
                    name="last_name"
                    value={form.last_name}
                    onChange={handleChange}
                    required
                    className="w-full rounded-2xl border border-[#ddd5ca] bg-[#fffdfa] px-4 py-3 outline-none transition focus:border-[#a98b5d]"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Username
                </label>

                <input
                  type="text"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  required
                  className="w-full rounded-2xl border border-[#ddd5ca] bg-[#fffdfa] px-4 py-3 outline-none transition focus:border-[#a98b5d]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full rounded-2xl border border-[#ddd5ca] bg-[#fffdfa] px-4 py-3 outline-none transition focus:border-[#a98b5d]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Password
                </label>

                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  minLength={8}
                  className="w-full rounded-2xl border border-[#ddd5ca] bg-[#fffdfa] px-4 py-3 outline-none transition focus:border-[#a98b5d]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Confirm password
                </label>

                <input
                  type="password"
                  name="password2"
                  value={form.password2}
                  onChange={handleChange}
                  required
                  minLength={8}
                  className="w-full rounded-2xl border border-[#ddd5ca] bg-[#fffdfa] px-4 py-3 outline-none transition focus:border-[#a98b5d]"
                />
              </div>

              {error && (
                <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-[#1f1d1a] px-5 py-3 font-medium !text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Creating account..." : "Create account"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-[#746f67]">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-[#1f1d1a] underline underline-offset-4"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}