@extends('layouts.master')

@section('title', 'dashboard')

@section('contents')
  <div class="container px-5 dashboard">
    <div class="row">
      <h4>Overview</h4>
    </div>
    <div class="row gx-5 todo">
      <div class="d-flex justify-content-end">
        <h6 id="todoPeriod" class="mb-4"></h6>
      </div>
      {{-- 1 area --}}
      @component('components.todo_item', [
        'title' => '第一領域',
        'section' => config('constants.quadrant.crises')
      ])
      @endcomponent
      {{-- 2 area --}}
      @component('components.todo_item', [
        'title' => '第二領域',
        'section' => config('constants.quadrant.focus')
      ]))
      @endcomponent
      {{-- 3 area --}}
      @component('components.todo_item', [
        'title' => '第三領域',
        'section' => config('constants.quadrant.interruptions')
      ]))
      @endcomponent
      {{-- 4 area --}}
      @component('components.todo_item', [
        'title' => '第四領域',
        'section' => config('constants.quadrant.distractions')
      ]))
      @endcomponent
    </div>
  </div>
@endsection

<script type="module" src="/js/firebase.js"></script>
<script type="module" src="/js/task.js"></script>
