import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../auth/auth-store";

interface RegisterFormState {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    password_confirmation: string;
    is_2fa_enabled: boolean;
}

const RegisterView = () => {
    const [form, setForm] = useState<RegisterFormState>({
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        password_confirmation: "",
        is_2fa_enabled: false,
    });

    const register = useAuthStore((s) => s.register);
    const loading = useAuthStore((s) => s.loading);
    const error = useAuthStore((s) => s.error);

    const inputClass =
        "w-full rounded border border-gray-300 p-2 focus:border-blue-500 focus:outline-none";
    const buttonClass =
        "w-full rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50";

    const set = (field: keyof RegisterFormState, value: string | boolean) =>
        setForm((prev) => ({ ...prev, [field]: value }));

    const handleRegister = async (e: FormEvent) => {
        e.preventDefault();
        await register(form);
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-md rounded-lg border bg-white p-8 shadow-sm">
                <form onSubmit={handleRegister} className="space-y-4">
                    <h1 className="mb-6 text-center text-2xl font-bold">
                        Create an account
                    </h1>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="mb-1 block text-sm">
                                First name
                            </label>
                            <input
                                type="text"
                                required
                                value={form.firstname}
                                onChange={(e) =>
                                    set("firstname", e.target.value)
                                }
                                className={inputClass}
                                placeholder="John"
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-sm">
                                Last name
                            </label>
                            <input
                                type="text"
                                required
                                value={form.lastname}
                                onChange={(e) =>
                                    set("lastname", e.target.value)
                                }
                                className={inputClass}
                                placeholder="Doe"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="mb-1 block text-sm">Email</label>
                        <input
                            type="email"
                            required
                            value={form.email}
                            onChange={(e) => set("email", e.target.value)}
                            className={inputClass}
                            placeholder="you@example.com"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm">Password</label>
                        <input
                            type="password"
                            required
                            minLength={8}
                            value={form.password}
                            onChange={(e) => set("password", e.target.value)}
                            className={inputClass}
                            placeholder="At least 8 characters"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm">
                            Confirm password
                        </label>
                        <input
                            type="password"
                            required
                            value={form.password_confirmation}
                            onChange={(e) =>
                                set("password_confirmation", e.target.value)
                            }
                            className={inputClass}
                            placeholder="Repeat password"
                        />
                    </div>

                    <label className="flex items-center gap-2 text-sm">
                        <input
                            type="checkbox"
                            checked={form.is_2fa_enabled}
                            onChange={(e) =>
                                set("is_2fa_enabled", e.target.checked)
                            }
                        />
                        Enable two-factor authentication (SMS code on new
                        devices)
                    </label>

                    {error && <p className="text-sm text-red-600">{error}</p>}

                    <button
                        type="submit"
                        disabled={loading}
                        className={buttonClass}
                    >
                        {loading ? "Creating account…" : "Register"}
                    </button>

                    <p className="text-center text-sm text-gray-600">
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            className="font-semibold text-blue-600"
                        >
                            Sign in
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default RegisterView;
