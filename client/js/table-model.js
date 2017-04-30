class TableModel {
  constructor(numCols=4, numRows=5) {
    this.numCols = numCols;
    this.numRows = numRows;
    this.data = {};
    for (let i = 0; i < numRows - 1; i +=1) {
      this.setValue({col: 0, row: i}, i + 1);
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