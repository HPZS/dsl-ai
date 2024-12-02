"use strict";
const uni_modules_uvUiTools_libs_mixin_mpMixin = require("../../../uv-ui-tools/libs/mixin/mpMixin.js");
const uni_modules_uvUiTools_libs_mixin_mixin = require("../../../uv-ui-tools/libs/mixin/mixin.js");
const uni_modules_uvSubsection_components_uvSubsection_props = require("./props.js");
const common_vendor = require("../../../../common/vendor.js");
const _sfc_main = {
  name: "uv-subsection",
  mixins: [uni_modules_uvUiTools_libs_mixin_mpMixin.mpMixin, uni_modules_uvUiTools_libs_mixin_mixin.mixin, uni_modules_uvSubsection_components_uvSubsection_props.props],
  data() {
    return {
      // 组件尺寸
      itemRect: {
        width: 0,
        height: 0
      }
    };
  },
  watch: {
    list: {
      deep: true,
      handler() {
        this.init();
      }
    },
    current: {
      immediate: true,
      handler(n) {
      }
    }
  },
  computed: {
    wrapperStyle() {
      const style = {};
      if (this.mode === "button") {
        style.backgroundColor = this.bgColor;
      }
      return style;
    },
    // 滑块的样式
    barStyle() {
      const style = {};
      style.width = `${this.itemRect.width}px`;
      style.height = `${this.itemRect.height}px`;
      style.transform = `translateX(${this.current * this.itemRect.width}px)`;
      if (this.mode === "subsection") {
        style.backgroundColor = this.activeColor;
      }
      return this.$uv.deepMerge(style, this.$uv.addStyle(this.customItemStyle));
    },
    // 分段器item的样式
    itemStyle(index) {
      return (index2) => {
        const style = {};
        if (this.mode === "subsection") {
          style.borderColor = this.activeColor;
          style.borderWidth = "1px";
          style.borderStyle = "solid";
        }
        return style;
      };
    },
    // 分段器文字颜色
    textStyle(index) {
      return (index2) => {
        const style = {};
        style.fontWeight = this.bold && this.current === index2 ? "bold" : "normal";
        style.fontSize = this.$uv.addUnit(this.fontSize);
        if (this.mode === "subsection") {
          style.color = this.current === index2 ? "#fff" : this.inactiveColor;
        } else {
          style.color = this.current === index2 ? this.activeColor : this.inactiveColor;
        }
        return style;
      };
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.$uv.sleep().then(() => this.getRect());
    },
    // 判断展示文本
    getText(item) {
      return typeof item === "object" ? item[this.keyName] : item;
    },
    // 获取组件的尺寸
    getRect() {
      this.$uvGetRect(".uv-subsection__item--0").then((size) => {
        this.itemRect = size;
      });
    },
    clickHandler(index) {
      this.$emit("change", index);
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.s($options.barStyle),
    b: common_vendor.n(_ctx.mode === "button" && "uv-subsection--button__bar"),
    c: common_vendor.n(_ctx.current === 0 && _ctx.mode === "subsection" && "uv-subsection__bar--first"),
    d: common_vendor.n(_ctx.current > 0 && _ctx.current < _ctx.list.length - 1 && _ctx.mode === "subsection" && "uv-subsection__bar--center"),
    e: common_vendor.n(_ctx.current === _ctx.list.length - 1 && _ctx.mode === "subsection" && "uv-subsection__bar--last"),
    f: common_vendor.f(_ctx.list, (item, index, i0) => {
      return {
        a: common_vendor.t($options.getText(item)),
        b: common_vendor.s($options.textStyle(index)),
        c: common_vendor.n(`uv-subsection__item--${index}`),
        d: common_vendor.n(index < _ctx.list.length - 1 && "uv-subsection__item--no-border-right"),
        e: common_vendor.n(index === 0 && "uv-subsection__item--first"),
        f: common_vendor.n(index === _ctx.list.length - 1 && "uv-subsection__item--last"),
        g: `uv-subsection__item--${index}`,
        h: common_vendor.s($options.itemStyle(index)),
        i: common_vendor.o(($event) => $options.clickHandler(index), index),
        j: index
      };
    }),
    g: common_vendor.n(`uv-subsection--${_ctx.mode}`),
    h: common_vendor.s(_ctx.$uv.addStyle(_ctx.customStyle)),
    i: common_vendor.s($options.wrapperStyle)
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-1f050171"]]);
wx.createComponent(Component);
