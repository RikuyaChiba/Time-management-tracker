@section('navbar')
  <div class="sidebar">
    <div class="sidebar__logo">
      <h3>TM tracker</h3>
    </div>
    <ul class="sidebar__items">
      <li class="sidebar__item">
        <a href="{{ route('dashboard') }}" class="d-flex align-items-center">
          <h4 class="material-symbols-outlined m-0">
            dashboard
          </h4>
          <h5 class="ms-3 mb-0">
            DashBoard
          </h5>
        </a>
      </li>
      <li class="sidebar__item">
        <a href="{{ route('statistics') }}" class="d-flex align-middle">
          <h4 class="material-symbols-outlined m-0">
            leaderboard
          </h4>
          <h5 class="ms-3 mb-0">
            Statistics
          </h5>
        </a>
      </li>
      <li class="sidebar__item">
        <a href="#" class="d-flex align-middle">
          <h4 class="material-symbols-outlined m-0">
            delete
          </h4>
          <h5 class="ms-3 mb-0">
            Archive
          </h5>
        </a>
      </li>
    </ul>
  </div>
@endsection
