const $ = document.querySelector.bind(document);
const doms = {
  img: $('.preview'),
  container: $('.upload'),
  select: $('.upload-select'),
  selectFile: $('.upload-select input'),
  progress: $('.upload-progress'),
  cancelBtn: $('.upload-progress button'),
  delBtn: $('.upload-result button'),
};

function showArea(areaName) {
  doms.container.className = `upload ${areaName}`;
}

function setProgress(value) {
  doms.progress.style.setProperty('--percent', value);
}

doms.selectFile.onchange = (e) => {
  const file = e.target.files[0];
  showArea('progress');
  setProgress(0);
  const reader = new FileReader(); // 新建文件读取器
  reader.onload = (e) => {
    const dataUrl = e.target.result;
    doms.img.src = dataUrl;
  };
  reader.readAsDataURL(file); // 读取为 DataURL

  // 上传文件
  upload(file);
};

function upload(file) {
  const xhr = new XMLHttpRequest();
  const url = 'http://myserver.com:9527/upload/single';
  xhr.open('POST', url);
  xhr.onload = () => {
    showArea('result');
  };
  xhr.upload.onprogress = (e) => {
    const p = Math.floor((e.loaded / e.total) * 100);
    setProgress(p);
  };

  const formData = new FormData();
  formData.append('avatar', file);
  xhr.send(formData);
}

// class BufferBuilder {
//   buffer = new ArrayBuffer(0);

//   static string2Buffer(str) {
//     const encoder = new TextEncoder();
//     return encoder.encode(str).buffer;
//   }

//   static buffer2String(buf) {
//     const decoder = new TextDecoder();
//     return decoder.decode(buf);
//   }

//   toString() {
//     return BufferBuilder.buffer2String(this.buffer);
//   }

//   toBuffer() {
//     return this.buffer;
//   }

//   appendString(str) {
//     const buf = BufferBuilder.string2Buffer(str);
//     this.appendBuffer(buf);
//   }

//   appendBuffer(buf) {
//     const newBuffer = new ArrayBuffer(this.buffer.byteLength + buf.byteLength);
//     const newUint8Array = new Uint8Array(newBuffer);
//     newUint8Array.set(new Uint8Array(this.buffer), 0);
//     newUint8Array.set(new Uint8Array(buf), this.buffer.byteLength);
//     this.buffer = newBuffer;
//   }
// }

// function upload(file) {
//   const xhr = new XMLHttpRequest();
//   const url = 'http://myserver.com:9527/upload/single';
//   xhr.open('POST', url);

//   xhr.setRequestHeader('Content-Type', 'multipart/form-data; boundary=aaa');

//   const bfBuilder = new BufferBuilder();
//   bfBuilder.appendString(
//     '--aaa\r\nContent-Disposition: form-data; name="avatar"; filename="1.png"\r\nContent-Type: image/png\r\n\r\n'
//   );

//   const reader = new FileReader();
//   reader.onload = (e) => {
//     bfBuilder.appendBuffer(e.target.result);
//     bfBuilder.appendString('\r\n--aaa--');
//     // 得到完整的二进制数据
//     const bf = bfBuilder.toBuffer();
//     xhr.send(bf);
//   };
//   reader.readAsArrayBuffer(file);
// }
