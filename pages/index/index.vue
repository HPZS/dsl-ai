<template>
	<view>
		<button @click="chooseImg">选择图片</button>



		<form @submit="formSubmit" v-show="problemArr.length !== 0">
			<view v-for="(item, i) in problemArr" :key="i">
				<view>{{item}}</view>
				<radio-group :name="`radio${i}`">
					<label>
						<radio value="是" /><text>是</text>
					</label>
					<label>
						<radio value="否" /><text>否</text>
					</label>
				</radio-group>
			</view>

			<button form-type="submit">Submit</button>
		</form>

		<view v-show="problemArr.length === 0">
			<view v-for="item in result">
				<view>{{item}}</view>
			</view>
		</view>
	</view>
</template>

<script lang="ts" setup>
	import { ref } from 'vue'

	const chatArr = ref([])
	const problemArr = ref([])
	const result = ref([])

	// 识别图片内容
	const openAitest = uniCloud.importObject('openAitest')
	const chatAi = uniCloud.importObject('chatAi')

	const formSubmit = async (e) => {
		const formdata = e.detail.value
		const subObj = {
			content: [] as any,
			role: 'user'
		}
		for (const key in formdata) {
			subObj.content.push(formdata[key])
		}

		subObj.content = JSON.stringify(subObj.content)
		chatArr.value.push(subObj)
		chatArr.value[1].content = JSON.stringify(chatArr.value[1].content)
		console.log('chatArr.valuechatArr.value', chatArr.value)

		const chatAiRes = await chatAi.method1(chatArr.value)
		chatArr.value = []
		problemArr.value = []
		console.log('formSubmitformSubmit', chatAiRes)

		result.value = JSON.parse(chatAiRes.completion.choices[0].message.content)
	}

	async function openAitestApi(url) {
		console.log("开始....")
		try {
			const res = await openAitest.method1(url) //导入云对象后就可以直接调用该对象的方法了，注意使用异步await
			uni.showToast({
				title: '调用成功'
			})

			chatArr.value.push(res.response.choices[0].message)
			console.log("resres", res.response.choices[0].message)

			const chatAiRes = await chatAi.method1(chatArr.value)
			const me = chatAiRes.completion.choices[0].message
			me.content = JSON.parse(me.content)
			console.log("chatAiRes", me)
			problemArr.value = me.content
			chatArr.value.push(me)


		} catch (e) {
			// 符合uniCloud响应体规范 https://uniapp.dcloud.net.cn/uniCloud/cf-functions?id=resformat，自动抛出此错误
			uni.showModal({
				title: '创建失败',
				content: e.errMsg,
				showCancel: false
			})
		}
	}

	// 选择图片
	const chooseImg = () => {
		uni.chooseImage({
			count: 1,
			sizeType: ['compressed'], //可以指定是原图还是压缩图，默认二者都有
			success: function (res) {
				const file = res.tempFiles[0];

				if (file) {
					const reader = new FileReader();
					reader.onloadend = function () {
						const base64String = reader.result.replace('data:', '').replace(/^.+,/, '');
						openAitestApi(base64String)
					};
					reader.readAsDataURL(file);
				} else {
					console.log('No file selected');
				}
			}
		});
	}
</script>

<style>
</style>