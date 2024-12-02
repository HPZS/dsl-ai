<template>
	<view class="box">
		<slot></slot>
	</view>
</template>

<script>
	export default {
		name:"question-box",
		data() {
			return {
				
			};
		}
	}
</script>

<style scoped lang="scss">
.box {
	padding: 24rpx;
	box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
	box-sizing: border-box;
	margin-bottom: 24rpx;
}
</style>