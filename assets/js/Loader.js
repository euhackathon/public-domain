var Loader = function() {
  var loaderDom = document.querySelector('#loader');

  function showLoader() {
    loaderDom.textContent = '';
  }

  function hideLoader() {
    loaderDom.textContent = '';
  }

  this.showLoader = showLoader;
  this.hideLoader = hideLoader;
};
