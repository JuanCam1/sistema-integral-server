export function autoAdjustColumnWidth(sheet) {
  const columnWidths = {};

  sheet
    .usedRange()
    .value()
    .forEach((row) => {
      row.forEach((cell, columnIndex) => {
        const columnLetter = String.fromCharCode(65 + columnIndex);
        columnWidths[columnLetter] = Math.max(
          columnWidths[columnLetter] || 0,
          (cell || "").toString().length
        );
      });
    });

  Object.keys(columnWidths).forEach((column) => {
    sheet.column(column).width(columnWidths[column] + 12);
  });
}
