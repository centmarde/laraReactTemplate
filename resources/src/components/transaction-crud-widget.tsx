import { useTransactionCrud } from "../composables/transactionsCrud";

const TransactionCrudView = () => {
    const {
        transactions,
        transactionUsers,
        users,
        loading,
        error,
        editingId,
        form,
        saving,
        formError,
        fetchTransactionswithUsers,
        handleSubmit,
        handleFieldChange,
        resetForm,
        startEdit,
        handleDelete,
        tuEditingId,
        tuForm,
        tuSaving,
        tuFormError,
        resetTransactionUserForm,
        handleTransactionUserFieldChange,
        handleTransactionUserSubmit,
        startTransactionUserEdit,
        handleTransactionUserDelete,
    } = useTransactionCrud();

    const inputClass =
        "w-full rounded border border-gray-300 p-2 focus:border-blue-500 focus:outline-none";

    return (
        <div>
            <h1 className="text-center">Transactions CRUD View</h1>

            <div className="space-y-8 p-4">
                {/* ------------------- Transactions ------------------- */}
                <div>
                    <h2 className="mb-3 text-lg font-semibold">Transactions</h2>

                    {/* Create / Edit form */}
                    <form
                        onSubmit={handleSubmit}
                        className="mb-4 space-y-3 rounded border p-4"
                    >
                        <h3 className="text-base font-semibold">
                            {editingId !== null
                                ? `Edit Transaction #${editingId}`
                                : "New Transaction"}
                        </h3>

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
                                placeholder="Transaction name"
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm">
                                Description
                            </label>
                            <textarea
                                rows={3}
                                value={form.description}
                                onChange={(e) =>
                                    handleFieldChange(
                                        "description",
                                        e.target.value,
                                    )
                                }
                                className={inputClass}
                                placeholder="Optional description"
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm">
                                Image Path
                            </label>
                            <input
                                type="text"
                                value={form.image_path}
                                onChange={(e) =>
                                    handleFieldChange("image_path", e.target.value)
                                }
                                className={inputClass}
                                placeholder="Optional image path"
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
                                      ? "Update Transaction"
                                      : "Create Transaction"}
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
                            onClick={fetchTransactionswithUsers}
                        >
                            Reload
                        </button>
                        {loading && <span>Loading…</span>}
                        {error && <span className="text-red-600">{error}</span>}
                    </div>

{/* List of transactions */}
                    <ul className="space-y-2">
                        {transactions.map((transaction) => (
                            <li
                                key={transaction.id}
                                className="flex items-center justify-between rounded border p-3"
                            >
                                <div>
                                    <div className="font-semibold">
                                        #{transaction.id} {transaction.name}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        {transaction.description || "—"}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        {transaction.image_path || "—"}
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => startEdit(transaction)}
                                        className="rounded bg-yellow-500 px-3 py-1 text-white"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(transaction.id)}
                                        className="rounded bg-red-600 px-3 py-1 text-white"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>

                    {!loading && transactions.length === 0 && !error && (
                        <p className="text-gray-500">No transactions found.</p>
                    )}
                </div>

                {/* ------------------- Transaction Users ------------------- */}
                <div>
                    <h2 className="mb-3 text-lg font-semibold">
                        Transaction Users
                    </h2>

{/* Create / Edit form */}
                    <form
                        onSubmit={handleTransactionUserSubmit}
                        className="mb-4 space-y-3 rounded border p-4"
                    >
                        <h3 className="text-base font-semibold">
                            {tuEditingId !== null
                                ? `Edit Transaction User #${tuEditingId}`
                                : "New Transaction User"}
                        </h3>

                        <div>
                            <label className="mb-1 block text-sm">
                                Transaction
                            </label>
                            <select
                                required
                                value={tuForm.transaction_id}
                                onChange={(e) =>
                                    handleTransactionUserFieldChange(
                                        "transaction_id",
                                        e.target.value,
                                    )
                                }
                                className={inputClass}
                            >
                                <option value="" disabled>
                                    Select a transaction
                                </option>
                                {transactions.map((transaction) => (
                                    <option
                                        key={transaction.id}
                                        value={transaction.id}
                                    >
                                        #{transaction.id} {transaction.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="mb-1 block text-sm">User</label>
                            <select
                                required
                                value={tuForm.user_id}
                                onChange={(e) =>
                                    handleTransactionUserFieldChange(
                                        "user_id",
                                        e.target.value,
                                    )
                                }
                                className={inputClass}
                            >
                                <option value="" disabled>
                                    Select a user
                                </option>
                                {users.map((user) => (
                                    <option key={user.id} value={user.id}>
                                        {user.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {tuFormError && (
                            <p className="text-sm text-red-600">{tuFormError}</p>
                        )}

                        <div className="flex gap-2">
                            <button
                                type="submit"
                                disabled={tuSaving}
                                className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
                            >
                                {tuSaving
                                    ? "Saving…"
                                    : tuEditingId !== null
                                      ? "Update Transaction User"
                                      : "Attach Transaction User"}
                            </button>
                            {tuEditingId !== null && (
                                <button
                                    type="button"
                                    onClick={resetTransactionUserForm}
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
                            onClick={fetchTransactionswithUsers}
                        >
                            Reload
                        </button>
                        {error && <span className="text-red-600">{error}</span>}
                    </div>

                    <ul className="space-y-2">
                        {transactionUsers.map((transactionUser) => (
                            <li
                                key={transactionUser.id}
                                className="flex items-center justify-between rounded border p-3"
                            >
                                <div>
                                    <div className="font-semibold">
                                        #{transactionUser.id} — Transaction #
                                        {transactionUser.transaction_id}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        {transactionUser.user
                                            ? `User: ${transactionUser.user.name}`
                                            : `User #${transactionUser.user_id}`}
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() =>
                                            startTransactionUserEdit(
                                                transactionUser,
                                            )
                                        }
                                        className="rounded bg-yellow-500 px-3 py-1 text-white"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() =>
                                            handleTransactionUserDelete(
                                                transactionUser.id,
                                            )
                                        }
                                        className="rounded bg-red-600 px-3 py-1 text-white"
                                    >
                                        Detach
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>

                    {!error && transactionUsers.length === 0 && (
                        <p className="text-gray-500">
                            No transaction users found.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TransactionCrudView;