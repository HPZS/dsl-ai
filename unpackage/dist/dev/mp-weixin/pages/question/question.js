"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _easycom_question_box2 = common_vendor.resolveComponent("question-box");
  const _easycom_uv_subsection2 = common_vendor.resolveComponent("uv-subsection");
  const _easycom_uv_divider2 = common_vendor.resolveComponent("uv-divider");
  (_easycom_question_box2 + _easycom_uv_subsection2 + _easycom_uv_divider2)();
}
const _easycom_question_box = () => "../../components/question-box/question-box.js";
const _easycom_uv_subsection = () => "../../uni_modules/uv-subsection/components/uv-subsection/uv-subsection.js";
const _easycom_uv_divider = () => "../../uni_modules/uv-divider/components/uv-divider/uv-divider.js";
if (!Math) {
  (_easycom_question_box + _easycom_uv_subsection + _easycom_uv_divider)();
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "question",
  setup(__props) {
    const imgUrl = common_vendor.ref("");
    const chatArr = common_vendor.ref([]);
    const problemArr = common_vendor.ref([]);
    const result = common_vendor.ref({
      title: "",
      tips: ""
    });
    const tips = common_vendor.ref("");
    const type = common_vendor.ref(0);
    const subList = common_vendor.ref([
      "是",
      "否"
    ]);
    const imageAi = common_vendor.Ys.importObject("imageAi");
    const chatAi = common_vendor.Ys.importObject("chatAi");
    const getBtn = () => {
      switch (type.value) {
        case 1:
          return "已有答案，继续拍照";
        case 2:
          return "继续拍照";
        case 3:
          return "知道啦！继续拍照！";
      }
    };
    const changeSub = (item, e) => {
      item.sub = e;
    };
    const regArr = (str) => {
      const regex = /\[.*?\]/;
      const match = str.match(regex);
      if (match) {
        return match[0];
      } else {
        console.log("没有找到匹配的 []");
      }
    };
    const formSubmit = async (e) => {
      const subObj = {
        content: [],
        role: "user"
      };
      subObj.content = problemArr.value.map((item) => {
        return item.sub ? "否" : "是";
      });
      subObj.content = JSON.stringify(subObj.content);
      chatArr.value.push(subObj);
      chatArr.value.forEach((item) => {
        if (Array.isArray(item.content)) {
          item.content = JSON.stringify(item.content);
        }
      });
      const chatAiRes = await chatAi.chat(chatArr.value);
      type.value = 2;
      const r = JSON.parse(regArr(chatAiRes.completion.choices[0].message.content));
      result.value.title = r[0];
      result.value.tips = r[1];
    };
    const makeChatAi = async () => {
      const chatRes = await chatAi.chat(chatArr.value);
      const me = chatRes.completion.choices[0].message;
      if (me.content.includes("[")) {
        me.content = JSON.parse(regArr(me.content));
        problemArr.value = me.content.map((item) => {
          return {
            text: item,
            sub: 0
          };
        });
        chatArr.value.push(me);
        type.value = 1;
      } else {
        tips.value = me.content;
        type.value = 3;
      }
    };
    const getQuery = async (url) => {
      imgUrl.value = url;
      type.value = 0;
      problemArr.value = [];
      result.value = {
        title: "",
        tips: ""
      };
      chatArr.value = [];
      const imageAiRes = await imageAi.lookImg(imgUrl.value);
      chatArr.value.push(imageAiRes.response.choices[0].message);
      makeChatAi();
    };
    const onChooseImg = () => {
      common_vendor.index.$emit("uploadImg", true);
    };
    common_vendor.onLoad((options) => {
      common_vendor.index.$on("question", (url) => {
        getQuery(url);
      });
      if (options.imgUrl) {
        getQuery(options.imgUrl);
      }
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: imgUrl.value,
        b: type.value !== 0
      }, type.value !== 0 ? common_vendor.e({
        c: type.value === 1
      }, type.value === 1 ? {
        d: common_vendor.f(problemArr.value, (item, i, i0) => {
          return common_vendor.e({
            a: common_vendor.t(item.text),
            b: common_vendor.o(($event) => changeSub(item, $event)),
            c: "a6df9a91-2-" + i0 + ",a6df9a91-1",
            d: common_vendor.p({
              list: subList.value,
              current: item.sub
            }),
            e: i < problemArr.value.length - 1
          }, i < problemArr.value.length - 1 ? {
            f: "a6df9a91-3-" + i0 + ",a6df9a91-1"
          } : {});
        })
      } : {}, {
        e: type.value === 2
      }, type.value === 2 ? {
        f: common_vendor.t(result.value.title),
        g: common_vendor.t(result.value.tips)
      } : {}, {
        h: type.value === 3
      }, type.value === 3 ? {
        i: common_vendor.t(tips.value)
      } : {}) : {}, {
        j: type.value !== 0
      }, type.value !== 0 ? common_vendor.e({
        k: type.value == 1
      }, type.value == 1 ? {
        l: common_vendor.o(formSubmit)
      } : {}, {
        m: common_vendor.t(getBtn()),
        n: type.value == 1 ? "" : "primary",
        o: common_vendor.o(onChooseImg)
      }) : {});
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-a6df9a91"]]);
wx.createPage(MiniProgramPage);
