const TableModel = require('../table-model');
const TableView = require('../table-view');
const fs = require('fs');

describe('table-view', () => {

  beforeEach(() => {
    //load HTML skeleton from disk and parse into DOM
    const fixturePath = './client/js/test/fixtures/sheet-container.html';
    const html = fs.readFileSync(fixturePath, 'utf8');
    document.documentElement.innerHTML = html;
  });

  describe('sum row', () => {
    it('should display the sum of all column values', () => {
      // set up initial state
      const model = new TableModel(3,3);
      const view = new TableView(model);
      view.init();
      document.querySelector('#formula-bar').value = '65';
      view.handleFormulaBarChange();
      
      // inpsect initial state
      expect(model.getValue({col: 0, row: 0})).toBe('65');
      
      // simulate user action
      let trs = document.querySelectorAll('TBODY TR');
      let td = trs[1].cells[0];
      td.click();
      document.querySelector('#formula-bar').value = '1';
      view.handleFormulaBarChange();

      // inspect resulting state
      expect(model.getValue({col: 0, row: 1})).toBe('1');
      expect(model.getValue({col: 0, row: 2})).toBe(66);
    });

    it('should add negative values', () => {
      // set up initial state
      const model = new TableModel(3,3);
      const view = new TableView(model);
      view.init();
      document.querySelector('#formula-bar').value = '-65';
      view.handleFormulaBarChange();

      // inpsect initial state
      expect(model.getValue({col: 0, row: 0})).toBe('-65');
      
      // simulate user action
      let trs = document.querySelectorAll('TBODY TR');
      let td = trs[1].cells[0];
      td.click();
      document.querySelector('#formula-bar').value = '1';
      view.handleFormulaBarChange();

      // inspect resulting state
      expect(model.getValue({col: 0, row: 1})).toBe('1');
      expect(model.getValue({col: 0, row: 2})).toBe(-64);
    });
  });

  describe('formula bar', () => {
    it('makes changes TO the value of the current cell', () => {
    // set up the initial state
    const model = new TableModel(3, 3)
    const view = new TableView(model);
    view.init();

    // inspect the initial state
    let trs = document.querySelectorAll('TBODY TR');
    let td = trs[0].cells[0];
    expect(td.textContent).toBe('');

    // simulate user action
    document.querySelector('#formula-bar').value = '65';
    view.handleFormulaBarChange();

    // inspect the resulting state
    trs = document.querySelectorAll('TBODY TR');
    expect(trs[0].cells[0].textContent).toBe('65');
    });

    it('updates FROM the value of the current cell', () => {
      //set up initial state
      const model = new TableModel(3, 3);
      const view = new TableView(model);
      model.setValue({col: 2, row: 1}, '123');
      view.init();

      //inspect initial state
      const formulaBarEl = document.querySelector('#formula-bar');
      expect(formulaBarEl.value).toBe('');

      //simulate user action
      const trs = document.querySelectorAll('TBODY TR');
      trs[1].cells[2].click();

      //inspect the resulting state
      expect(formulaBarEl.value).toBe('123');
    });
  });

  describe('table body', () => {
    it('highlights the current cell when clicked', () => {
      //set up the initial state
      const model = new TableModel(10, 5);
      const view = new TableView(model);
      view.init();

      //inspect the initial state
      let trs = document.querySelectorAll('TBODY TR');
      let td = trs[2].cells[3];
      expect(td.className).toBe('');

      //simulate user action
      td.click()

      //inspect the resulting state
      trs = document.querySelectorAll('TBODY TR');
      td = trs[2].cells[3];
      expect(td.className).not.toBe('');
    });
    it('has the right size', () => {
      //set up initial 
      const numCols = 6;
      const numRows = 10;
      const model = new TableModel(numCols, numRows);
      const view = new TableView(model);
      view.init();

      //insepct the initial state
      let ths = document.querySelectorAll('THEAD TH');
      expect(ths.length).toBe(numCols);
    });

    it('fills in values from the model', () => {
      //set up initial state
      const model = new TableModel(3, 3);
      const view = new TableView(model);
      model.setValue({col: 2, row: 1}, '123');
      view.init();

      //insepct the initial state
      const trs = document.querySelectorAll('TBODY TR');
      expect(trs[1].cells[2].textContent).toBe('123');
    });
  });

  describe('table header', () => {
    it('has valid column header lables', () => {
      //set up initial state
      const numCols = 6;
      const numRows = 10;
      const model = new TableModel(numCols, numRows);
      const view = new TableView(model);
      view.init();

      //inspect the initial state
      let ths = document.querySelectorAll('THEAD TH');
      expect(ths.length).toBe(numCols);

      let lableTexts = Array.from(ths).map(el => el.textContent);
      expect(lableTexts).toEqual(['A','B','C','D','E','F']);
    });
  });
});