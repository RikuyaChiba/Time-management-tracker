@extends('layouts.master')

@section('title', 'statistics')

@section('contents')
  <div class="container statistics">
    <div class="row">
      <h4>Overview</h4>
    </div>
    @component('components.weekly_item',[
      'week' => $first_week
    ]);
    @endcomponent
    @component('components.weekly_item',[
      'week' => $second_week
    ]);
    @endcomponent
    @component('components.weekly_item',[
      'week' => $third_week
    ]);
    @endcomponent
    @component('components.weekly_item',[
      'week' => $fourth_week
    ]);
    @endcomponent
  </div>
@endsection
