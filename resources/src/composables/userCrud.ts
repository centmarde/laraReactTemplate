import { useCallback, useEffect, useState, type FormEvent } from "react";

export interface User {
    id: number;
    name: string;
    password: string;
    email: string;
    created_at: string;
    updated_at: string;
}

export interface UserForm {
    name: string;
    password: string;
    email: string;
}

export function useUserCrud() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Form state (used for both create and edit)
    const [editingId, setEditingId] = useState<number | null>(null);
    const [form, setForm] = useState<UserForm>({
        name: "",
        password: "",
        email: "",
    });
    const [saving, setSaving] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("/api/users"); // GET /api/users
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = (await res.json()) as User[];
            setUsers(data);
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Failed to load users",
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const resetForm = () => {
        setEditingId(null);
        setForm({ name: "", password: "", email: "" });
        setFormError(null);
    };

    const handleFieldChange = (field: keyof UserForm, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setFormError(null);

        try {
            if (editingId !== null) {
                // Update existing user
                const res = await fetch(`/api/users/${editingId}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(form),
                });
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
            } else {
                // Create new user
                const res = await fetch("/api/users", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(form),
                });
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
            }
            resetForm();
            await fetchUsers();
        } catch (err) {
            setFormError(
                err instanceof Error ? err.message : "Failed to save user",
            );
        } finally {
            setSaving(false);
        }
    };

    const startEdit = (user: User) => {
        setEditingId(user.id);
        setForm({
            name: user.name,
            password: "", // Password is not returned for security reasons
            email: user.email,
        });
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this user?")) return;
        try {
            const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            await fetchUsers();
        } catch (err) {
            alert(err instanceof Error ? err.message : "Failed to delete user");
        }
    };

    return {
        users,
        loading,
        error,
        form,
        editingId,
        saving,
        formError,
        fetchUsers,
        handleSubmit,
        handleFieldChange,
        resetForm,
        startEdit,
        handleDelete,
    };
}
