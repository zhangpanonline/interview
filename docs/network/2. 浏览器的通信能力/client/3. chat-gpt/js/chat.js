fetch('http://myserver.com:7010/chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    clear: true,
  }),
});

// 获取form
const form = document.querySelector('form');
const textArea = document.querySelector('textarea');

textArea.onkeydown = (e) => {
  if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey && !e.altKey) {
    e.preventDefault();
    form.dispatchEvent(new Event('submit'));
  }
};

form.onsubmit = async (e) => {
  e.preventDefault();
  const content = textArea.value;
  createUserContent('袁');
  const robot = createRobotContent();
  const resp = await fetch('http://myserver.com:7010/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      content,
    }),
  });
  // 流式读取
  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  while (1) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }
    const txt = decoder.decode(value);
    robot.append(txt);
  }
  robot.over();
};
