<div id={{ "quadrantSection" . $section }} class="col-3" data-section={{ $section }}>
  <div class="todo__section">
    <div class="todo__section-header">
      <span class="todo__title">{{ $title }}</span>
      <span id={{ "sectionPercent" . $section }} class="todo__percent"></span>
    </div>
    <div id={{ "todoProgressBar" . $section }} class="todo__progress-bar"></div>
  </div>
  <div class="todo__item">
    <div class="todo__header">
      <h5>Todo</h5>
    </div>
    <div id={{ "todoAddButton" . $section }} class="todo__add-button">
      <span class="todo__add-icon material-symbols-outlined">add</span>
      <span class="todo__add-text">Add another card</span>
    </div>
  </div>
</div>
