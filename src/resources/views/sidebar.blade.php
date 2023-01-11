@section('navbar')
  <div class="sidebar">
    <div class="sidebar__logo">
      <h3>TM tracker</h3>
    </div>
    <ul class="sidebar__items">
      <li id="dashBoard">
        <a href="{{ route('dashboard') }}" class="sidebar__item">
          <h4 class="material-symbols-outlined">
            dashboard
          </h4>
          <h5 class="ms-3">
            DashBoard
          </h5>
        </a>
      </li>
      <li>
        <a href="{{ route('statistics') }}" class="sidebar__item">
          <h4 class="material-symbols-outlined">
            leaderboard
          </h4>
          <h5 class="ms-3">
            Statistics
          </h5>
        </a>
      </li>
      <li>
        <a href="#" class="sidebar__item">
          <h4 class="material-symbols-outlined">
            delete
          </h4>
          <h5 class="ms-3">
            Archive
          </h5>
        </a>
      </li>
    </ul>
  </div>
@endsection
