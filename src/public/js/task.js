// HACK: module形式で使えるようにする
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, set, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

import { firebaseConfig, app, db} from './firebase.js';

const section_ids = {
  first_section: 1,
  second_section: 2,
  third_section: 3,
  fourth_section: 4
}

const setData = async (db, task_id, attributes) => {
  return new Promise((resolve) => {
    set(ref(db, 'tasks/' + task_id), attributes)
    resolve();
  });
}

// 特定テーブルのコンテンツを配列として取得
const getRefData = async () => {
  let task_ref = ref(db, 'tasks/');
  return new Promise(resolve => {
    onValue(task_ref, async (snapshot) => {
      const data = snapshot.val();

      // データがない場合の処理
      if (data === null) {
        const attributes = {
          section_id: 1,
          content: `task1`,
          created_at: (new Date()).toString()
        };
        await setData(db, 1, attributes);
      }
      // NOTE: DBにはないemptyの値が入ってしまうので、emptyを排除する形で暫定対応
      let filter_data = data.filter(Boolean);
      const this_week = getThisWeekDate();
      const parse_start_date = Date.parse(this_week.start_date.full_date.toString());
      const parse_end_date = Date.parse(this_week.end_date.full_date.toString());
      // 当日の1週間のデータのものだけ抽出
      filter_data = filter_data.filter((data) => {
        const parse_created_at = Date.parse(data.created_at);
        return (parse_created_at >= parse_start_date) && (parse_created_at <= parse_end_date);
      });
      // idを付与
      filter_data.map((data, index) => {
        data.id = index + 1;
      });
      resolve(filter_data);
    });
  });
}

const toDoubleDigits = (num) => {
  num += "";
  if(num.length === 1) {
    num = "0" + num;
  }
  return num;
};

// 1週間の月曜日、日曜日の日付を取得
const getThisWeekDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const date = today.getDate();
  const day_num = today.getDay();
  const this_monday = date - day_num + 1;
  const this_sunday = this_monday + 6;
  // 月曜日の年月日
  const start_date = new Date(year, month, this_monday);
  const start_date_day = start_date.getDate();
  // 日曜日の年月日
  const end_date = new Date(year, month, this_sunday);
  const end_date_day = end_date.getDate();

  const this_week = {
    start_date: {
      full_date: start_date,
      year: year,
      month: toDoubleDigits(month + 1),
      date: toDoubleDigits(start_date_day)
    },
    end_date: {
      full_date: end_date,
      year: year,
      month: toDoubleDigits(month + 1),
      date: toDoubleDigits(end_date_day)
    }
  }
  return this_week;
}

// 1週間の日付を取得
const formatWeek = (data) => {
  return `${data.start_date.year}-${data.start_date.month}-${data.start_date.date} ~ ${data.end_date.year}-${data.end_date.month}-${data.end_date.date}`;
}

// 1週間の日付を画面に表示する
const displayWeek = () => {
  const this_week = getThisWeekDate();
  const format_week = formatWeek(this_week);
  const target_element = $('#todoPeriod');
  target_element.html(format_week);
}

// DBに存在するデータを表示するためのカードを作成する
const createCard = (section_data, section_id) => {
  const $todo_add_btn = $("#todoAddButton" + section_id);
  section_data.map((data) => {
    const $new_card = $(
      `<div class="todo__card card">
        <div class="card-body">
          <div class="todo__trash-icon d-flex justify-content-end mb-1">
            <span class="material-symbols-outlined">delete</span>
          </div>
          <textarea class="todo__textarea form-control border-0" rows="3" placeholder="Task title"></textarea>
        </div>
      </div>`
    );
    const $trash = $($new_card).find('span');
    const $textarea = $($new_card).find('textarea');
    $trash.attr('id', 'trashIcon' + data.id);
    $new_card.attr('id', 'todoCard' + data.id);
    $textarea.attr('id', 'todoTextArea' + data.id);
    $textarea.val(data.content);
    $todo_add_btn.before($new_card);
  });
}

const getPercentData = (data) => {
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

  return percent_data;
}

// ロード処理
const load = (data) => {
  const percent_data = getPercentData(data);
  createCard
  displayPercent(percent_data); // パーセント表示
  displayProgressBar(percent_data); // プログレスバー表示
  displayWeek(); // 1週間の表示
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
    if (is_elem_exists == false) {
      $progress_percent = $('<div>');
    }
    $progress_base.css('background-color', '#e8ecf8');
    $progress_base.append($progress_percent);
    $progress_percent.css('background-color', color);
    $progress_percent.animate({
      width: section_percent + '%'
    }, 900);
    $progress_percent.css('height', '1rem');
    $progress_percent.css('border-radius', '20px');

  });
}

const saveTask = (db) => {
  $(document).on("keydown", "textarea", async function(e) {
    // エンターキーが押されたときには、テキストエリアをフォーカスアウトする
    const enter_key_code = 13;
    if (e.keyCode === enter_key_code) {
      const focused = $(':focus');
      focused.blur();
    }
    const $clicked_element_id = $(this).attr('id');
    const task_id = $clicked_element_id.replace(/[^0-9]/g, ''); // idの番号のみを取り出す
    const $todo_textarea = $('#todoTextArea' + task_id);

    // Get task data to store db
    const $section_id = $(this).parents("[id *= 'quadrantSection']").data('section');
    const $content = $todo_textarea.val();
    const today = (new Date()).toString(); // Date型の状態だとDBに保存できないので、String型に変換

    const attributes = {
      section_id: $section_id,
      content: $content,
      created_at: today
    };

    // Store date into firebase db
    set(ref(db, 'tasks/' + task_id), attributes);
  });
}

const refreshPercent = async () => {
  const data = await getRefData();
  const percent_data = getPercentData(data);
  displayPercent(percent_data); // パーセント情報を更新
  displayProgressBar(percent_data); // プログレスバー情報を更新
}

$(document).on('load', async function() {
  refreshPercent();
})

$(document).on('blur focusout', async function(e) {
  // テキストエリアが未入力のとき
  if(!$(e.target).val()) {
    // カードを削除
    let $card = $(e.target).closest('.card');
    $card.remove();
    return;
  }

  refreshPercent();
})

const addCard = (db, $todo_add_btns) => {
  $todo_add_btns.click(function() {
    // taskテーブルの最新のidを取得
    const last_card_id = $("[id *= 'todoCard']").length;
    const $card = $(
      `<div class="todo__card card">
        <div class="card-body">
          <div class="todo__trash-icon d-flex justify-content-end mb-1">
            <span class="material-symbols-outlined">delete</span>
          </div>
          <textarea class="todo__textarea form-control border-0" rows="3" placeholder="Task title"></textarea>
        </div>
      </div>`
    );
    const $trash = $($card).find('span');
    const $textarea = $($card).find('textarea');
    const fade_in_speed = 700;
    $trash.attr('id', 'trashIcon' + (last_card_id + 1));
    $card.attr('id', 'todoCard' + (last_card_id + 1));
    $card.css('display', 'none');
    $textarea.attr('id', 'todoTextArea' + (last_card_id + 1));
    $(this).before($card);
    $card.fadeIn(fade_in_speed);
    $textarea.focus();

    // NOTE: テキストエリアを新しく作ったので、テキストエリア,ボタンの変数情報を最新情報にする
    deleteCard(db);
  });
}

const deleteData = (db, task_id) => {
  remove(ref(db, 'tasks/' + task_id));
}

const deleteCard = (db) => {
  const trash__icons = $("[id *= 'trashIcon']");
  trash__icons.click(function() {
    let $parent = $(this).parents(".todo__card");
    let $textarea = $parent.find('textarea');
    $parent.remove();
  });
}

const runAsync = async (db, $todo_add_btns) => {
  try {
    const data = await getRefData();
    load(data);
    saveTask(db);
    addCard(db, $todo_add_btns);
    deleteCard(db);
  } catch(err) {
    console.log(err);
  }
}

$(function(){
  // Process when todo add button is clicked
  let $todo_add_btns = $("[id *= 'todoAddButton']");
  runAsync(db, $todo_add_btns);
});
