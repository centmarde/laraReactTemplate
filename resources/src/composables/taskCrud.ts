import { useCallback, useEffect, useState, type FormEvent } from "react";

export interface Task {
    id: number;
    user_id: number;
    name: string;
    description: string;
    created_at: string;
    updated_at: string;
}

export interface TaskForm {
    user_id: string;
    name: string;
    description: string;
}

export function useTaskCrud() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Form state (used for both create and edit)
    const [editingId, setEditingId] = useState<number | null>(null);
    const [form, setForm] = useState<TaskForm>({
        user_id: "",
        name: "",
        description: "",
    });
    const [saving, setSaving] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);

    const fetchTasks = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("/api/tasks"); // GET /api/tasks
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = (await res.json()) as Task[];
            setTasks(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load tasks");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    const resetForm = () => {
        setEditingId(null);
        setForm({ user_id: "", name: "", description: "" });
        setFormError(null);
    };

    const handleFieldChange = (field: keyof TaskForm, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    // POST /api/tasks  or  PUT /api/tasks/{id}
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setFormError(null);

        const isEditing = editingId !== null;
        const url = isEditing ? `/api/tasks/${editingId}` : "/api/tasks";

        try {
            const res = await fetch(url, {
                method: isEditing ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    user_id: Number(form.user_id),
                    name: form.name,
                    description: form.description,
                }),
            });

            if (!res.ok) {
                const body = await res.json().catch(() => null);
                const msg = body?.message ?? `HTTP ${res.status}`;
                throw new Error(msg);
            }

            resetForm();
            await fetchTasks();
        } catch (err) {
            setFormError(err instanceof Error ? err.message : "Save failed");
        } finally {
            setSaving(false);
        }
    };

    // Load a task into the form for editing
    const startEdit = (task: Task) => {
        setEditingId(task.id);
        setForm({
            user_id: String(task.user_id),
            name: task.name,
            description: task.description,
        });
        setFormError(null);
    };

    // DELETE /api/tasks/{id}
    const handleDelete = async (id: number) => {
        if (!window.confirm("Delete this task?")) return;

        try {
            const res = await fetch(`/api/tasks/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            if (editingId === id) resetForm();
            await fetchTasks();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Delete failed");
        }
    };

    return {
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
    };
}

