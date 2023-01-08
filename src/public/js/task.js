// HACK: module形式で使えるようにする
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

import { firebaseConfig, app, db} from './firebase.js';


// 特定テーブルのコンテンツを配列として取得
const getRefData = async () => {
  let task_ref = ref(db, 'tasks/');
  return new Promise(resolve => {
    onValue(task_ref, (snapshot) => {
      const data = snapshot.val();
      // NOTE: DBにはないemptyの値が入ってしまうので、emptyを排除する形で暫定対応
      let filter_data = data.filter(Boolean);
      // idを付与
      filter_data.map((data, index) => {
        data.id = index + 1;
      });
      resolve(filter_data);
    });
  });
}

// DBに存在するデータを表示するためのカードを作成する
const createCard = (section_data, section_id) => {
  const $todo_add_btn = $("#todoAddButton" + section_id);
  section_data.map((data) => {
    const $new_card = $(
      `<div class="todo__card card">
        <div class="card-body">
          <textarea class="todo__textarea form-control border-0" rows="3" placeholder="Task title"></textarea>
          <button class="todo__btn btn btn-primary mt-4"></button>
        </div>
      </div>`
    );
    const $textarea = $($new_card).find('textarea');
    const $save_btn = $($new_card).find('button');
    $new_card.attr('id', 'todoCard' + data.id);
    $textarea.attr('id', 'todoTextArea' + data.id);
    $textarea.val(data.content);
    $save_btn.attr('id', 'saveBtn' + data.id);
    $save_btn.html('save');
    $todo_add_btn.before($new_card);
  });
}

// ロード処理
const load = (data) => {
  const section_ids = {
    first_section: 1,
    second_section: 2,
    third_section: 3,
    fourth_section: 4
  }
  const first_section_items = data.filter(data => data.section_id === section_ids.first_section);
  const second_section_items = data.filter(data => data.section_id === section_ids.second_section);
  const third_section_items = data.filter(data => data.section_id === section_ids.third_section);
  const fourth_section_items = data.filter(data => data.section_id === section_ids.fourth_section);
  const section_items = {
    first_section: first_section_items,
    second_section: second_section_items,
    third_section: third_section_items,
    fourth_section: fourth_section_items
  };
  // 領域のデータの個数だけ、領域にカードを作成する
  createCard(section_items.first_section, section_ids.first_section);
  createCard(section_items.second_section, section_ids.second_section);
  createCard(section_items.third_section, section_ids.third_section);
  createCard(section_items.fourth_section, section_ids.fourth_section);

  // パーセント表示
  const first_percent = calcPercent(data, section_items.first_section);
  const second_percent = calcPercent(data, section_items.second_section);
  const third_percent = calcPercent(data, section_items.third_section);
  const fourth_percent = calcPercent(data, section_items.fourth_section);
  const percent_data = [
    {
      section_id: 1,
      section_percent: first_percent,
      color: '#6D5DD6',
    },
    {
      section_id: 2,
      section_percent: second_percent,
      color: '#7CB678',
    },
    {
      section_id: 3,
      section_percent: third_percent,
      color: '#FFD272',
    },
    {
      section_id: 4,
      section_percent: fourth_percent,
      color: '#F49EBB',
    }
  ]
  displayPercent(percent_data); // パーセント表示
  displayProgressBar(percent_data); // プログレスバー表示
}

const getPercentData = (data) => {
  const section_ids = {
    first_section: 1,
    second_section: 2,
    third_section: 3,
    fourth_section: 4
  }
  const first_section_items = data.filter(data => data.section_id === section_ids.first_section);
  const second_section_items = data.filter(data => data.section_id === section_ids.second_section);
  const third_section_items = data.filter(data => data.section_id === section_ids.third_section);
  const fourth_section_items = data.filter(data => data.section_id === section_ids.fourth_section);
  const section_items = {
    first_section: first_section_items,
    second_section: second_section_items,
    third_section: third_section_items,
    fourth_section: fourth_section_items
  };

  // パーセント表示
  const first_percent = calcPercent(data, section_items.first_section);
  const second_percent = calcPercent(data, section_items.second_section);
  const third_percent = calcPercent(data, section_items.third_section);
  const fourth_percent = calcPercent(data, section_items.fourth_section);
  const percent_data = [
    {
      section_id: 1,
      section_percent: first_percent,
      color: '#6D5DD6',
    },
    {
      section_id: 2,
      section_percent: second_percent,
      color: '#7CB678',
    },
    {
      section_id: 3,
      section_percent: third_percent,
      color: '#FFD272',
    },
    {
      section_id: 4,
      section_percent: fourth_percent,
      color: '#F49EBB',
    }
  ]

  return percent_data;
}

const calcPercent = (data, section_data) => {
  let percent = (section_data.length / data.length) * 100;
  let rounded_percent = Math.round(percent);
  return rounded_percent;
}

const displayPercent = (percent_data) => {
  percent_data.map(({section_id, section_percent}) => {
    const target_element = $('#sectionPercent' + section_id);
    target_element.html(section_percent + '%');
  });
}

const displayProgressBar = (percent_data) => {
  percent_data.map(({section_id, section_percent, color}) => {
    const $progress_base = $('#todoProgressBar' + section_id);
    let $progress_percent = $progress_base.find('div');
    const is_elem_exists = $progress_percent.length;
    console.log(is_elem_exists);
    if (is_elem_exists == false) {
      $progress_percent = $('<div>');
    }
    $progress_base.css('background-color', '#e8ecf8');
    $progress_base.append($progress_percent);
    $progress_percent.css('background-color', color);
    $progress_percent.css('width', section_percent + '%');
    $progress_percent.css('height', '1rem');
    $progress_percent.css('border-radius', '20px');

  });
}

const toDoubleDigits = (num) => {
  num += "";
  if(num.length === 1) {
    num = "0" + num;
  }
  return num;
};

const saveTask = (db) => {
  const $save_btns = $('.todo__btn');
  // When todo save button is clicked
  $save_btns.click(async function() {
    const $clicked_element_id = $(this).attr('id');
    const task_id = $clicked_element_id.replace(/[^0-9]/g, ''); // idの番号のみを取り出す
    const $todo_textarea = $('#todoTextArea' + task_id);

    // Get task data to store db
    const $section_id = $(this).parents("[id *= 'quadrantSection']").data('section');
    const $content = $todo_textarea.val();
    const today = new Date();
    const year = today.getFullYear();
    const month = toDoubleDigits(today.getMonth() + 1);
    const day = toDoubleDigits(today.getDate());
    const hours = today.getHours();
    const minutes = today.getMinutes();
    const seconds = today.getSeconds();
    const format_created_at =
      `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

    const attributes = {
      section_id: $section_id,
      content: $content,
      created_at: format_created_at
    };

    // Store date into firebase db
    set(ref(db, 'tasks/' + task_id), attributes);
    const data = await getRefData();
    const percent_data = getPercentData(data);

    displayPercent(percent_data); // パーセント情報を更新
    displayProgressBar(percent_data); // プログレスバー情報を更新
  });
}

const displaySaveButton = () => {
  const $todo_textareas = $('.todo__textarea');
  $todo_textareas.focus(function() {
    // フォーカスされたtextareaのsave_btnのidを取得す0る
    const $element_id = $(this).attr('id');
    const id_num = $element_id.replace(/[^0-9]/g, ''); // idの番号のみを取り出す
    const $save_btn = $('#saveBtn' + id_num);
    $save_btn.css({'display': 'block'});
  });
}

const addCard = (db, $todo_add_btns) => {
  // taskテーブルの最新のidを取得
  $todo_add_btns.click(function() {
    const last_card_id = $("[id *= 'todoCard']").length;
    const $card = $(
      `<div class="todo__card card">
        <div class="card-body">
          <textarea class="todo__textarea form-control border-0" rows="3" placeholder="Task title"></textarea>
          <button class="todo__btn btn btn-primary mt-4">保存</button>
        </div>
      </div>`
    );
    const $textarea = $($card).find('textarea');
    const $save_btn = $($card).find('button');
    $card.attr('id', 'todoCard' + (last_card_id + 1));
    $textarea.attr('id', 'todoTextArea' + (last_card_id + 1));
    $save_btn.attr('id', 'saveBtn' + (last_card_id + 1));
    $(this).before($card);

    // NOTE: テキストエリアを新しく作ったので、テキストエリア,ボタンの変数情報を最新情報にする
    displaySaveButton();
    saveTask(db);
  });
}

const runAsync = async (db, $todo_add_btns) => {
  try {
    const data = await getRefData();
    load(data);
    saveTask(db);
    addCard(db, $todo_add_btns);
    displaySaveButton();
  } catch(err) {
    console.log(err);
  }
}

$(function(){
  // Process when todo add button is clicked
  let $todo_add_btns = $("[id *= 'todoAddButton']");
  runAsync(db, $todo_add_btns);
});
