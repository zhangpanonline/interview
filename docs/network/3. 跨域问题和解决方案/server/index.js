const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(bodyParser.json());

// jsonp
app.get('/jsonp', (req, res) => {
  const cbname = req.query.callback || 'callback';
  const data = {
    msg: '来自服务器的消息',
  };
  res.set('content-type', 'application/json');
  res.end(`${cbname}(${JSON.stringify(data)})`);
});

// proxy
app.get('/hero', async (req, res) => {
  const axios = require('axios');
  const resp = await axios.get('https://pvp.qq.com/web201605/js/herolist.json');
  // 使用CORS解决对代理服务器的跨域
  res.header('access-control-allow-origin', '*');
  res.send(resp.data);
});

const PORT = 9527;

app.listen(PORT, () => {
  console.log(`server start on port ${PORT}`);
});
