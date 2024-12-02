<template>
	<view class="index">
		<!-- 个人信息 -->
		<view class="index-user" @click="onLogin">
			<!-- 头像 -->
			<image :src="avater" class="index-user-avatar"></image>
			<!-- 用户名 -->
			<view class="index-user-nickname">
				{{ userInfo.nickname || '未登录' }}
			</view>
		</view>

		<!-- 拍照 -->

		<view class="index-take">
			<view class="index-take-box" @click="upload(false)">
				<uni-icons type="camera-filled" size="60" color="#DADADA">
				</uni-icons>
			</view>
		</view>

		<!-- 提示 -->
		<view class="index-tips">
			提示：请将物品拍照，AI将给您断舍离建议，尽量突出主体
		</view>
	</view>
</template>

<script setup lang="ts">
	import { onMounted, ref } from 'vue'
	import avater from '@/static/avater.png'

	const userInfo = ref({})
	const imgUrl = ref('')
	const uploadLoading = ref(0)

	const isEmpty = obj => Object.keys(obj).length === 0;

	const upload = (isSon) => {
		if (isEmpty(userInfo.value)) {
			uni.navigateTo({
				url: "/uni_modules/uni-id-pages/pages/login/login-withoutpwd"
			})
			return
		}

		uni.chooseMedia({
			count: 1,
			mediaType: ['image'],
			sizeType: ["compressed"],
			async success(image) {
				// 在这里获取和处理文件名
				if (image.tempFiles.length > 0) {
					const filePath = image.tempFiles[0].tempFilePath
					const fileName = filePath.split('/').pop()

					uni.compressImage({
						src: filePath,
						quality: 50,
						async success(res) {
							uni.showLoading({
								title: `上传中`
							});

							try {
								const result = await uniCloud.uploadFile({
									filePath: res.tempFilePath,
									cloudPath: fileName,
									onUploadProgress: function (progressEvent) {
										uploadLoading.value = Math.round(
											(progressEvent.loaded * 100) / progressEvent.total
										);
									}
								});

								imgUrl.value = result.fileID
								uni.hideLoading()
								
								if(isSon) {
									uni.$emit('question', imgUrl.value)
								} else {
									uni.navigateTo({
										url: `/pages/question/question?imgUrl=${imgUrl.value}`
									})
								}
							} catch (e) {
								uni.showToast({
									title: e,
									icon: 'fail'
								});
							}
						}
					})
				}
			}
		});
	}

	const onLogin = () => {
		if (isEmpty(userInfo.value)) {
			uni.navigateTo({
				url: "/uni_modules/uni-id-pages/pages/login/login-withoutpwd"
			})
		}
	}

	onMounted(() => {
		uni.$on('uploadImg', (is) => {
			upload(is)
		})
		
		userInfo.value = uni.getStorageSync('uni-id-pages-userInfo') || {}
		if (userInfo.value?._id) {
			setTimeout(() => {
				userInfo.value = uni.getStorageSync('uni-id-pages-userInfo') || {}
			}, 1e3)
		}
	})
</script>

<style lang="scss" scoped>
	.index {
		width: 100%;
		padding: 24rpx;

		&-user {
			display: flex;
			align-items: center;

			&-avatar {
				width: 80rpx;
				height: 80rpx;
				border-radius: 50%;
			}

			&-nickname {
				font-size: 32rpx;
				margin-left: 24rpx;
			}
		}

		&-take {
			width: 100%;

			&-box {
				width: 300rpx;
				height: 300rpx;
				border-radius: 50%;
				background-color: #f8f8f8;
				margin: 70rpx auto 0 auto;
				display: flex;
				align-items: center;
				justify-content: center;
				box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.02);
				border: 1px solid rgba(0, 0, 0, 0.06);
			}
		}

		&-tips {
			color: #ee0a24;
			font-size: 24rpx;
			text-align: center;
			margin-top: 24rpx;
		}
	}
</style>