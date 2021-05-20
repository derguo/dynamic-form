<template>
  <el-form
    ref="form"
    :inline="false"
    :model="submitDate"
    label-position="left"
    v-bind="$attrs"
    class="formStyle"
  >
    <el-row :gutter="10">
      <template v-for="(item, name) in relyData">
        <el-col
          v-show="item.show !== false"
          v-if="item.used !== false"
          :key="name"
          :span="24 / columnNo"
        >
          <div class="indent" v-if="item.indent"></div>
          <div class="help">
            <el-popover
              v-if="item.help"
              placement="top-start"
              trigger="hover"
              width="400"
            >
              <el-table :data="item.help" :border="false" :show-header="false">
                <el-table-column
                  property="title"
                  width="120px"
                ></el-table-column>
                <el-table-column property="content"></el-table-column>
              </el-table>
              <i slot="reference" class="el-icon-question"></i>
            </el-popover>
          </div>
          <div style="overflow: hidden">
            <el-form-item :prop="name" :label="item.label" :rules="item.rules">
              <el-input
                v-model="submitDate[name]"
                v-if="item.type == 'input'"
                v-bind="item.attributes"
                v-on="item.events"
                @input="changeHandle(name, $event)"
              ></el-input>
              <el-radio-group
                v-model="submitDate[name]"
                v-if="item.type == 'radio'"
                v-bind="item.attributes"
                v-on="item.events"
                @change="changeHandle(name, $event)"
              >
                <el-radio
                  v-for="date in item.option.data"
                  v-bind="
                    item.option &&
                    item.option.attrLogic &&
                    item.option.attrLogic(date)
                  "
                  v-on="
                    item.option &&
                    item.option.eventLogic &&
                    item.option.eventLogic(date)
                  "
                  :label="
                    date[(item.props && item.props.valueFeild) || 'value']
                  "
                  :key="date[(item.props && item.props.valueFeild) || 'value']"
                >
                  {{ date[(item.props && item.props.labelFeild) || "label"] }}
                </el-radio>
              </el-radio-group>
              <el-checkbox-group
                v-model="submitDate[name]"
                v-if="item.type == 'checkbox'"
                v-bind="item.attributes"
                v-on="item.events"
                @change="changeHandle(name, $event)"
              >
                <el-checkbox
                  v-for="date in item.option.data"
                  v-bind="item.option.attrLogic(date)"
                  v-on="item.option.eventLogic(date)"
                  :label="date[item.props.valueFeild]"
                  :key="date[item.props.valueFeild]"
                >
                  {{ date[item.props.labelFeild] }}
                </el-checkbox>
              </el-checkbox-group>
              <el-select
                v-model="submitDate[name]"
                v-if="item.type == 'select'"
                v-bind="item.attributes"
                v-on="item.events"
                @change="changeHandle(name, $event)"
                style="width: 100%"
              >
                <el-option
                  v-for="date in item.option && item.option.data"
                  :key="date[(item.props && item.props.valueFeild) || 'value']"
                  :label="
                    date[(item.props && item.props.labelFeild) || 'label']
                  "
                  :value="
                    date[(item.props && item.props.valueFeild) || 'value']
                  "
                  :disabled="date.disabled"
                >
                  <slot :name="name" :data="date" :node="node"></slot>
                </el-option>
              </el-select>
              <el-cascader
                v-model="submitDate[name]"
                v-if="item.type == 'cascader'"
                v-bind="item.attributes"
                v-on="item.events"
                @change="changeHandle(name, $event)"
                collapse-tags
                style="width: 100%"
              >
                <template v-slot="{ node, data }">
                  <slot :name="name" :data="data" :node="node"></slot>
                </template>
              </el-cascader>
              <el-date-picker
                v-model="submitDate[name]"
                v-if="item.type == 'datePicker'"
                v-bind="item.attributes"
                v-on="item.events"
                @change="changeHandle(name, $event)"
                style="width: 100%"
              ></el-date-picker>
            </el-form-item>
          </div>
        </el-col>
      </template>
    </el-row>
    <el-row>
      <el-col span="12">{{ submitDate }}</el-col>
      <el-col span="12"></el-col>
    </el-row>
  </el-form>
</template>

<script>
import cloneDeep from "lodash/cloneDeep";

export default {
  name: "customizeForm",
  model: {
    prop: "modelDate",
    event: "changeModelDate",
  },
  props: {
    relyData: {
      type: Object,
      default: {},
    },
    modelDate: {
      type: Object,
      default: {},
    },
    columnNo: {
      type: Number,
      default: 1,
    },
  },
  data() {
    return {
      watches: [],
    };
  },
  methods: {
    /**
     * 每一项数据变化的时候都要抛出事件，双向绑定生效
     */
    changeHandle: (function () {
      let timer;
      return function (type, e) {
        this.$emit("changeModelDate", this.submitDate);
        this.$emit("change", type, e);
      };
    })(),
    /**
     * 重置表单数据为初始值，注意！是初始值并不是把所有相都制空
     */
    resetFields() {
      this.$nextTick(() => {
        this.$refs["form"].resetFields();
        this.$emit("changeModelDate", this.submitDate);
      });
    },
    /**
     * 清空所有表单数据
     */
    cleanFields() {
      this.$emit("changeModelDate", {});
    },
    /**
     * 获取表单项实例
     */
    refs(ref) {
      return this.$refs[ref];
    },
    /**
     * 表单提验证方法
     *
     * 提交表单之前验证数据的方法
     * 回调函数接受两个参数，valid：是否验证通过。第二参数有两种情况，当验证通过的是第二参数为表单数据，当表单没有通过验证，第二个参数是，没有通过表单项的数组。
     */
    validate(callback) {
      this.$nextTick(() => {
        this.$refs["form"].validate((valid, failedField) => {
          if (valid) {
            callback(valid, this.submitDate);
          } else {
            callback(valid, failedField);
          }
        });
      });
    },
  },
  computed: {
    submitDate() {
      let r = cloneDeep(this.modelDate);
      // for (const w of this.watches) {
      //     w();
      // }
      // this.watches = [];
      for (let key in this.relyData) {
        if (this.relyData[key].used !== false) {
          switch (this.relyData[key].type) {
            case "checkbox":
              r[key] =
                this.modelDate[key] === undefined ? [] : this.modelDate[key];
              break;
            default:
              r[key] = this.modelDate[key];
              break;
          }

          // this.watches.push(
          //     this.$watch('modelDate.' + key, function name(val) {
          //         console.log('外变化', val, this);
          //     })
          // );
        }
      }
      return r;
    },
  },
};
</script>

<style scoped>
.formStyle {
  text-align: left;
}
.el-checkbox-group {
  height: 36px !important;
}
.indent {
  float: left;
  width: 50px;
  height: 36px;
}
.help {
  float: right;
  width: 36px;
  height: 36px;
  text-align: center;
  line-height: 36px;
  font-size: 18px;
}
</style>