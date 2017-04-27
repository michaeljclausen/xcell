const TableModel = require('../table-model');
const TabelView = require('../table-view');
const fs = require('fs');

describe('table-view', () => {

  beforeEach(() => {
    //load HTML skeleton from disk and parse into DOM
    const fixturePath = './client/js/test/fixtures/sheet-container.html';
    const html = fs.readFileSync(fixturePath, 'utf8');
    document.documentElement.innerHTML = html;
  });

  describe('table body', () => {
    it('has the right size', () => {
      //set up initial 
      const numCols = 6;
      const numRows = 10;
      const model = new TableModel(numCols, numRows);
      const view = new TabelView(model);
      view.init();

      //insepct the initial state
      let ths = document.querySelectorAll('THEAD TH');
      expect(ths.length).toBe(numCols);
    });
    it('fills in values from the model', () => {
      //set up initial state
      const model = new TableModel(3,3);
      const view = new TabelView(model);
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
      const view = new TabelView(model);
      view.init();

      //inspect the initial state
      let ths = document.querySelectorAll('THEAD TH');
      expect(ths.length).toBe(numCols);

      let lableTexts = Array.from(ths).map(el => el.textContent);
      expect(lableTexts).toEqual(['A','B','C','D','E','F']);
    });
  });
});