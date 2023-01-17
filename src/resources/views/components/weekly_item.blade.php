<div class="weekly">
  <div class="weekly__period row">
    <p class="text-end">
      {{ $week['period']['start_day']->format('Y-m-d') }} ~  {{ $week['period']['end_day']->format('Y-m-d') }}
    </p>
  </div>
  <div class="weekly__ratio row">
    @isset($week['section'])
    <ul class="weekly__ratio-header d-flex">
      @for ($i = 1; $i <= 4; $i++)
        @isset($week['section'][$i])
        <li class="section" style={{ "width:" . $week['section'][$i] ."%"}}>
        @else
        <li class="section" style="width: 0%">
        @endisset
          <div class="d-flex justify-content-between">
            @if($week['section'][$i] !== 0)
            <p class="section__name px-3">領域{{ $i }}</p>
            <p class="section__percent px-3">{{ round($week['section'][$i])}} %</p>
            @endif
          </div>
          <div class={{ "section__ratio__" . $i}}></div>
        </li>
      @endfor
    </ul>
    @else
    <p>It seems there is no data...</p>
    @endisset
  </div>
</div>
