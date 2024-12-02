<template>
	<view class="question">
		<question-box>
			<image class="question-image" :src="imgUrl" mode="aspectFit"></image>
		</question-box>

		<question-box v-if="type !== 0">
			<template v-if="type === 1">
				<view v-for="(item, i) in problemArr">
					<view class="question-item">
						<view>{{item.text}}</view>
						<view class="question-item_sub">
							<uv-subsection :list="subList" :current="item.sub"
								@change="changeSub(item, $event)"></uv-subsection>
						</view>
					</view>
					<uv-divider v-if="i < problemArr.length - 1"></uv-divider>
				</view>
			</template>
			<template v-if="type === 2">
				<view class="question-title">{{result.title}}</view>
				<view>{{result.tips}}</view>
			</template>
			<template v-if="type === 3">
				<view>
					{{ tips }}
				</view>
			</template>
		</question-box>
		
		<question-box v-if="type !== 0">
			<button type="primary" v-if="type == 1" @click="formSubmit">提交</button>
			<button class="mt20" :type="type == 1 ? '' : 'primary'" @click="onChooseImg">{{ getBtn() }}</button>
		</question-box>
	</view>
</template>

<script setup lang="ts">
	import { onLoad } from '@dcloudio/uni-app'
	import { ref } from 'vue';

	const imgUrl = ref('')

	const chatArr = ref([])
	const problemArr = ref([])

	const result = ref({
		title: '',
		tips: ''
	})
	const tips = ref('')

	// 0:加载中，1:问题中，2:答案，3:不是物品
	const type = ref(0)

	const subList = ref([
		'是', '否'
	])

	const imageAi = uniCloud.importObject('imageAi')
	const chatAi = uniCloud.importObject('chatAi')

	const getBtn = () => {
		switch(type.value){
			case 1:
				return '已有答案，继续拍照'
			case 2:
				return '继续拍照'
			case 3:
				return '知道啦！继续拍照！'
		}
	}

	const changeSub = (item, e) => {
		item.sub = e
	}
	
	const regArr = (str) => {
		const regex = /\[.*?\]/;
		const match = str.match(regex);
		
		if (match) {
			return match[0]
		} else {
		  console.log("没有找到匹配的 []");
		}
	}
	
	const formSubmit = async (e) => {
		const subObj = {
			content: [] as any,
			role: 'user'
		}
		
		subObj.content = problemArr.value.map(item => {
			return item.sub ? "否" : "是"
		})
	
		subObj.content = JSON.stringify(subObj.content)
		chatArr.value.push(subObj)
		
		chatArr.value.forEach(item => {
			if(Array.isArray(item.content)) {
				item.content = JSON.stringify(item.content)
			}
		})
		
		const chatAiRes = await chatAi.chat(chatArr.value)
		type.value = 2
		const r = JSON.parse(regArr(chatAiRes.completion.choices[0].message.content))
		result.value.title = r[0] 
		result.value.tips = r[1] 
	}

	const makeChatAi = async () => {
		const chatRes = await chatAi.chat(chatArr.value)

		const me = chatRes.completion.choices[0].message
		
		if(me.content.includes('[')) {
			me.content = JSON.parse(regArr(me.content))
			problemArr.value = me.content.map(item => {
				return {
					text: item,
					sub: 0
				}
			})
			chatArr.value.push(me)
			type.value = 1
		} else {
			// 不是物品
			tips.value = me.content
			type.value = 3
		}
	}

	const getQuery = async (url) => {
		imgUrl.value = url
		
		type.value = 0
		problemArr.value = []
		result.value = {
			title: '',
			tips: ''
		}
		chatArr.value = []
		
		const imageAiRes = await imageAi.lookImg(imgUrl.value)
		chatArr.value.push(imageAiRes.response.choices[0].message)

		makeChatAi()
	}
	
	const onChooseImg = () => {
		uni.$emit('uploadImg', true)
	}

	onLoad((options) => {
		uni.$on('question', (url) => {
			getQuery(url)
		})
		
		if (options.imgUrl) {
			getQuery(options.imgUrl)
		}
	})
</script>

<style lang="scss" scoped>
	.mt20 {
		margin-top: 20rpx;
	}
	.question {
		width: 100%;
		padding: 24rpx;
		box-sizing: border-box;

		&-image {
			width: 100%;
			height: 20vh;
		}

		&-item {
			display: flex;
			align-items: center;

			&_sub {
				width: 150rpx;
				flex-shrink: 0;
			}
		}
		
		&-title {
			font-size: 80rpx;
			margin-bottom: 24rpx;
			text-align: center;
		}
	}
</style>