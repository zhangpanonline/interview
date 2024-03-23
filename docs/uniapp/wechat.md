1. [uni 中使用微信小程序注意事项：](https://uniapp.dcloud.net.cn/tutorial/miniprogram-subject.html)
    1. 小程序组件需要放在项目特殊文件夹 wxcomponents（或 mycomponents、swancomponents）。HBuilderX 建立的工程 wxcomponents 文件夹在 项目根目录下。vue-cli 建立的工程 wxcomponents 文件夹在 src 目录下。可以在 vue.config.js 中自定义其他目录 
    2. 小程序组件的性能，不如vue组件。使用小程序组件，需要自己手动setData，很难自动管理差量数据更新。而使用vue组件会自动diff更新差量数据。所以如无明显必要，建议使用vue组件而不是小程序组件。比如某些小程序ui组件，完全可以用更高性能的uni ui替代。
    3. 当需要在 vue 组件中使用小程序组件时，注意在 pages.json 的 globalStyle 中配置 usingComponents，而不是页面级配置。
    4. 注意数据和事件绑定的差异，组件使用时应按照 vue 的数据和事件绑定方式
       * 属性绑定从 attr=""，改为 :attr="a"；从 title="复选框" 改为 :title="'复选框' + item"
       * 事件绑定从 bind:click="toggleActionSheet1" 改为 @click="toggleActionSheet1"，目前支付宝小程序不支持 vue 的事件绑定方式
       * 阻止事件冒泡 从 catch:tap="xx" 改为 @tap.native.stop="xx"
       * wx:if 改为 v-if
       * wx:for="" wx:key="" 改为v-for="(item,index) in list"
2. [常见业务场景](https://juejin.cn/post/7020680215009427470#heading-29)