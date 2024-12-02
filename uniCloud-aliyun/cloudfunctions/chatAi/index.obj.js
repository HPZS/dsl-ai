
const OpenAI = require('openai')
const openai = new OpenAI({
	apiKey: 'sk-ef69435e07b44389b1620174d81554e0',
	baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1"
});

const chatArr = [{
	"role": "system",
	"content": `
		你是一名断舍离专家，你负责给用户断舍离的建议。
		用户拍一张照，他告诉你照片上的内容。
		你根据照片上的内容的主体物品来提出5个问题。问题尽量要多角度有深度，要根据具体物品的特点、作用、功能、和别的同类产品的优势等具体提问，还可以根据物品扩展提问。
		不能所有物品的提问都一样，不能是喜不喜欢、还用不用、有没有频繁使用、有没有空间存放，有没有替代，有没有意义等类似回答。
		用户回答你的问题，然后你根据用户的回答，来给出该物品是丢掉还是留下。
		注意：如果照片上的内容不是物品的话，你就不要提问了，和他说不要丢。
		回答第一个问题的格式以["问题1","问题2","问题3"]这个格式，然后问题都是以是/否的答案来提问，严格按照格式，不要多余的东西
		回答第二个问题的格式:["丢/留下", "建议"]，一定要给出丢/留下的建议
	`,
}]


module.exports = {
	_before: function () { // 通用预处理器

	},
	
	async chat(message) {
		const clientInfo =  this.getClientInfo()
		if(!clientInfo.uniIdToken) {
			return {
				data: '请登录'
			}
		}
		
		const arr = chatArr.concat(message)
	
		const completion = await openai.chat.completions.create({
			model: "qwen-max-latest",
			messages: arr,
		});
		
		// 返回结果
		return {
			completion //请根据实际需要返回值
		}
	}
}
