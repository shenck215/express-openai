export const ErrorCodeMessage = {
	401: "[OpenAI] 提供错误的API密钥 | Incorrect API key provided",
	403: "[OpenAI] 服务器拒绝访问，请稍后再试 | Server refused to access, please try again later",
	502: "[OpenAI] 错误的网关 |  Bad Gateway",
	503: "[OpenAI] 服务器繁忙，请稍后再试 | Server is busy, please try again later",
	504: "[OpenAI] 网关超时 | Gateway Time-out",
	500: "[OpenAI] 服务器繁忙，请稍后再试 | Internal Server Error",
};

export const sendResponse = (options) => {
	if (options.type === "Success") {
		return Promise.resolve({
			message: options.message ?? null,
			data: options.data ?? null,
			status: options.type,
		});
	}

	return Promise.reject({
		message: options.message ?? "Failed",
		data: options.data ?? null,
		status: options.type,
	});
};
