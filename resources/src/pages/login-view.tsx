import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { selectNeedsSms, useAuthStore } from "../auth/auth-store";

const LoginView = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [remember, setRemember] = useState(false);
    const [code, setCode] = useState("");

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
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={inputClass}
                                placeholder="Password"
                            />
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
