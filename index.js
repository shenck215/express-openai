import express from "express";
import http from "http";
import https from "https";
import bodyParser from "body-parser";
import fs from "fs";
import cors from "cors";

import { chat } from "./api/index.js";

const app = express();

app.use(express.static("public"));
app.use(express.json());

app.use(cors());
// 解析 application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// 解析 application/json
app.use(bodyParser.json());

// 确保所有HTTP请求都被重定向到HTTPS
// app.use((req, res, next) => {
// 	if (!req.secure) {
// 		return res.redirect(["https://", req.get("Host"), req.url].join(""));
// 	}
// 	next();
// });

const router = express.Router();

router.post("/chat", [], async (req, res) => {
	res.setHeader("Content-Type", "text/event-stream");
	res.setHeader("Cache-Control", "no-cache");
	res.setHeader("Connection", "keep-alive");
	res.flushHeaders();

	try {
		const { prompt, parentMessageId } = req.body;
		let firstChunk = true;
		await chat({
			prompt,
			parentMessageId,
			onProcess: (chat) => {
				const content = firstChunk
					? JSON.stringify(chat)
					: `\n${JSON.stringify(chat)}`;
				res.write(content);
				firstChunk = false;
			},
		});
	} catch (error) {
		res.write(JSON.stringify(error));
	} finally {
		res.end();
	}
});

app.use("", router);
app.use("/api", router);

const privateKey = fs.readFileSync("cert/openai-pro.cn.key", "utf8");
const certificate = fs.readFileSync("cert/openai-pro.cn.pem", "utf8");

// 创建HTTP和HTTPS服务器
const httpServer = http.createServer(app);
const httpsServer = https.createServer(
	{
		key: privateKey,
		cert: certificate,
	},
	app
);

// 监听HTTP和HTTPS端口
httpServer.listen(2333, () => {
	console.log("HTTP server listening on port 2333");
});

// httpsServer.listen(23333, () => {
// 	console.log("HTTPS server listening on port 23333");
// });
