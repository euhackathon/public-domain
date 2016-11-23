var App = function() {
  var _study = 0;
  var _loader = new Loader();
  var _dataLoaded;
  var _data;
  var _index = 0;
  //var _ctx = document.getElementById('canvas').getContext('2d');

  function init(){
    _loader.showLoader();
    util.fetchJSONFile('data/studies.json', dataLoaded);
    //window.addEventListener('keydown', nextPressed);
  }

  function nextPressed() {
    var currDataPoint;

    var cleanPolicies = {};
    var cleanIssues = {};
    var cleanIndustries = {};

    if (_dataLoaded) {
      currDataPoint = _data.studies[_index++];

      cleanIssues = util.cleanDataArr(currDataPoint.fundamental_issue);
      cleanIndustries = util.cleanDataArr(currDataPoint.industry);
      cleanPolicies = util.cleanDataArr(currDataPoint.evidence_based_policy);

      //console.log('Policies:', cleanPolicies);
      //console.log('Issues:', cleanIssues);
      //console.log('Industry:', cleanIndustries);
      //console.log('-----------------------------------------------------------');

      /*draw(cleanIssues,
           cleanIndustries,
           cleanPolicies);*/
    }
  }

  function draw(issues, industries, policies) {
    for (var i = 0, len = issues.length; i < len; i++) {
      for (var j = 0, lenj = industries.length; j < lenj; j++) {
        drawIssueToIndustry(issues[i], industries[j]);
        for (var k = 0, lenk = policies.length; k < lenk; k++) {
          drawIndustryToPolicy(industries[j], policies[k]);
        }
      }
    }

  }

/*  function drawIssueToIndustry(issue, industry) {
    var issueIndex =  util.findDataIndex(issue, AXES.FUNDAMENTAL_ISSUES);
    var industryIndex = util.findDataIndex(industry, AXES.INDUSTRY_SECTORS);

    var offset = issueIndex * 96;
    var offseti = industryIndex * 30;

    // Find issue start.
    _ctx.beginPath();
    _ctx.arc(200, 10 + offset, 5, 0, Math.PI*2, true);
    _ctx.closePath();
    _ctx.stroke();

    // Draw lines.
    _ctx.beginPath();
    _ctx.moveTo(200, 10 + offset);
    _ctx.lineTo(500, 10 + offseti);
    if (_index === 20) {
      _ctx.strokeStyle = 'rgb(255,0,0)';
      _ctx.lineWidth = 10;
    } else {
      _ctx.strokeStyle = 'rgba(0,0,0,0.05)';
      _ctx.lineWidth = 1;
    }
    _ctx.stroke();

    // Find industry start.
    _ctx.beginPath();
    _ctx.arc(500, 10 + offseti, 5, 0, Math.PI*2, true);
    _ctx.closePath();
    _ctx.stroke();

    // Draw labels.
    //_ctx.fillText(AXES.INDUSTRY_SECTORS[industryIndex-1], 510, 13 + offseti);
  }

  function drawIndustryToPolicy(industry, policy) {
    var industryIndex = util.findDataIndex(industry, AXES.INDUSTRY_SECTORS);
    var policyIndex =  util.findDataIndex(policy, AXES.EVIDENCE_BASED_POLICIES);

    var offseti = industryIndex * 30;
    var offsetp = policyIndex * 80;

    // Find policy start.
    _ctx.beginPath();
    _ctx.arc(800, 10 + offsetp, 5, 0, Math.PI*2, true);
    _ctx.closePath();
    _ctx.stroke();

    // Draw lines.
    _ctx.beginPath();
    _ctx.moveTo(500, 10 + offseti);
    _ctx.lineTo(800, 10 + offsetp);
    if (_index === 20) {
      _ctx.strokeStyle = 'rgb(255,0,0)';
      _ctx.lineWidth = 10;
    } else {
      _ctx.strokeStyle = 'rgba(0,0,0,0.05)';
      _ctx.lineWidth = 1;
    }
    _ctx.stroke();
  }*/

  function drawColorWheel() {
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');
    var x = canvas.width / 2;
    var y = canvas.height / 2;
    var counterClockwise = false;
    context.clearRect(0, 0, canvas.width, canvas.height);

    // draw color wheel reference.
    /*for (var angle=0; angle<=360; angle+=1) {
        var startAngle = (angle-1)*Math.PI/180;
        var endAngle = angle * Math.PI/180;
        context.beginPath();
        context.moveTo(x, y);
        context.arc(x, y, 200, startAngle, endAngle, counterClockwise);
        context.closePath();
        context.fillStyle = 'hsl('+angle+', 100%, 50%)';
        context.fill();
    }*/

    // draw points.
    //console.log(_study);
    var study = _data.studies[_study++];
    context.arc(x, y, 6, 0, 360, counterClockwise);
    context.closePath();
    context.fillStyle = 'rgb(0,0,0)';
    context.fill();
    var related = study.related_studies;
    var angle;
    var radians;
    var radius;
    //console.log(quadrantX, quadrantY);
    /*context.beginPath();
    context.moveTo(x, y);
    context.arc(x + ((Math.cos(angle * Math.PI / 180)*40)), y - ((Math.sin(angle * Math.PI / 180)*40)), 4, 0, 360);
    context.closePath();
    context.fillStyle = 'rgb(0,0,0)';
    context.fill();*/
    if (typeof related !== 'undefined') {
      for (var i = 0, len = related.length; i < len; i++) {
        angle = related[i].hsl[0];
        radians = angle * Math.PI / 180;
        radius = 400 * related[i].hsl[2];
        context.beginPath();
        context.moveTo(x, y);
        context.arc(x + (Math.cos(radians)*radius), y + (Math.sin(radians)*radius), 4, 0, 360);
        context.closePath();
        //context.fillStyle = 'rgb('+related[i].rgb[0]+', '+related[i].rgb[1]+', '+related[i].rgb[2]+')';
        //context.fillStyle = 'hsla('+Math.round(related[i].hsl[0])+', 100%, 50%,'+related[i].hsl[2]+')';
        //context.fillStyle = 'hsl('+Math.round(related[i].hsl[0])+', 100%, 50%)';
        context.fillStyle = 'hsl('+Math.round(related[i].hsl[0])+', 100%, 50%)';
        //context.fillText(related[i].title, (x + (Math.cos(radians)*radius)) + 10, y + (Math.sin(radians)*radius) );
        context.fill();
      }
    }
    setTimeout(drawColorWheel, 100);
  }

  function dataLoaded(dataLoaded) {
    _loader.hideLoader();
    var data = new Data(dataLoaded);
    _dataLoaded = true;

    var studies = dataLoaded.studies;

    var canvas = new Canvas( '#canvas' );

    for (var i = 0; i < studies.length; i++) {
      if (studies[i].name === util.unSlugify(util.getParameterByName('name'))) {
        var index = i;
      }
    }

    index = index || Math.floor(Math.random()*studies.length);
    _data = data.cleanData(index);

    canvas.init(studies, index);

    var filter = new Filter();
    filter.setData(data);
    filter.setCanvas(canvas);

    /*for (var i = 0, len = _data.studies.length; i < len; i++) {
      nextPressed();
    }*/
  }

  this.init = init;
};

var app = new App();
var appIsInitialized = false;

if (typeof $ !== 'undefined') {
  $('.toggle a').on('click', function toggle(ev) {
    ev.preventDefault();
    $('#tabs').find('.hidden').removeClass('hidden');
    $(this).parents('.tab').addClass('hidden');
    if (!appIsInitialized) {
      app.init();
      appIsInitialized = true;
    }
  });

  $(function go() {
    util.ensureQueryParamsExist();
    util.disableAllLinks();
    $('.template-name').text(util.unSlugify(util.getParameterByName('name')));
    $('.template-authors').text(util.unSlugify(util.getParameterByName('authors')));
    $('.template-title').text(util.unSlugify(util.getParameterByName('title')));
    $('.template-year').text(util.unSlugify(util.getParameterByName('year')));
    $('.template-abstract').text(util.unSlugify(util.getParameterByName('abstract')));
  });
} else {
  app.init();
}
