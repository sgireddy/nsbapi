var XRegExp = require('xregexp').XRegExp;
var nametagExp = XRegExp('\\S*![\\p{L}\\d]+', 'i');

function FindNametags() {
  this._nextMatchPosition = 0;
  this._matches = [];
  this._currentMatch = null;
  this._currentMatchText = null;
  this._content = null;
}

FindNametags.prototype.setContent = function (content) {
  this._content = content;
};

FindNametags.prototype.getNametags = function () {
  this._loopMatches();
  return this._getMatches();
};

FindNametags.prototype._loopMatches = function () {
  this._findNextMatch();

  while (this._foundMatch()) {
    this._setCurrentMatchText();

    if (this._currentMatchIsUnique()) {
      this._addCurrentResultToMatches();
    }

    this._incrementNextMatchPosition();
    this._findNextMatch();
  }
};

FindNametags.prototype._findNextMatch = function () {
  this._currentMatch = XRegExp.exec(this._content, nametagExp, this._nextMatchPosition);
};

FindNametags.prototype._foundMatch = function () {
  return this._currentMatch === null ? false : true;
};

FindNametags.prototype._setCurrentMatchText = function () {
  this._currentMatchText = this._formatMatchText(this._currentMatch[0]);
};

FindNametags.prototype._formatMatchText = function (match) {
  return match.substring(1).toLowerCase();
};

FindNametags.prototype._currentMatchIsUnique = function () {
  return this._matches.indexOf(this._currentMatchText) === -1;
};

FindNametags.prototype._addCurrentResultToMatches = function () {
  this._matches.push(this._currentMatchText);
};

FindNametags.prototype._incrementNextMatchPosition = function () {
  this._nextMatchPosition = this._currentMatch.index + this._currentMatch[0].length;
};

FindNametags.prototype._getMatches = function () {
  return this._matches.length === 0 ? [] : this._matches;
};

function findNametags(content) {
  var tags = new FindNametags();
  tags.setContent(content);
  return tags.getNametags();
}

module.exports = findNametags;