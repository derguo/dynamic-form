<template>
  <div class="hello">
    <my-form :applicationType="applicationType" :basicData="basicData"></my-form>
  </div>
</template>

<script>
import myForm from "./form/customizeFormControl";
import {
  getIncreServiceList,
  getIncreTaskList,
  getDictListV1,
  increTaskDelete,
  increTaskStart,
  increTaskStop,
  getIncreServiceDbInfo,
  increTaskSave,
  increTaskUpdate,
  getCdmvAndDbName,
} from "@/api/incre/incre_param_detail";
export default {
  name: "HelloWorld",
  components: { myForm },
  data() {
    return {
      applicationType: [],
      basicData:{},
    }
  },
  props: {
    msg: String,
  },
  methods: {
    test() {
      let str = "{wasd&11}-11+{sss&22}";
      let reg = /[^{[a-zA-z]+&[0-9]+}|[0-9]+|[-=*/]]/g;
    },
  },
  beforeCreate() {
    console.log("父集开始构建-一+++++++++++++", this.applicationType);
  },
  created() {
    console.log("父集构建结束-二+++++++++++++", this.applicationType);
    getDictListV1("").then(({data}) => {
      this.basicData = data.data;
      console.log('加载基础数据：', this.basicData);
    });
  },
  beforeMount() {
    console.log('父级开始渲染-三+++++++++++++', this.applicationType);
  },
  mounted() {
    console.log('父级渲染结束-四+++++++++++++', this.applicationType);
    
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
