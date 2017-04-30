class TableModel {
  constructor(numCols=4, numRows=5) {
    this.numCols = numCols;
    this.numRows = numRows;
    this.data = {};
    for (let row = 0; row < numRows - 1; row +=1) {
      this.setValue({col: 0, row: row}, row + 1);
    }
    for (let col = 1; col <= numCols; col +=1) {
      this.setValue({col: col, row: numRows - 1}, '0');
    }
  }

  _getCellId(location) {
    return `${location.col}:${location.row}`;
  }

  getValue(location) {
    return this.data[this._getCellId(location)];
  }

  setValue(location, value) {
    this.data[this._getCellId(location)] = value;
  }
  addColumn() {
    this.numCols += 1;
  }
  addRow() {
    this.numRows +=1;
  }
}

module.exports = TableModel;