window.request = (() => {
  const TOKEN_KEY = '__token__';

  const request = async (method, url, options = {}) => {
    options.headers = options.headers || {};

    // 格式化options
    if (options.body && typeof options.body === 'object') {
      options.body = JSON.stringify(options.body);
      options.headers['content-type'] = 'application/json';
    }

    // 是否携带token
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      // 向请求头中加入内容
      options.headers.authorization = `Bearer ${token}`;
    }

    const resp = await fetch(url, {
      ...options,
      method: method.toUpperCase(),
    });
    const headers = Object.fromEntries(resp.headers.entries());

    // 检查头中的token
    if (headers.authorization) {
      localStorage.setItem(TOKEN_KEY, headers.authorization);
    }

    const body = await resp.json();
    return {
      headers,
      body,
    };
  };
  return request;
})();
