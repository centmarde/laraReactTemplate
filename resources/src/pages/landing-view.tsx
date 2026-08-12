import TaskCrudView from "../components/task-crud-widget";
import UserCrudView from "../components/user-crud-widget";
import TransactionCrudView from "../components/transaction-crud-widget";
import { useAuthStore } from "../auth/auth-store";

const LandingView = () => {
    const user = useAuthStore((s) => s.user);
    const logout = useAuthStore((s) => s.logout);

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="flex items-center justify-between border-b bg-white px-6 py-4">
                <h1 className="text-xl font-bold">Landing View</h1>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600">
                        {user?.name || user?.email}
                    </span>
                    <button
                        type="button"
                        onClick={logout}
                        className="rounded bg-red-600 px-4 py-2 text-white"
                    >
                        Logout
                    </button>
                </div>
            </header>

            <div className="mx-auto grid max-w-6xl gap-8 px-4 pb-8 lg:grid-cols-2">
                <section className="rounded border bg-white p-4 shadow-sm">
                    <TaskCrudView />
                </section>
                <section className="rounded border bg-white p-4 shadow-sm">
                    <UserCrudView />
                </section>
                <section className="rounded border bg-white p-4 shadow-sm">
                    <TransactionCrudView />
                </section>
            </div>
        </div>
    );
};

export default LandingView;
export { TaskCrudView, UserCrudView, TransactionCrudView };
