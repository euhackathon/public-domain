var Filter = function() {
  var _data;
  var _canvas;

  var _industryBitmask = 0;
  var _issueBitmask = 0;
  var _policyBitmask = 0;

  // Map checkbox ids to array index.
  var _industryMap = {};
  var _issueMap = {};
  var _policyMap = {};

  var _resultsDom = document.querySelector('.results');
  var _industrySectorsDom = document.querySelectorAll('#industry input');
  var _fundamentalIssuesDom = document.querySelectorAll('#issue input');
  var _evidenceBasedPoliciesDom = document.querySelectorAll('#policy input');

  for (var i = 0, len = _industrySectorsDom.length; i < len; i++) {
    _industrySectorsDom[i].addEventListener('click', filterClicked);
    _industryMap[_industrySectorsDom[i].id] = i + 1;
  }

  for (i = 0, len = _fundamentalIssuesDom.length; i < len; i++) {
    _fundamentalIssuesDom[i].addEventListener('click', filterClicked);
    _issueMap[_fundamentalIssuesDom[i].id] = i + 1;
  }

  for (i = 0, len = _evidenceBasedPoliciesDom.length; i < len; i++) {
    _evidenceBasedPoliciesDom[i].addEventListener('click', filterClicked);
    _policyMap[_evidenceBasedPoliciesDom[i].id] = i + 1;
  }

  function setData(data) {
    _data = data;
  }

  function filterClicked(evt) {
    var checkbox = evt.target;
    if (checkbox.checked) {
      _industryBitmask |= Math.pow(2, _industryMap[checkbox.id]-1);
      _issueBitmask |= Math.pow(2, _issueMap[checkbox.id]-1);
      _policyBitmask |= Math.pow(2, _policyMap[checkbox.id]-1);
    } else {
      _industryBitmask ^= Math.pow(2, _industryMap[checkbox.id]-1);
      _issueBitmask ^= Math.pow(2, _issueMap[checkbox.id]-1);
      _policyBitmask ^= Math.pow(2, _policyMap[checkbox.id]-1);
    }

    _data.applyStudyPoint(_industryBitmask, _issueBitmask, _policyBitmask);
    _renderFilteredData(_data.cleanData(_data.getRawData().studies.length-1));

    //filterData(_data.getRawData().studies);
  }

  function _renderFilteredData(data) {
    _canvas.init(data.studies, data.studies.length-1);
  }

  function setCanvas(canvas) {
    _canvas = canvas;
  }

  /*function filterData(data) {
    var result = [];
    var industries;
    for (var i = 0, len = data.length; i < len; i++) {
      industries = data[i].industry;
      if (industries !== undefined) {
        var matchIndustryBitmask = 0;
        for (var j = 0, lenj = industries.length; j < lenj; j++) {
          matchIndustryBitmask |= util.findDataBit(industries[j], AXES.INDUSTRY_SECTORS);
        }

        if ( (_industryBitmask & matchIndustryBitmask) !== 0) {
          result.push(data[i]);
        }
      }
    }
    render(result);
  }

  function render(data) {
    _resultsDom.innerHTML = '';
    for (var i = 0, len = data.length; i < len; i++) {
      var para = document.createElement('p');
      var node = document.createTextNode(i + ' ' + data[i].title);
      para.appendChild(node);
      _resultsDom.appendChild(para);
    }
  }*/

  this.setCanvas = setCanvas;
  this.setData = setData;
};
