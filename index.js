import express from 'express';
import { middleware, Client } from '@line/bot-sdk';

const config = {
  channelAccessToken: '你的 channel access token',
  channelSecret: '你的 channel secret',
};

const app = express();

// ✅ 加這一行！用來解析 JSON
app.use(express.json());

app.post('/webhook', middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error(err); // ✅ 加上錯誤紀錄
      res.status(500).end();
    });
});

const client = new Client(config);

function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }

  return client.replyMessage(event.replyToken, {
    type: 'text',
    text: event.message.text,
  });
}

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`LINE Bot is running on port ${port}`);
});
