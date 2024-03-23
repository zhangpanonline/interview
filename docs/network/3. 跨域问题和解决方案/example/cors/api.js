function login(loginId, loginPwd) {
  return request('post', 'https://study.duyiedu.com/api/user/login', {
    body: {
      loginId,
      loginPwd,
    },
  }).then((resp) => resp.body.data);
}

function chat(content) {
  return request('post', 'https://study.duyiedu.com/api/chat', {
    body: {
      content,
    },
  }).then((resp) => resp.body.data);
}
