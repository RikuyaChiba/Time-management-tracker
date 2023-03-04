@extends('layouts.master')

@section('contents')
  <button id='apiTrigger' class='api_button' style='height: 50px'>call api!</button>
@endsection

<script>
  document.addEventListener('DOMContentLoaded', () => {
    const api_btn = $('#apiTrigger');
    api_btn.on('click', () => {
      $.ajax({
        type: 'GET',
        url: 'http://localhost:3000',
        headers: {
          'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
        }
      }).done((res) => {
        console.log(res);
      }).fail(() => {
        console.log('fail');
      });
    });
  })
</script>
