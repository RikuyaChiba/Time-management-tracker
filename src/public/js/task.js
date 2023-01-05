// HACK: module形式で使えるようにする
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

import { firebaseConfig, app, database} from './firebase.js';


$(function(){
  let $todo_textarea = $('#todoTextarea');
  let $save_btn = $('#saveBtn')

  // データを読む
  var task_ref = ref(database, 'tasks/' + 1);
  onValue(task_ref, (snapshot) => {
    const data = snapshot.val();
    // データを表示する
    $todo_textarea.val(data.content);
  });

  $todo_textarea.focus(function() {
    $save_btn.css({'display': 'block'});
  });

  // When todo save button is clicked
  $save_btn.click(function() {
    // Get task data to store db
    let $section_id = $('#quadrantSection').val();
    let $content = $todo_textarea.val();

    let today = new Date();
    let year = today.getFullYear();
    let month = toDoubleDigits(today.getMonth() + 1);
    let day = toDoubleDigits(today.getDate());
    let hours = today.getHours();
    let minutes = today.getMinutes();
    let seconds = today.getSeconds();
    let format_created_at =
      `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

    let attributes = {
      section_id: $section_id,
      content: $content,
      created_at: format_created_at
    };

    // Store date into firebase db
    set(ref(database, 'tasks/' + 1), attributes);
  });

  // Process when todo add button is clicked
  let $todo_add_btn = $("#todoAddButton");

  $todo_add_btn.click(function() {
    let $card = $(
      `<div class="todo__card card">
        <div class="card-body">
          <input type="hidden" id="quadrantSection" value={{ $section }}>
          <textarea id="todoTextarea"class="todo__textarea form-control border-0" rows="3" placeholder="Task title"></textarea>
          <button id="saveBtn" class="todo__btn btn btn-primary mt-4">保存</button>
        </div>
      </div>`
    );

    $todo_add_btn.before($card);
  });

  // TODO: blurでもイベントが発火するようにする
  // $todo_textarea.blur(function() {
    //   $save_btn.css({'display': 'none'});
    // })
});

const toDoubleDigits = (num) => {
  num += "";
  if(num.length === 1) {
    num = "0" + num;
  }
  return num;
};
