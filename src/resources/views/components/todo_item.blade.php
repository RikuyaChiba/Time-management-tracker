<div class="col-3">
  <div class="todo__title">
    <p> {{ $title }}</p>
  </div>
  <div class="todo__item">
    <div class="todo__header">
      <h5>Todo</h5>
    </div>
    <div class="todo__card card">
      <div class="card-body">
        <input type="hidden" id="quadrantSection" value={{ $section }}>
        <textarea id="todoTextarea"class="todo__textarea form-control border-0" rows="3" placeholder="Task title"></textarea>
        <button id="saveBtn" class="todo__btn btn btn-primary mt-4">保存</button>
      </div>
    </div>
    <div id="todoAddButton" class="todo__add-button">
      <span class="todo__add-icon material-symbols-outlined">add</span>
      <span class="todo__add-text">Add another card</span>
    </div>
  </div>
</div>
