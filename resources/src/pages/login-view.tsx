import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { selectNeedsSms, useAuthStore } from "../auth/auth-store";

const LoginView = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [remember, setRemember] = useState(false);
    const [code, setCode] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const login = useAuthStore((s) => s.login);
    const verifySms = useAuthStore((s) => s.verifySms);
    const loading = useAuthStore((s) => s.loading);
    const error = useAuthStore((s) => s.error);
    const needsSms = useAuthStore(selectNeedsSms);

    const inputClass =
        "w-full rounded border border-gray-300 p-2 focus:border-blue-500 focus:outline-none";
    const buttonClass =
        "w-full rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50";

    const handleLogin = async (e: FormEvent) => {
        e.preventDefault();
        await login({ email, password, remember });
        setCode("");
    };

    const handleVerifySms = async (e: FormEvent) => {
        e.preventDefault();
        const ok = await verifySms(code);
        if (ok) setCode("");
    };

    // Re-issue the SMS code using the credentials still held in the form.
    const resend = () => login({ email, password, remember });

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-md rounded-lg border bg-white p-8 shadow-sm">
                {needsSms ? (
                    <form onSubmit={handleVerifySms} className="space-y-4">
                        <h1 className="mb-2 text-center text-2xl font-bold">
                            Two-factor authentication
                        </h1>
                        <p className="text-sm text-gray-600">
                            A 6-digit code was sent to your phone. Enter it
                            below to finish signing in.
                        </p>
                        <input
                            type="text"
                            inputMode="numeric"
                            maxLength={6}
                            required
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            className={inputClass}
                            placeholder="6-digit code"
                        />
                        {error && (
                            <p className="text-sm text-red-600">{error}</p>
                        )}
                        <button
                            type="submit"
                            disabled={loading}
                            className={buttonClass}
                        >
                            {loading ? "Verifying…" : "Verify code"}
                        </button>
                        <button
                            type="button"
                            onClick={resend}
                            disabled={loading}
                            className="w-full rounded border border-gray-300 px-4 py-2 text-sm text-gray-700"
                        >
                            Resend code
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleLogin} className="space-y-4">
                        <h1 className="mb-6 text-center text-2xl font-bold">
                            Sign in
                        </h1>

                        <div>
                            <label className="mb-1 block text-sm">Email</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={inputClass}
                                placeholder="you@example.com"
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    className={`${inputClass} pr-10`}
                                    placeholder="Password"
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword((v) => !v)
                                    }
                                    aria-label={
                                        showPassword
                                            ? "Hide password"
                                            : "Show password"
                                    }
                                    className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-gray-500 hover:text-gray-700"
                                >
                                    {showPassword ? (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth={2}
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"
                                            />
                                        </svg>
                                    ) : (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth={2}
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                            />
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                            />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        <label className="flex items-center gap-2 text-sm">
                            <input
                                type="checkbox"
                                checked={remember}
                                onChange={(e) => setRemember(e.target.checked)}
                            />
                            Remember me
                        </label>

                        {error && (
                            <p className="text-sm text-red-600">{error}</p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className={buttonClass}
                        >
                            {loading ? "Signing in…" : "Sign in"}
                        </button>

                        <p className="text-center text-sm text-gray-600">
                            Don't have an account?{" "}
                            <Link
                                to="/register"
                                className="font-semibold text-blue-600"
                            >
                                Create one
                            </Link>
                        </p>
                    </form>
                )}
            </div>
        </div>
    );
};

export default LoginView;
