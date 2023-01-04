// HACK: module形式で使えるようにする
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

import { firebaseConfig, app, database} from './firebase.js';

// bladeのinputからデータを受け取る

// Write data
set(ref(database, 'users/' + 2), {
  username: 'land',
  email: 'landlixer@gmail.com'
});

// データを取得する

// データを表示する
