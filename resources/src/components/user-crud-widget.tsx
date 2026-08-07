import { useUserCrud } from "../composables/userCrud";

const UserCrudView = () => {
    const {
        users,
        loading,
        error,
        editingId,
        form,
        saving,
        formError,
        fetchUsers,
        handleSubmit,
        handleFieldChange,
        resetForm,
        startEdit,
        handleDelete,
    } = useUserCrud();

    const inputClass =
        "w-full rounded border border-gray-300 p-2 focus:border-blue-500 focus:outline-none";

    return (
        <div>
            <h1 className="text-center">Users CRUD View</h1>

            <div className="mx-auto max-w-2xl p-4">
                {/* Create / Edit form */}
                <form
                    onSubmit={handleSubmit}
                    className="mb-6 space-y-3 rounded border p-4"
                >
                    <h2 className="text-lg font-semibold">
                        {editingId !== null
                            ? `Edit User #${editingId}`
                            : "New User"}
                    </h2>

                    <div>
                        <label className="mb-1 block text-sm">Name</label>
                        <input
                            type="text"
                            required
                            value={form.name}
                            onChange={(e) =>
                                handleFieldChange("name", e.target.value)
                            }
                            className={inputClass}
                            placeholder="User name"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm">Email</label>
                        <input
                            type="email"
                            required
                            value={form.email}
                            onChange={(e) =>
                                handleFieldChange("email", e.target.value)
                            }
                            className={inputClass}
                            placeholder="user@example.com"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm">Password</label>
                        <input
                            type="password"
                            required={editingId === null}
                            value={form.password}
                            onChange={(e) =>
                                handleFieldChange("password", e.target.value)
                            }
                            className={inputClass}
                            placeholder={
                                editingId !== null
                                    ? "Leave blank to keep current"
                                    : "Password"
                            }
                        />
                    </div>

                    {formError && (
                        <p className="text-sm text-red-600">{formError}</p>
                    )}

                    <div className="flex gap-2">
                        <button
                            type="submit"
                            disabled={saving}
                            className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
                        >
                            {saving
                                ? "Saving…"
                                : editingId !== null
                                  ? "Update User"
                                  : "Create User"}
                        </button>
                        {editingId !== null && (
                            <button
                                type="button"
                                onClick={resetForm}
                                className="rounded bg-gray-300 px-4 py-2"
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </form>

                {/* List */}
                <div className="mb-4 flex items-center gap-4">
                    <button
                        className="rounded bg-blue-600 px-4 py-2 text-white"
                        onClick={fetchUsers}
                    >
                        Reload
                    </button>
                    {loading && <span>Loading…</span>}
                    {error && <span className="text-red-600">{error}</span>}
                </div>

                <ul className="space-y-2">
                    {users.map((user) => (
                        <li
                            key={user.id}
                            className="flex items-center justify-between rounded border p-3"
                        >
                            <div>
                                <div className="font-semibold">
                                    #{user.id} {user.name}
                                </div>
                                <div className="text-sm text-gray-600">
                                    {user.email || "—"}
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => startEdit(user)}
                                    className="rounded bg-yellow-500 px-3 py-1 text-white"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(user.id)}
                                    className="rounded bg-red-600 px-3 py-1 text-white"
                                >
                                    Delete
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>

                {!loading && users.length === 0 && !error && (
                    <p className="text-gray-500">No users found.</p>
                )}
            </div>
        </div>
    );
};

export default UserCrudView;

