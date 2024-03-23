async function loadHeroes() {
  // 请求英雄数据
  const resp = await fetch('https://study.duyiedu.com/api/herolist');
  const body = await resp.json();
  const heroes = body.data;
  document.querySelector('.list').innerHTML = heroes
    .map(
      (h) => `<li>
  <a
    href="https://pvp.qq.com/web201605/herodetail/${h.ename}.shtml"
    target="_blank"
  >
    <img
      src="https://game.gtimg.cn/images/yxzj/img201606/heroimg/${h.ename}/${h.ename}.jpg"
      alt=""
    />
    <span>${h.cname}</span>
  </a>
</li>`
    )
    .join('');
}

loadHeroes();

function loadHeroes() {
  fetch('https://study.duyiedu.com/api/herolist')
    .then((resp) => resp.json())
    .then((body) => {
      const heroes = body.data;
      document.querySelector('.list').innerHTML = heroes
        .map(
          (h) => `<li>
    <a
      href="https://pvp.qq.com/web201605/herodetail/${h.ename}.shtml"
      target="_blank"
    >
      <img
        src="https://game.gtimg.cn/images/yxzj/img201606/heroimg/${h.ename}/${h.ename}.jpg"
        alt=""
      />
      <span>${h.cname}</span>
    </a>
  </li>`
        )
        .join('');
    });
}
