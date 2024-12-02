"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  _easycom_uni_icons2();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  _easycom_uni_icons();
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "index",
  setup(__props) {
    const userInfo = common_vendor.ref({});
    const imgUrl = common_vendor.ref("");
    const uploadLoading = common_vendor.ref(0);
    const isEmpty = (obj) => Object.keys(obj).length === 0;
    const upload = (isSon) => {
      if (isEmpty(userInfo.value)) {
        common_vendor.index.navigateTo({
          url: "/uni_modules/uni-id-pages/pages/login/login-withoutpwd"
        });
        return;
      }
      common_vendor.index.chooseMedia({
        count: 1,
        mediaType: ["image"],
        sizeType: ["compressed"],
        async success(image) {
          if (image.tempFiles.length > 0) {
            const filePath = image.tempFiles[0].tempFilePath;
            const fileName = filePath.split("/").pop();
            common_vendor.index.compressImage({
              src: filePath,
              quality: 50,
              async success(res) {
                common_vendor.index.showLoading({
                  title: `上传中`
                });
                try {
                  const result = await common_vendor.Ys.uploadFile({
                    filePath: res.tempFilePath,
                    cloudPath: fileName,
                    onUploadProgress: function(progressEvent) {
                      uploadLoading.value = Math.round(
                        progressEvent.loaded * 100 / progressEvent.total
                      );
                    }
                  });
                  imgUrl.value = result.fileID;
                  common_vendor.index.hideLoading();
                  if (isSon) {
                    common_vendor.index.$emit("question", imgUrl.value);
                  } else {
                    common_vendor.index.navigateTo({
                      url: `/pages/question/question?imgUrl=${imgUrl.value}`
                    });
                  }
                } catch (e) {
                  common_vendor.index.showToast({
                    title: e,
                    icon: "fail"
                  });
                }
              }
            });
          }
        }
      });
    };
    const onLogin = () => {
      if (isEmpty(userInfo.value)) {
        common_vendor.index.navigateTo({
          url: "/uni_modules/uni-id-pages/pages/login/login-withoutpwd"
        });
      }
    };
    common_vendor.onMounted(() => {
      var _a;
      common_vendor.index.$on("uploadImg", (is) => {
        upload(is);
      });
      userInfo.value = common_vendor.index.getStorageSync("uni-id-pages-userInfo") || {};
      if ((_a = userInfo.value) == null ? void 0 : _a._id) {
        setTimeout(() => {
          userInfo.value = common_vendor.index.getStorageSync("uni-id-pages-userInfo") || {};
        }, 1e3);
      }
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.unref(common_assets.avater),
        b: common_vendor.t(userInfo.value.nickname || "未登录"),
        c: common_vendor.o(onLogin),
        d: common_vendor.p({
          type: "camera-filled",
          size: "60",
          color: "#DADADA"
        }),
        e: common_vendor.o(($event) => upload(false))
      };
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-1cf27b2a"]]);
wx.createPage(MiniProgramPage);
