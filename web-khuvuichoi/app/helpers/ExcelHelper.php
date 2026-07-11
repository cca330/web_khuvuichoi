<?php
require_once __DIR__ . '/../../vendor/autoload.php';
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

class ExcelHelper {

    public static function export($filename, $sheets = []) {

        $spreadsheet = new Spreadsheet();

        foreach ($sheets as $index => $sheetData) {

            $sheet = $index === 0
                ? $spreadsheet->getActiveSheet()
                : $spreadsheet->createSheet();

            $sheet->setTitle($sheetData['title']);

            // header
            $sheet->fromArray($sheetData['header'], null, 'A1');

            // body
            $row = 2;
            foreach ($sheetData['data'] as $item) {
                $sheet->fromArray(array_values($item), null, 'A' . $row++);
            }
        }

        header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        header('Content-Disposition: attachment; filename="'.$filename.'"');

        (new Xlsx($spreadsheet))->save('php://output');
        exit;
    }
}
