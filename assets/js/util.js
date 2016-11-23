var util = {

  fetchJSONFile: function(path, callback) {
      var httpRequest = new XMLHttpRequest();
      httpRequest.onreadystatechange = function() {
          if (httpRequest.readyState === 4) {
              if (httpRequest.status === 200) {
                  var data = JSON.parse(httpRequest.responseText);
                  if (callback) callback(data);
                  util.wikiData = data;
              }
          }
      };
      httpRequest.open('GET', '../../'+path);
      httpRequest.send();
  },

  findDataIndex: function(point, set) {
    for (var i = 0, len = set.length; i < len; i++) {
      if (set[i] === point) {
        return i + 1;
      }
    }
    //console.log( 'WARNING:', point, 'not found!' );
    return 0;
  },

  // Return the value of a bit of a set at a certain named value.
  findDataBit: function(point, set) {
    for (var i = 0, len = set.length; i < len; i++) {
      if (set[i] === point) {
        return Math.pow(2, i);
      }
    }
    //console.log( 'WARNING:', point, 'not found!' );
    return 0;
  },

  cleanDataObj: function(rawData, set) {
    var cleanedData = {};
    if (rawData === undefined) {
      cleanedData[0] = 'Unspecified';
    } else {
      for (var i = 0, len = rawData.length; i < len; i++) {
        cleanedData[util.findDataIndex(rawData[i], set)] = rawData[i];
      }
    }
    return cleanedData;
  },

  cleanDataArr: function(rawData) {
    if (rawData === undefined) {
      var cleanedData = [];
      cleanedData.push('Unspecified');
      return cleanedData;
    }
    return rawData;
  },

  // Get the text from a set based on the bitmask its set that
  // correspond to positions in the array.
  getFromSet: function(bitmask, set) {
    var setValues = [];
    for (var i = 0, len = set.length; i < len; i++) {
      if ((bitmask & Math.pow(2, i)) !== 0) {
        setValues.push(set[i]);
      }
    }
    return setValues;
  },

  hasIntersection: function(from, to, set) {
    var fromBitmask = 0;
    var toBitmask = 0;

    for (var i = 0, len = from.length; i < len; i++) {
      fromBitmask |= util.findDataBit(from[i], set);
    }

    for (var j = 0, lenj = to.length; j < lenj; j++) {
      toBitmask |= util.findDataBit(to[j], set);
    }

    return (fromBitmask & toBitmask) !== 0 ? true : false;
  },

  hasIntersection: function(from, to, set) {
    var fromBitmask = 0;
    var toBitmask = 0;

    for (var i = 0, len = from.length; i < len; i++) {
      fromBitmask |= util.findDataBit(from[i], set);
    }

    for (var j = 0, lenj = to.length; j < lenj; j++) {
      toBitmask |= util.findDataBit(to[j], set);
    }

    return (fromBitmask & toBitmask) !== 0 ? true : false;
  },

  calcDistBetween: function(from, to, set) {
    var fromBitmask = 0;
    var toBitmask = 0;

    for (var i = 0, len = from.length; i < len; i++) {
      fromBitmask |= util.findDataBit(from[i], set);
    }

    for (var j = 0, lenj = to.length; j < lenj; j++) {
      toBitmask |= util.findDataBit(to[j], set);
    }

    return util.popIt(fromBitmask ^ toBitmask);
  },

  // Count the number of bits.
  popIt: function(x) {
     x = x - ((x >> 1) & 0x55555555);
     x = (x & 0x33333333) + ((x >> 2) & 0x33333333);
     x = (x + (x >> 4)) & 0x0f0f0f0f;
     x = x + (x >> 8);
     x = x + (x >> 16);
     return x & 0x0000003f;
  },

  // Convert RGB to HSL.
  rgbToHsl: function(rgb) {
    var r = rgb[0];
    var g = rgb[1];
    var b = rgb[2];

    r /= 255;
    g /= 255;
    b /= 255;
    var max = Math.max(r, g, b);
    var min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if(max === min){
        h = s = 0; // achromatic
    }else{
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    h *= 360;

    return [h, s, l];
  },

  slugify: function(str) {
    str = str || '';
    if (str instanceof Array) {
      str = str.join(' ');
    }
    return encodeURI(str.replace(/ /g, '_')).replace(/'/g, "%27");
  },

  unSlugify: function(slug) {
    slug = slug || '';
    return slug.replace(/_/g, ' ').replace(/%27/g, "'");
  },

  getParameterByName: function(name, url) {
      if (!url) {
        url = window.location.href;
      }
      name = name || '';
      name = name.replace(/[\[\]]/g, "\\$&");
      var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
          results = regex.exec(url);
      if (!results) return null;
      if (!results[2]) return '';
      return decodeURIComponent(results[2].replace(/\+/g, " "));
  },

  ensureQueryParamsExist: function() {
    if (!this.getParameterByName('title') || !this.getParameterByName('name') || !this.getParameterByName('year') || !this.getParameterByName('abstract')) {
      window.location.replace('?name=Oberholzer-Gee_and_Strumpf_(2010)&title=File_Sharing_and_Copyright&authors=Oberholzer-Gee,_F._Strumpf,_K.&year=2010&abstract=The_advent_of_file_sharing_has_considerably_weakened_effective_copyright_protection._Today,_more_than_60%25_of_Internet_traffic_consists_of_consumers_sharing_music,_movies,_books,_and_games._Yet,_despite_the_popularity_of_the_new_technology,_file_sharing_has_not_undermined_the_incentives_of_authors_to_produce_new_works._We_argue_that_the_effect_of_file_sharing_has_been_muted_for_three_reasons._(1)_The_cannibalization_of_sales_that_is_due_to_file_sharing_is_more_modest_than_many_observers_assume._Empirical_work_suggests_that_in_music,_no_more_than_20%25_of_the_recent_decline_in_sales_is_due_to_sharing.');

    }
  },

  disableAllLinks: function() {
    $('a').on('click', function(ev) {
      if ($(this).parents('#tabs').length) return;
      ev.preventDefault();
      alert('This is just a demo! This link has been disabled.');
    });
  }

};
