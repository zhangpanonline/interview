import { WebSocketServer } from 'ws'
function createServer(port) {
  return new Promise(resolve => {
    const wss = new WebSocketServer({
      port
    }, () => {
      resolve(wss)
    })
  })
}
let count = 0
async function init(port) {
  const wss = await createServer(port)
  wss.on('connection', client => {
    client.on('message', e => {
      client.send('服务器回复消息！')
    })
  })
  const timer = setInterval(() => {
    wss.clients.forEach(client => {
      client.send(`服务器第 ${++count} 次自动回复消息！`)
    })
  }, 3000);
  wss.on('close', () => {
    console.log('服务器关闭')
    clearInterval(timer)
  })
}

init(9527)
console.log(`WebSocket 聊天室已启动，端口号：9527`);