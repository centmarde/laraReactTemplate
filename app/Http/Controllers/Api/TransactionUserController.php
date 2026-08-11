<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\TransactionUser;

class TransactionUserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $transactionUsers = TransactionUser::with([
            'transaction',
            'user'
        ])->get();

        return response()->json(TransactionUser::with('user:id,name')->get());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
         $validated = $request->validate([
            'transaction_id' => 'required|exists:transactions,id',
            'user_id' => 'required|exists:users,id',
        ]);

        $transactionUser = TransactionUser::create($validated);

        return response()->json([
            'message' => 'Transaction user created successfully.',
            'data' => $transactionUser->load([
                'transaction',
                'user'
            ]),
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(TransactionUser $transactionUser)
    {
        return response()->json(
            $transactionUser->load([
                'transaction',
                'user'
            ])
        );
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, TransactionUser $transactionUser)
    {
        $validated = $request->validate([
            'transaction_id' => 'required|exists:transactions,id',
            'user_id' => 'required|exists:users,id',
        ]);

        $transactionUser->update($validated);

        return response()->json([
            'message' => 'Transaction user updated successfully.',
            'data' => $transactionUser->load([
                'transaction',
                'user'
            ]),
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(TransactionUser $transactionUser)
    {
         $transactionUser->delete();

        return response()->json([
            'message' => 'Transaction user deleted successfully.',
        ]);
    }
}
