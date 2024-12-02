
const OpenAI = require('openai')
const openai = new OpenAI({
	// 若没有配置环境变量，请用百炼API Key将下行替换为：apiKey: "sk-xxx",
	apiKey: 'sk-ef69435e07b44389b1620174d81554e0',
	baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1"
});

module.exports = {
	_before: function () { // 通用预处理器

	},
	
	async lookImg(url) {
		const clientInfo =  this.getClientInfo()
		if(!clientInfo.uniIdToken) {
			return {
				data: '请登录'
			}
		}
		
		const response = await openai.chat.completions.create({
			model: "qwen-vl-plus",
			messages: [{
				role: "user",
				content: [{
						type: "image_url",
						image_url: {
							url
						}
					},
					{
						type: "text",
						text: `
								请提取出照片中的主体，然后详细描述一下这个主体的外观。如果是物品，那么描述一下新旧程度，如果你知道这个物品的型号的话，请描述。注意：不需要描述背景，不需要描述除了主体以外的东西。
								如果主体不是物品，则描述该只物体的外观。
							`
					}
				]
			}]
		});
		
		return {
			response
		}
	}
}
