class TableModel {
  constructor(numCols=4, numRows=5) {
    this.numCols = numCols;
    this.numRows = numRows;
    this.data = {};
    this._createNumberedColumn();
    this._initSumRow();
  }

  _createNumberedColumn() {
    for (let row = 0; row < this.numRows - 1; row++) {
      this.setValue({col: 0, row: row}, row + 1);
    }
  }

  _initSumRow() {
    for (let col = 1; col <= this.numCols; col++) {
      this.setValue({col: col, row: this.numRows - 1}, '0');
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