/**
 * 防抖
 * @param   func-回调函数; wait-延迟执行的毫秒; immediate：true表立即执行，false表示非立即执行
 * @return   yyyy-MM-dd hh:mm 格式的时间
 */
export function debounce(func, wait, immediate) {
  let timeout;
  return function () {
    let context = this;
    let args = arguments;

    if (timeout) clearTimeout(timeout);
    if (immediate) {
      var callNow = !timeout;
      timeout = setTimeout(() => {
        timeout = null;
    }, wait)
      if (callNow) func.apply(context, args)
    }
    else {
      timeout = setTimeout(function() {
        func.apply(context, args)
      }, wait);
    }
  }
}

/**
 * 邮箱校验
 * @param   value-要验证的值
 * @return   true：通过，false：不通过
 */
export function checkEmail(value) {
  if (!value) return;
  var regEmail = /^\w+@\w+\.[a-z]{2,6}$/;
  return regEmail.test(value)
}

/**
 * 时间戳转时间
 * @param   timeStamp-时间戳
 * @return   正常时间YYYY-mm-dd HH:mm:ss
 */
export function toNomalTime (timeStamp) {
  var date = new Date(parseInt(timeStamp));
  var Y = date.getFullYear() + '-';
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  var D = date.getDate() < 10 ? '0' + date.getDate() + ' ': date.getDate() + ' ';
  var h = (date.getHours() < 10 ? '0' + date.getHours(): date.getHours()) + ':';
  var m = (date.getMinutes() < 10 ? '0' + date.getMinutes(): date.getMinutes()) + ':';
  var s = (date.getSeconds() < 10 ? '0'+ date.getSeconds(): date.getSeconds());
  return Y + M + D + h + m + s;
}

/* 省略号 */
export function dotdot (val, num) {
  let txt;
  if (!val) return '';
  if (val.length > num) {
    txt = val.substring(0, num - 1) + '...'
    return txt
  } else {
    return val
  }
}

/* 获取url的参数 */
export function getUrlKey (name) {
  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ""])[1].replace(/\+/g, '%20')) || null
}
