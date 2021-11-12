export function  showToast(msg, duration) {
  duration = isNaN(duration) ? 2000 : duration;
  var m = document.createElement('div');
  m.innerHTML = msg;
  m.style.cssText = "width:50%; min-width:180px; background:#000; opacity:0.6; height:auto;min-height: 30px; color:#fff; line-height:30px; text-align:center; border-radius:4px; position:fixed; top:0%; left:20%; z-index:999999;";
  document.body.appendChild(m);
  setTimeout(function () {
    var d = 0.5;
    m.style.transition = 'opacity ' + d + 's ease-in';
    m.style.opacity = '0';
    setTimeout(function () { document.body.removeChild(m) }, d * 1000);
  }, duration);
}
