const { getLetterRange } = require('./array-util');
const { removeChildren, createTH, createTR, createTD } = require('./dom-util');

class TableView {
  constructor(model) {
    this.model = model;
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
    this.currentCellLocation = { col: 0, row: 0 };
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
    getLetterRange('A', this.model.numCols)
      .map(colLable => createTH(colLable))
      .forEach(th => this.headerRowEl.appendChild(th));
  }
  
  isCurrentCell(col, row) {
    return this.currentCellLocation.col === col &&
           this.currentCellLocation.row === row;
  }

  renderTableBody() {
    const fragment =  document.createDocumentFragment();
    for (let row = 0; row < this.model.numRows; row += 1) {
      const tr = createTR();
      if (row === this.model.numRows -1) {
        tr.className = 'sum-row';
      }
      for (let col = 0; col < this.model.numCols; col += 1) {
        const position = {col: col, row: row};
        const value = this.model.getValue(position);
        const td = createTD(value);

        if (this.isCurrentCell(col, row)) {
          td.className = 'current-cell';
        }

        tr.appendChild(td);
      }
      fragment.appendChild(tr);
    }
    removeChildren(this.sheetBodyEl);
    this.sheetBodyEl.appendChild(fragment);

  }
  
  renderColumnSum(col) {
    let result = 0;
    for(let i = 0; i < this.model.numRows - 1; i += 1) {
      let currentCellLocation = { col: col, row: i };
      if (Number.parseInt(this.model.getValue(currentCellLocation))) {
        result += Number.parseInt(this.model.getValue(currentCellLocation));
      }
    }
    //alert(result);
    this.model.setValue({ col: col, row: this.model.numRows - 1 }, result);
  }

  attachEventHandlers() {
    this.sheetBodyEl.addEventListener('click', this.
      handleSheetClick.bind(this));
    this.formulaBarEl.addEventListener('keyup', this.
      handleFormulaBarChange.bind(this));
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
    if (row !== this.model.numRows - 1) {
      this.currentCellLocation = { col: col, row: row };
      this.renderTableBody();
      this.renderFormulaBar();
    }
  }
 
}

module.exports = TableView;