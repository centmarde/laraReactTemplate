import { useTaskCrud } from "../composables/taskCrud";

const CrudView = () => {
    const {
        tasks,
        loading,
        error,
        editingId,
        form,
        saving,
        formError,
        fetchTasks,
        handleSubmit,
        handleFieldChange,
        resetForm,
        startEdit,
        handleDelete,
    } = useTaskCrud();

    const inputClass =
        "w-full rounded border border-gray-300 p-2 focus:border-blue-500 focus:outline-none";

    return (
        <div>
            <h1 className="text-center">CRUD View</h1>

            <div className="mx-auto max-w-2xl p-4">
                {/* Create / Edit form */}
                <form
                    onSubmit={handleSubmit}
                    className="mb-6 space-y-3 rounded border p-4"
                >
                    <h2 className="text-lg font-semibold">
                        {editingId !== null
                            ? `Edit Task #${editingId}`
                            : "New Task"}
                    </h2>

                    <div>
                        <label className="mb-1 block text-sm">User ID</label>
                        <input
                            type="number"
                            min={1}
                            required
                            value={form.user_id}
                            onChange={(e) =>
                                handleFieldChange("user_id", e.target.value)
                            }
                            className={inputClass}
                            placeholder="e.g. 1"
                        />
                    </div>

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
                            placeholder="Task name"
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
                                handleFieldChange("description", e.target.value)
                            }
                            className={inputClass}
                            placeholder="Optional description"
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
                                  ? "Update Task"
                                  : "Create Task"}
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
                        onClick={fetchTasks}
                    >
                        Reload
                    </button>
                    {loading && <span>Loading…</span>}
                    {error && <span className="text-red-600">{error}</span>}
                </div>

                <ul className="space-y-2">
                    {tasks.map((task) => (
                        <li
                            key={task.id}
                            className="flex items-center justify-between rounded border p-3"
                        >
                            <div>
                                <div className="font-semibold">
                                    #{task.id} {task.name}
                                </div>
                                <div className="text-sm text-gray-600">
                                    {task.description || "—"}
                                </div>
                                <div className="text-xs text-gray-500">
                                    {task.user
                                        ? `Assigned to: ${task.user.name}`
                                        : `User #${task.user_id}`}
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => startEdit(task)}
                                    className="rounded bg-yellow-500 px-3 py-1 text-white"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(task.id)}
                                    className="rounded bg-red-600 px-3 py-1 text-white"
                                >
                                    Delete
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>

                {!loading && tasks.length === 0 && !error && (
                    <p className="text-gray-500">No tasks found.</p>
                )}
            </div>
        </div>
    );
};

export default CrudView;
