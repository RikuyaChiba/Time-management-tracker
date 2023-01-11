<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\DashBoardController;
use App\Http\Controllers\StatisticsController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', [DashBoardController::class, 'index'])->name('dashboard');
Route::get('/statistics', [StatisticsController::class, 'index'])->name('statistics');
