const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const getWindowHeight = () => {
  try {
    const res = wx.getSystemInfoSync();
    // 获取可使用窗口宽度
    let clientHeight = res.windowHeight;
    // 获取可使用窗口高度
    let clientWidth = res.windowWidth;
    // 算出比例
    let ratio = 750 / clientWidth;
    // 算出高度(单位rpx)
    let height = clientHeight * ratio;
    // 设置高度
    return height;
  } catch (e) {
    // Do something when catch error
  }
}

module.exports = {
  formatTime: formatTime,
  getWindowHeight: getWindowHeight
}