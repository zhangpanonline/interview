// 合并两个模块
const modules = {
  "./src/a.js": function (module, exports) {
    console.log('module a')
    module.exports = 'a'
  },
  "./src/index.js": function (module, exports, _webpack__require) {
    console.log('index module')
    eval("console.log('sourceURL')\n\n//# sourceURL=webpack:///./src/a.js?");
    const a = _webpack__require('./src/a.js')
    console.log(a)
  }
};

(function (modules) {
  // 缓存模块导出结果
  const moduleExports = {}
  function _webpack__require(moduleId) {
    if (moduleExports[moduleId]) return moduleExports[moduleId];

    const func = modules[moduleId]
    const module = {
      exports: ''
    }
    func(module, module.exports, _webpack__require)
    return module.exports
  }

  _webpack__require('./src/index.js')
})(modules)