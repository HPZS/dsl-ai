"use strict";
var _a, _b;
const common_vendor = require("../../../../common/vendor.js");
const props = {
  props: {
    // tab的数据
    list: {
      type: Array,
      default: () => []
    },
    // 当前活动的tab的index
    current: {
      type: [String, Number],
      default: 0
    },
    // 激活的颜色
    activeColor: {
      type: String,
      default: "#3c9cff"
    },
    // 未激活的颜色
    inactiveColor: {
      type: String,
      default: "#303133"
    },
    // 模式选择，mode=button为按钮形式，mode=subsection时为分段模式
    mode: {
      type: String,
      default: "button"
    },
    // 字体大小
    fontSize: {
      type: [String, Number],
      default: 12
    },
    // 激活tab的字体是否加粗
    bold: {
      type: Boolean,
      default: true
    },
    // mode = button时，组件背景颜色
    bgColor: {
      type: String,
      default: "#eeeeef"
    },
    // 从list元素对象中读取的键名
    keyName: {
      type: String,
      default: "name"
    },
    customItemStyle: {
      type: [String, Object],
      default: ""
    },
    ...(_b = (_a = common_vendor.index.$uv) == null ? void 0 : _a.props) == null ? void 0 : _b.subsection
  }
};
exports.props = props;
