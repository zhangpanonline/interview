const express = require('express');
const app = express();
app.get('/text/1.txt', (req, res) => {
  res.setHeader('Content-Type', 'text/plain;charset=utf-8');
  res.statusCode = 301;
  res.end(`两只老虎爱跳舞`);
});

const PORT = 9527;

app.listen(PORT, () => {
  console.log(`server start on port ${PORT}`);
});
