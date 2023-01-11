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
      $monthly = $this->getThisMonthlyData($date);

      $reference = $this->database->getReference('tasks/');
      $snapshot = $reference->getSnapShot();
      $value = $snapshot->getValue();
      // Remove null value from array because firebase insert empty value automatically.
      // source: https://stackoverflow.com/questions/15534917/why-do-firebase-collections-seem-to-begin-with-a-null-row
      $filter_value = array_filter($value);

      // 全部のデータを取得
      // 1週間のデータが1要素の配列を取得
      // dataの中に、日付と全体に対する%のデータを入れる
      //
      return view('statistics');
    }

    private function getThisMonthlyData($date)
    {
      $year = $date->format('Y');
      $month = $date->format('m');
      $day = $date->format('d');
      $monthly['first_monday'] = $date->modify('first Monday of this month');
      // If first_monday is not 1 of that month, get last sunday of before month.
      if ($monthly['first_monday'] !== 1) {
        $monthly['first_monday'] = $date->modify('last Monday of previous month');
      }
      $monthly['last_sunday'] = $date->modify('last Sunday of this month');
      return $monthly;
    }

}
