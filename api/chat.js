import dotenv from "dotenv";
import { ChatGPTAPI } from "chatgpt";
import { sendResponse, ErrorCodeMessage } from "../utils/index.js";

dotenv.config();

const api = new ChatGPTAPI({
	apiBaseUrl: process.env.API_BASE_URL,
	apiKey: process.env.API_KEY,
});

export const chat = async ({ prompt, parentMessageId, onProcess }) => {
	try {
		const response = await api.sendMessage(prompt, {
			parentMessageId,
			onProgress: (res) => {
				onProcess(res);
			},
		});

		return sendResponse({ type: "Success", data: response });
	} catch (error) {
		const code = error.statusCode;
		global.console.log(error);
		if (Reflect.has(ErrorCodeMessage, code))
			return sendResponse({ type: "Fail", message: ErrorCodeMessage[code] });
		return sendResponse({
			type: "Fail",
			message: error.message ?? "Please check the back-end console",
		});
	}
};
