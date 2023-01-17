<?php

namespace App\Http\Controllers;

use DateTimeImmutable;
use Kreait\Firebase\Contract\Database;

class StatisticsController extends Controller
{
    public function __construct(Database $database)
    {
        $this->database = $database;
    }

    public function index()
    {
      $date = new DateTimeImmutable();

      $reference = $this->database->getReference('tasks/');
      $snapshot = $reference->getSnapShot();
      $value = $snapshot->getValue();
      // Remove null value from array because firebase insert empty value automatically.
      // https://stackoverflow.com/questions/15534917/why-do-firebase-collections-seem-to-begin-with-a-null-row
      $filter_value = array_filter($value);
      foreach($filter_value as &$val) {
        $val['created_at'] = new \DateTime($val['created_at']);
      }

      // それぞれの週のデータを取得
      $weekly_info = $this->getMonthlyData($date);

      $data = [];
      // 1週目
      foreach($weekly_info as $week_num => $week) {
        // Firebaseで取得したデータから、該当の週のデータだけをフィルタリング
        $weekly_data = array_filter($filter_value, function($value) use ($week) {
          return ($value['created_at'] >= $week['start_day'] && $value['created_at'] <= $week['end_day']);
        });
        // 週の始まりと終わり
        $data[$week_num]['period'] = [
          'start_day' => $week['start_day'],
          'end_day'   => $week['end_day']
        ];
        if (empty($weekly_data)) {
          continue;
        }
        // 週のセクションの割合
        for($i = 1; $i <= 4; $i++) {
          $section_data = array_filter($weekly_data, function($value) use ($i) {
              return $value['section_id'] === $i;
          });
          $section_ratio = (count($section_data) / count($weekly_data)) * 100; // 全データに対するセクションの割合
          $data[$week_num]['section'][$i] = $section_ratio;
        }
      }
      return view('statistics')->with($data);
    }

    /**
     * ひと月の週ごとの始まりと終わりの日付を取得
     */
    private function getMonthlyData($date): array
    {
      $year = $date->format('Y');
      $month = $date->format('m');
      $last_day = $date->modify('last day of this month')->format('d');
      // 1週目
      $data['first_week'] = [
        'start_day' => new \DateTime($year . '/' . $month . '/' . '01'),
        'end_day' => new \DateTime($year . '/' . $month . '/' . '07')
      ];
      // 2週目
      $data['second_week'] = [
        'start_day' => new \DateTime($year . '/' . $month . '/' . '08'),
        'end_day' => new \DateTime($year . '/' . $month . '/' . 14)
      ];
      // 3週目
      $data['third_week'] = [
        'start_day' => new \DateTime($year . '/' . $month . '/' . 15),
        'end_day' => new \DateTime($year . '/' . $month . '/' . 21)
      ];
      // 4週目
      $data['fourth_week'] = [
        'start_day' => new \DateTime($year . '/' . $month . '/' . 22),
        'end_day' => new \DateTime($year . '/' . $month . '/' . $last_day)
      ];

      return $data;
    }
}
