<template>
  <div class="w-screen h-screen overflow-y-auto">
    <ScaleBox>
      <div
        class="w-full h-1/2 border border-black bg-slate-300"
        ref="echartRef1"
      ></div>
      <div class="h-1/2 w-full flex justify-between">
        <div
          class="w-1/2 h-full border border-black bg-slate-300"
          ref="echartRef2"
        ></div>
        <div
          class="w-1/2 h-full border border-black bg-slate-300"
          ref="echartRef3"
        ></div>
      </div>
    </ScaleBox>
  </div>
</template>
<script>
import ScaleBox from "./ScaleBox.vue";
import * as echarts from "echarts";
export default {
  name: "bigScreen",
  components: {
    ScaleBox,
  },
  data() {
    return {};
  },
  mounted() {
    const options = {
      xAxis: {
        type: "category",
        data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          data: [150, 230, 224, 218, 135, 147, 260],
          type: "line",
        },
      ],
    };
    echarts.init(this.$refs.echartRef1).setOption(options);
    echarts.init(this.$refs.echartRef2).setOption(options);
    echarts.init(this.$refs.echartRef3).setOption(options);
  },
};
</script>
