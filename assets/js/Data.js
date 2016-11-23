var Data = function(data) {
  var _data = data;
  var _controlPointsIndex = 0;

  function applyStudyPoint(industryBitmask, issueBitmask, policyBitmask) {
    while(_controlPointsIndex !== 0) {
      _data.studies.pop();
      _controlPointsIndex--;
    }
    var index = _data.studies.push(
      {
        title: 'Study point',
        industry: util.getFromSet(industryBitmask, AXES.INDUSTRY_SECTORS),
        fundamental_issue: util.getFromSet(issueBitmask, AXES.FUNDAMENTAL_ISSUES),
        evidence_based_policy: util.getFromSet(policyBitmask, AXES.EVIDENCE_BASED_POLICIES)
      }
    );

    _controlPointsIndex++;
  }

  function cleanData(index) {
    var studies = _data.studies;
    // Set unique ID on studies.
    for (var i = 0, len = studies.length; i < len; i++) {
      studies[i].uid = i;
    }

    // Iterate over studies and add related study table.
    var study;
    var compareStudy;
    var distanceIndustry = 0;
    var distanceIssue = 0;
    var distancePolicy = 0;

    //for (var i = 0, len = studies.length; i < len; i++) {
      study = studies[index];
      for (var j = 0, lenj = studies.length; j < lenj; j++) {
        compareStudy = studies[j];
        if (compareStudy !== study &&
            typeof study.industry !== 'undefined' &&
            typeof compareStudy.industry !== 'undefined' &&
            typeof study.fundamental_issue !== 'undefined' &&
            typeof compareStudy.fundamental_issue !== 'undefined' &&
            typeof study.evidence_based_policy !== 'undefined' &&
            typeof compareStudy.evidence_based_policy !== 'undefined' &&
            (util.hasIntersection(study.industry, compareStudy.industry, AXES.INDUSTRY_SECTORS) &&
             util.hasIntersection(study.fundamental_issue, compareStudy.fundamental_issue, AXES.FUNDAMENTAL_ISSUES) &&
             util.hasIntersection(study.evidence_based_policy, compareStudy.evidence_based_policy, AXES.EVIDENCE_BASED_POLICIES))
          ) {

          if (typeof study.related_studies === 'undefined') {
            study.related_studies = [];
          }

          distanceIndustry = util.calcDistBetween(study.industry, compareStudy.industry, AXES.INDUSTRY_SECTORS);
          distanceIssue = util.calcDistBetween(study.fundamental_issue, compareStudy.fundamental_issue, AXES.FUNDAMENTAL_ISSUES);
          distancePolicy = util.calcDistBetween(study.evidence_based_policy, compareStudy.evidence_based_policy, AXES.EVIDENCE_BASED_POLICIES);

          //console.log(study.title, 'to', compareStudy.title, 'distanceIndustry', distanceIndustry, util.hasIntersection(study.industry, compareStudy.industry, AXES.INDUSTRY_SECTORS));

          var relatedStudy = {
            industries: {
              id: j,
              distance: distanceIndustry,
              color: Math.round((255 * distanceIndustry) / 16)
            },
            issues: {
              id: j,
              distance: distanceIssue,
              color: Math.round((255 * distanceIssue) / 5)
            },
            policies: {
              id: j,
              distance: distancePolicy,
              color: Math.round((255 * distancePolicy) / 6)
            }
          }
          // 5 issues = red
          // 6 policies = green
          // 16 industries = blue
          relatedStudy.rgb = [relatedStudy.issues.color,
                              relatedStudy.policies.color,
                              relatedStudy.industries.color ];
          relatedStudy.hsl = util.rgbToHsl(relatedStudy.rgb);

          relatedStudy.aggregateDistance = relatedStudy.industries.distance + relatedStudy.issues.distance + relatedStudy.policies.distance;

          relatedStudy.title = compareStudy.title;
          relatedStudy.name = compareStudy.name;
          relatedStudy.authors = compareStudy.authors;
          relatedStudy.year = compareStudy.year;
          relatedStudy.abstract = compareStudy.abstract;

          study.related_studies.push( relatedStudy );

        }
      }
    //}

    return _data;
  }

  function getRawData() {
    return _data;
  }

  this.applyStudyPoint = applyStudyPoint;
  this.cleanData = cleanData;
  this.getRawData = getRawData;
};
