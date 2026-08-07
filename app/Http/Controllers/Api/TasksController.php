<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Task;
use Illuminate\Http\Request;

class TasksController extends Controller
{
    /**
     * GET /api/tasks - List all tasks.
     */
    public function index()
    {
        return response()->json(Task::all());
    }

    /**
     * POST /api/tasks - Store a newly created task.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'user_id' => ['required', 'exists:users,id'],
        ]);

        $task = Task::create($validated);

        return response()->json($task, 201);
    }

    /**
     * GET /api/tasks/{task} - Display a single task.
     */
    public function show(string $id)
    {
        return response()->json(Task::findOrFail($id));
    }

    /**
     * PUT/PATCH /api/tasks/{task} - Update a task.
     */
    public function update(Request $request, string $id)
    {
        $task = Task::findOrFail($id);

        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
        ]);

        $task->update($validated);

        return response()->json($task);
    }

    /**
     * DELETE /api/tasks/{task} - Remove a task.
     */
    public function destroy(string $id)
    {
        Task::findOrFail($id)->delete();

        return response()->json(null, 204);
    }
}
