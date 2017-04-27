const removeChildren = function(parentEl) {
  while (parentEl.firstChild) {
    parentEl.removeChild(parentEl.firstChild);
  }
};

const createEl = function(tagName) {
  return function(text) {
    const el = document.createElement(tagName);
    if (text) {
      el.textContent = text;
    }
    return el;
  };
};

const createTR = createEl('TR');
const createTD = createEl('TD');
const createTH = createEl('TH');

module.exports = {
  createTD: createTD,
  createTR: createTR,
  createTH: createTH,
  removeChildren: removeChildren
};