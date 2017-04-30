const { getLetterRange } = require('./array-util');
const { removeChildren, createTH, createTR, createTD } = require('./dom-util');

class TableView {
  constructor(model) {
    this.model = model;
    this.selectedRow;
    this.selectedColumn;
  }

  init() {
    this.initDomReferences();
    this.initCurrentCell();
    this.renderTable();
    this.attachEventHandlers();
  }

  initDomReferences() {
    this.headerRowEl = document.querySelector('THEAD TR');
    this.sheetBodyEl = document.querySelector('TBODY');
    this.formulaBarEl = document.querySelector('#formula-bar');
  }
  
  initCurrentCell() {
    this.currentCellLocation = { col: 1, row: 0 };
    this.renderFormulaBar();
  }
  
  normalizeValueForRendering(value) {
    return value || '';
  }

  renderFormulaBar() {
    const currentCellValue = this.model.getValue(this.currentCellLocation);
    this.formulaBarEl.value = this.normalizeValueForRendering(currentCellValue);
    this.formulaBarEl.focus();
  } 

  renderTable() {
    this.renderTableHeader();
    this.renderTableBody();
  }

  renderTableHeader() {
    removeChildren(this.headerRowEl);

    //add blank column header for row numbers colummn
    let th = createTH();
    th.className = 'row-numbers';
    this.headerRowEl.appendChild(th);

    getLetterRange('A', this.model.numCols)
      .map(colLable => createTH(colLable))
      .forEach(th => {
        th.className = 'normal-cell';
        this.headerRowEl.appendChild(th)
      });

    th = createTH('+');
    th.className = 'row-numbers';
    this.headerRowEl.appendChild(th);
  }
  
  isCurrentCell(col, row) {
    return this.currentCellLocation.col === col &&
           this.currentCellLocation.row === row;
  }

  renderTableBody(selectedColumn, selectedRow) {
    const fragment =  document.createDocumentFragment();
    for (let row = 0; row < this.model.numRows ; row += 1) {
      const tr = createTR();
      if (row === this.model.numRows -1) {
        tr.className = 'sum-row';
      }
      if (row === selectedRow) {
        tr.className = 'selected-row';
      }
      for (let col = 0; col < this.model.numCols + 1; col += 1) {
        const position = {col: col, row: row};
        const value = this.model.getValue(position);
        const td = createTD(value);
        
        if (col === 0) {
          td.className = 'row-numbers';
        }
        if (col === selectedColumn) {
          td.className = 'selected-column';
        }
        if (this.isCurrentCell(col, row) && !selectedColumn && !selectedRow) {
          td.className = 'current-cell';
        }
        tr.appendChild(td);
      }
      fragment.appendChild(tr);
    }
    // add '+' cell in new row for 'add a row' functionality
    const tr = createTR();
    this.model.setValue({col: 0, row: this.model.numRows + 1}, '+');
    const td = createTD(this.model.getValue({col: 0, row: this.model.numRows + 1}));
    td.className = 'row-numbers';
    tr.appendChild(td);
    fragment.appendChild(tr);

    removeChildren(this.sheetBodyEl);
    this.sheetBodyEl.appendChild(fragment);

  }
  
  renderColumnSum(col) {
    let result = 0;
    for(let i = 0; i < this.model.numRows - 1; i += 1) {
      let currentCellLocation = { col: col, row: i };
      if (Number.parseInt(this.model.getValue(currentCellLocation)) || Number.parseInt(this.model.getValue(currentCellLocation)) === 0) {
        result += Number.parseInt(this.model.getValue(currentCellLocation));
      }
    }
    result = result.toString();
    this.model.setValue({ col: col, row: this.model.numRows - 1 }, result);
  }

  attachEventHandlers() {
    this.sheetBodyEl.addEventListener('click', this.
      handleSheetClick.bind(this));
    this.formulaBarEl.addEventListener('keyup', this.
      handleFormulaBarChange.bind(this));
    this.headerRowEl.addEventListener('click', this.
      handleHeaderClick.bind(this));
  }
  
  handleFormulaBarChange(evt) {
    const value = this.formulaBarEl.value;
    this.model.setValue(this.currentCellLocation, value);
    this.renderColumnSum(this.currentCellLocation.col);
    this.renderTableBody();
  }

  handleSheetClick(evt) {
    const col = evt.target.cellIndex;
    const row = evt.target.parentElement.rowIndex - 1;
    if (col === 0 && row < this.model.numRows - 1) {
      this.renderTableBody(null, row);
      this.selectedRow = row;
      return;
    }
    if (row !== this.model.numRows - 1) {
      this.currentCellLocation = { col: col, row: row };
      this.selectedRow = null;
      this.selectedColumn = null;
      this.renderTableBody();
      this.renderFormulaBar();
    }
    if (row === this.model.numRows) {
      this.addNewRow(row);
    }
  }

  handleHeaderClick(evt) {
    const column = evt.target.cellIndex;
    if (column === this.model.numCols + 1 && !this.selectedColumn) {
      this.model.addColumn();
      this.renderTableHeader();
      this.renderTableBody();

    } else if (column === this.model.numCols + 1 && this.selectedColumn){
      this.model.addColumn();
      for (let col = this.model.numCols; col >= this.selectedColumn + 1; col -= 1) {
        for (let row = 0; row < this.model.numRows - 1; row += 1) {
          if (col > this.selectedColumn + 1) {
            let value = this.model.getValue({col: col - 1, row: row});
            this.model.setValue({col: col, row: row}, value);
          } else {
            this.model.setValue({col: col, row: row}, '');
          }
        }
        this.renderColumnSum(col);
      }
      this.selectedColumn = column;
      this.renderTableHeader();
      this.renderTableBody();

    } else if (column !== 0) {
      this.renderTableBody(column);
      this.selectedColumn = column;
    }
  }

  addNewRow(row) {
    for (let i = 0; i < this.model.numCols; i += 1) {
        this.model.setValue({ col:i, row: this.model.numRows -1}, '');
    }
    this.model.setValue({col: 0, row: row - 1}, row);

    this.model.addRow();
    for (let i = 1; i < this.model.numCols; i += 1) {
      this.renderColumnSum(i);
    }
    this.initCurrentCell();
    this.renderTableBody();
  }
}

module.exports = TableView;