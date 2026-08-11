<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use Illuminate\Http\Request;

class TransactionsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(Transaction::all());
    }

    /**
     * Show the form for creating a new resource.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'image_path' => ['nullable', 'string'],
        ]);

        $transaction = Transaction::create($validated);

        return response()->json($transaction, 201);
    }

    /**
     * Store a newly created resource in storage.
     */
    /*  public function store(Request $request)
    {
        //
    } */

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        return response()->json(Transaction::findOrFail($id));
    }

    /**
     * Show the form for editing the specified resource.
     */
    /* public function edit(string $id)
    {
        //
    } */

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $transaction = Transaction::findOrFail($id);

        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'image_path' => ['nullable', 'string'],
        ]);

        $transaction->update($validated);

        return response()->json($transaction);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        Transaction::findOrFail($id)->delete();

        return response()->json(null, 204);
    }
}
