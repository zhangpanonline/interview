var { createUserContent, createRobotContent } = (() => {
  marked.setOptions({
    highlight: function (code, lang) {
      if (lang && hljs.getLanguage(lang)) {
        return hljs.highlight(code, { language: lang }).value;
      }
      return hljs.highlightAuto(code).value;
    },
  });
  const txt = document.querySelector('.send textarea');
  txt.addEventListener('input', () => {
    txt.style.height = 'auto';
    txt.style.height = txt.scrollHeight + 'px';
  });
  const main = document.querySelector('.main');

  function _createUserContent(username, content) {
    const dom = document.createElement('div');
    dom.className = 'user block';
    dom.innerHTML = ` <div class="container">
    <div class="avatar">
      ${username}
    </div>
    <div class="content markdown-body">
      ${_normalizeContent(content)}
    </div>
  </div>`;
    const hitBottom = isBottom();
    main.appendChild(dom);
    if (hitBottom) {
      document.documentElement.scrollTo(0, 1000000);
    }
  }

  function _normalizeContent(content) {
    const html = marked.parse(content, {
      breaks: true,
      gfm: true,
    });
    return html;
  }
  const textarea = document.querySelector('.send textarea');
  function createUserContent(username) {
    const content = textarea.value.trim();
    _createUserContent(username, content);
    textarea.value = '';
    textarea.style.height = 'auto';
  }
  function _getLastTextNode(dom) {
    const children = dom.childNodes;
    for (let i = children.length - 1; i >= 0; i--) {
      const node = children[i];
      if (node.nodeType === Node.TEXT_NODE && /\S/.test(node.nodeValue)) {
        node.nodeValue = node.nodeValue.replace(/\s+$/, '');
        return node;
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const last = _getLastTextNode(node);
        if (last) {
          return last;
        }
      }
    }
    return null;
  }
  function _updateCursor(dom) {
    const contentDom = dom;
    const lastText = _getLastTextNode(contentDom);
    const textNode = document.createTextNode('\u200b');
    if (lastText) {
      lastText.parentElement.appendChild(textNode);
    } else {
      contentDom.appendChild(textNode);
    }
    const domRect = contentDom.getBoundingClientRect();
    const range = document.createRange();
    range.setStart(textNode, 0);
    range.setEnd(textNode, 0);
    const rect = range.getBoundingClientRect();
    const x = rect.left - domRect.left;
    const y = rect.top - domRect.top;
    dom.style.setProperty('--x', `${x}px`);
    dom.style.setProperty('--y', `${y}px`);
    textNode.remove();
  }

  function isBottom() {
    return (
      Math.abs(
        document.documentElement.scrollTop +
          document.documentElement.clientHeight -
          document.documentElement.scrollHeight
      ) < 20
    );
  }

  function createRobotContent() {
    const dom = document.createElement('div');
    dom.className = 'robot block typing';
    dom.innerHTML = ` <div class="container">
    <div class="avatar">
    <img src="./asset/gpt-avatar.svg" alt="" />
    </div>
    <div class="content markdown-body" style="--x: -1000px; --y: 0px"></div>
  </div>`;
    const contentDom = dom.querySelector('.content');
    let content = '';
    main.appendChild(dom);
    _updateCursor(contentDom);
    const form = document.querySelector('.send');
    form.classList.add('waiting');
    function append(text) {
      content += text;
      const html = _normalizeContent(content);
      const hitBottom = isBottom();

      contentDom.innerHTML = html;
      if (hitBottom) {
        document.documentElement.scrollTo(0, 1000000);
      }
      _updateCursor(contentDom);
    }

    return {
      append,
      over() {
        dom.classList.remove('typing');
        form.classList.remove('waiting');
      },
    };
  }

  return {
    createUserContent,
    createRobotContent,
    isBottom,
  };
})();
