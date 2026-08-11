import { useCallback, useEffect, useState, type FormEvent } from "react";
import type { User } from "./userCrud";

export interface Transaction {
    id: number;
    name: string;
    description: string;
    image_path: string;
    created_at: string;
    updated_at: string;
}

export interface TransactionUsers {
    id: number;
    transaction_id: number;
    user_id: number;
    created_at: string;
    updated_at: string;
    // Eager-loaded relationship: only present when the API includes it.
    user?: {
        id: number;
        name: string;
    };
}

export interface TransactionForm {
    name: string;
    description: string;
    image_path: string;
}

export interface TransactionUserForm {
    transaction_id: string;
    user_id: string;
}

export function useTransactionCrud() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [transactionUsers, setTransactionUsers] = useState<TransactionUsers[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Transaction form state (used for both create and edit).
    const [editingId, setEditingId] = useState<number | null>(null);
    const [form, setForm] = useState<TransactionForm>({
        name: "",
        description: "",
        image_path: "",
    });
    const [saving, setSaving] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);

    // Transaction-user form state (used for both create and edit).
    const [tuEditingId, setTuEditingId] = useState<number | null>(null);
    const [tuForm, setTuForm] = useState<TransactionUserForm>({
        transaction_id: "",
        user_id: "",
    });
    const [tuSaving, setTuSaving] = useState(false);
    const [tuFormError, setTuFormError] = useState<string | null>(null);

    // GET /api/transactions
    const fetchTransactions = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("/api/transactions");
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = (await res.json()) as Transaction[];
            setTransactions(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load transactions");
        } finally {
            setLoading(false);
        }
    }, []);

    // GET /api/transaction-users
    const fetchTransactionUsers = useCallback(async () => {
        try {
            const res = await fetch("/api/transaction-users");
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = (await res.json()) as TransactionUsers[];
            setTransactionUsers(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load transaction users");
        }
    }, []);

    // GET /api/users
    const fetchUsers = useCallback(async () => {
        try {
            const res = await fetch("/api/users");
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = (await res.json()) as User[];
            setUsers(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load users");
        }
    }, []);

    // Load all lists together.
    const fetchTransactionswithUsers = useCallback(async () => {
        await Promise.all([
            fetchTransactions(),
            fetchTransactionUsers(),
            fetchUsers(),
        ]);
    }, [fetchTransactions, fetchTransactionUsers, fetchUsers]);

    useEffect(() => {
        fetchTransactionswithUsers();
    }, [fetchTransactionswithUsers]);

    const resetForm = () => {
        setEditingId(null);
        setForm({ name: "", description: "", image_path: "" });
        setFormError(null);
    };

    const handleFieldChange = (field: keyof TransactionForm, value: string) => {
        setForm((prevForm) => ({ ...prevForm, [field]: value }));
    };

    // POST /api/transactions  or  PUT /api/transactions/{id}
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setFormError(null);

        const isEditing = editingId !== null;
        const url = isEditing ? `/api/transactions/${editingId}` : "/api/transactions";

        try {
            const res = await fetch(url, {
                method: isEditing ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: form.name,
                    description: form.description,
                    image_path: form.image_path,
                }),
            });

            if (!res.ok) {
                const body = await res.json().catch(() => null);
                const msg = body?.message ?? `HTTP ${res.status}`;
                throw new Error(msg);
            }

            resetForm();
            await fetchTransactionswithUsers();
        } catch (err) {
            setFormError(err instanceof Error ? err.message : "Save failed");
        } finally {
            setSaving(false);
        }
    };

    // Load a transaction into the form for editing.
    const startEdit = (transaction: Transaction) => {
        setEditingId(transaction.id);
        setForm({
            name: transaction.name,
            description: transaction.description,
            image_path: transaction.image_path,
        });
        setFormError(null);
    };

    // DELETE /api/transactions/{id}
    const handleDelete = async (id: number) => {
        if (!window.confirm("Delete this transaction?")) return;

        try {
            const res = await fetch(`/api/transactions/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            if (editingId === id) resetForm();
            await fetchTransactionswithUsers();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Delete failed");
        }
    };

    const resetTransactionUserForm = () => {
        setTuEditingId(null);
        setTuForm({ transaction_id: "", user_id: "" });
        setTuFormError(null);
    };

    const handleTransactionUserFieldChange = (
        field: keyof TransactionUserForm,
        value: string,
    ) => {
        setTuForm((prevForm) => ({ ...prevForm, [field]: value }));
    };

    // POST /api/transaction-users  or  PUT /api/transaction-users/{id}
    const handleTransactionUserSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setTuSaving(true);
        setTuFormError(null);

        const isEditing = tuEditingId !== null;
        const url = isEditing
            ? `/api/transaction-users/${tuEditingId}`
            : "/api/transaction-users";

        try {
            const res = await fetch(url, {
                method: isEditing ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    transaction_id: Number(tuForm.transaction_id),
                    user_id: Number(tuForm.user_id),
                }),
            });

            if (!res.ok) {
                const body = await res.json().catch(() => null);
                const msg = body?.message ?? `HTTP ${res.status}`;
                throw new Error(msg);
            }

            resetTransactionUserForm();
            await fetchTransactionswithUsers();
        } catch (err) {
            setTuFormError(err instanceof Error ? err.message : "Save failed");
        } finally {
            setTuSaving(false);
        }
    };

    // Load a transaction-user into the form for editing.
    const startTransactionUserEdit = (transactionUser: TransactionUsers) => {
        setTuEditingId(transactionUser.id);
        setTuForm({
            transaction_id: String(transactionUser.transaction_id),
            user_id: String(transactionUser.user_id),
        });
        setTuFormError(null);
    };

    // DELETE /api/transaction-users/{id}
    const handleTransactionUserDelete = async (id: number) => {
        if (!window.confirm("Detach this transaction user?")) return;

        try {
            const res = await fetch(`/api/transaction-users/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            if (tuEditingId === id) resetTransactionUserForm();
            await fetchTransactionswithUsers();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Delete failed");
        }
    };

    return {
        transactions,
        transactionUsers,
        users,
        loading,
        error,
        editingId,
        form,
        saving,
        formError,
        fetchTransactions,
        fetchTransactionUsers,
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
    };
}


