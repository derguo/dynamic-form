<template>
  <div>
    <customize-form
      ref="form"
      v-model="subData"
      label-width="170px"
      :relyData="basicForm"
      :disabled="formDisabled"
      @change="formChange"
    >
      <template v-slot:enDeCryptColumnList="{data}">
        <span>{{ data.column_cn_name }} - {{ data.column_name }}</span>
      </template>
      <template v-slot:cleanKey="{data}">
        <span>{{ data.tableCnName }} - {{ data.tableName }}</span>
      </template>
      <template v-slot:nlpField="{data}">
        <span>{{ data.column_cn_name }} - {{ data.column_name }}</span>
      </template>
      <template v-slot:nlpPkField="{data}">
        <span>{{ data.column_cn_name }} - {{ data.column_name }}</span>
      </template>
    </customize-form>
    <el-button @click="ccc">ok</el-button>
    {{ this.basicForm }}
  </div>
</template>

<script>
import customizeForm from '@/components/form/customizeForm';
import cloneDeep from 'lodash/cloneDeep';

export default {
  name: 'OperationDialog',
  components: {customizeForm},
  props: {
    formDisabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      fullShow: false,
      modleShow: false,
      subData: {},
      basicForm: {
        id: {
          type: 'input',
          label: 'id',
          used: false,
        },
        applicationType: {
          type: 'select',
          label: '应用类型',
          action: {
            field: {
              0: ['cdrUrl'],
              1: ['tableBoundary', 'researchAddUrl', 'tableNames', 'archivingComplete'],
              7: ['empiUrl'],
            },
            value: {
              field: 'value',
            },
          },
          attributes: {
            disabled: false,
          },
          events: {
            // change: this.applicationTypeChange,
          },
          props: {
            labelFeild: 'name',
            valueFeild: 'value',
          },
          option: {
            type: 'props',
            source: ['basicData', 'applicationType'],
            data: [],
          },
          help: [
            {
              title: 'NLP后结构化同步至全量清洗库',
              content:
                '根据指定表配置的大文本字段做后结构化，把后结构化后得到的数据同步到全量清洗库nlp_entity、nlp_entity_relation表中。',
            },
          ],
          rules: [{required: true, message: '应用类型不能为空', trigger: 'blur'}],
        },
        empiUrl: {
          type: 'input',
          label: '增量EMPI服务地址',
          used: false,
          rules: [
            {
              required: true,
              message: '增量EMPI服务地址不能为空',
              trigger: 'blur',
            },
          ],
        },
        cdrUrl: {
          type: 'input',
          label: 'Cdr地址',
          used: false,
          rules: [{required: true, message: 'Cdr地址不能为空', trigger: 'blur'}],
        },
        nlpUrl: {
          type: 'input',
          label: 'nlp后结构化地址',
          used: false,
          rules: [],
        },
        researchAddUrl: {
          type: 'input',
          label: 'searchService录入地址',
          used: false,
          rules: [
            {
              required: true,
              message: 'searchService录入地址不能为空',
              trigger: 'blur',
            },
          ],
        },
        // researchQueryUrl: {
        //     type: 'input',
        //     label: 'searchService查询地址',
        //     used: false,
        //     rules: [{required: true, message: 'searchService查询地址不能为空', trigger: 'blur'}],
        // },
        // name: {
        //     type: 'input',
        //     label: '任务名称',
        //     next: 'mainTableCn',
        //     show: true,
        //     used: true,
        //     attributes: {
        //         placeholder: '请填写增量任务名称',
        //     },
        //     rules: [{required: true, message: '增量任务名称不能为空', trigger: 'blur'}],
        // },
        mainTableCn: {
          type: 'input',
          label: '任务名称',
          next: 'mainTableEn',
          attributes: {
            placeholder: '请填写增量主表中文名称',
          },
          rules: [
            {
              required: true,
              message: '增量主表中文名称不能为空',
              trigger: 'blur',
            },
          ],
        },
        mainTableEn: {
          type: 'cascader',
          label: '指定任务表',
          attributes: {
            key: 1,
            ref: 'mainTableEn',
            'show-all-levels': false,
            clearable: true,
            filterable: true,
            disabled: false,
            props: {
              expandTrigger: 'hover',
              multiple: false,
              value: 'enName',
              label: 'name',
              emitPath: false,
            },
            options: [], //[this.dbInfo[0]],
          },
          events: {
            change: this.mainTableEnChange,
          },
          rules: [
            {
              required: true,
              message: '增量主表英文名称不能为空',
              trigger: 'blur',
            },
          ],
        },
        tableBoundary: {
          type: 'select',
          label: '增量范围',
          next: 'triggers',
          used: false,
          attributes: {
            placeholder: '增量范围',
            disabled: false,
          },
          events: {
            change: this.tableBoundaryChange,
          },
          props: {
            labelFeild: 'name',
            valueFeild: 'value',
          },
          option: {
            type: 'props',
            source: ['basicData', 'tableBoundary'],
            data: [], //this.basicData["TableBoundary"],
          },
          rules: [{required: true, message: '增量范围不能为空', trigger: 'blur'}],
        },
        tableNames: {
          type: 'cascader',
          label: '指定多表',
          used: false,
          next: 'triggers',
          attributes: {
            key: 100,
            placeholder: '请选择增量数据表',
            'show-all-levels': false,
            clearable: true,
            filterable: true,
            disabled: false,
            props: {
              expandTrigger: 'hover',
              multiple: true,
              value: 'enName',
              label: 'name',
              emitPath: false,
            },
            options: [], //[this.dbInfo[0]],
          },
          events: {
            change: this.tableNamesChange,
          },
          rules: [
            {validator: this.findTable, trigger: 'change'},
            {
              required: true,
              message: '获取增量数据表不能为空',
              trigger: 'blur',
            },
          ],
        },
        triggers: {
          type: 'select',
          label: '增量方式',
          next: 'archivingComplete',
          show: false,
          props: {
            labelFeild: 'name',
            valueFeild: 'value',
          },
          events: {
            change: this.triggersChange,
          },
          option: {
            data: [], //this.basicData["TriggerType"],
          },
          rules: [{required: true, message: '增量范围不能为空', trigger: 'blur'}],
        },
        archivingComplete: {
          type: 'select',
          label: '归档方式',
          next: 'oneCount',
          show: true,
          used: false,
          events: {
            change: this.archivingCompleteChange,
          },
          props: {
            labelFeild: 'name',
            valueFeild: 'value',
          },
          option: {
            data: [], //this.basicData["ArchivingType"],
          },
          help: [
            {
              title: '数据最后入库时间',
              content: '据入增量库时间， 数据在增量库如果有更新，指数据最后更新时间。来源于增量库表内SBMT_TIME 字段. ',
            },
            {
              title: '(住院就诊出院/门诊就诊） 后14天',
              content:
                '依据(就诊基本信息表)visit_info表的（就诊类别）VISIT_TYPE字段值， 当值为1 时认定为是住院就诊， 为空或者为其他值时认定为门诊就诊。住院就诊时取"(就诊基本信息表)visit_info"表的“出院日期(DISCHARGE_DATE)”作为时间判断依据取其后14天的数据。门诊就诊时获取"(就诊基本信息表)visit_info"表的“(入院（就诊）时间)ADMISSION_DATE"作为时间判断依据取其后14天的数据。如果时间字段为空值 ，或者转规范时间格式后为空， 则此就诊数据不会入科研系统。',
            },
          ],
          rules: [
            {
              required: true,
              message: '增量归档完成条件不能为空',
              trigger: 'blur',
            },
          ],
        },
        otherDay: {
          type: 'input',
          label: '其他天',
          used: false,
          rules: [
            {required: true, message: '其他天不能为空', trigger: 'blur'},
            {validator: this.isNum, trigger: 'blur'},
          ],
        },
        mergeFlag: {
          type: 'radio',
          label: '是否与历史数据合并',
          used: false,
          events: {
            change: this.mergeFlagChange,
          },
          option: {
            data: [
              {label: '是', value: 1},
              {label: '否', value: 0},
            ],
          },
          help: [
            {
              title: '是否与历史数据合并',
              content: '是否依据uuid(患者主索引)将获得的新数据和科研应用内的数据合并',
            },
          ],
          rules: [
            {
              required: true,
              message: '是否历史数据合并不能为空',
              trigger: 'blur',
            },
          ],
        },
        oneCount: {
          type: 'input',
          label: '单次获取数据条数',
          next: 'timelinessRequirements',
          rules: [
            {
              required: true,
              message: '单次获取数据数量不能为空',
              trigger: 'blur',
            },
            {validator: this.isNum, trigger: 'blur', max: 4},
          ],
        },
        timelinessRequirements: {
          type: 'input',
          label: '实时性要求(分钟)',
          next: 'lashUpdateRecordLocation',
          help: [
            {
              title: '实时性要求(分钟)',
              content: '若无新数据产生，任务会休眠1分钟后再次查询是否有新数据，依然无数据时就会休眠2分钟以此类推轮询。',
            },
          ],
          rules: [
            {
              required: true,
              message: '增量实时性要求不能为空',
              trigger: 'blur',
            },
            {validator: this.timelinessRequirementsR, trigger: 'blur'},
          ],
        },
        lashUpdateRecordLocation: {
          type: 'datePicker',
          label: '上次更新记录位置时间',
          next: 'cleanFlag',
          attributes: {
            type: 'datetime',
            format: 'yyyy-MM-dd HH:mm:ss',
            'value-format': 'yyyy-MM-dd HH:mm:ss',
          },
          help: [
            {
              title: '上次更新记录位置时间',
              content: '指定表中数据同步到数据入库的时间。修改这个时间可以指定再次启动任务起始数据位置。',
            },
          ],
        },
        cleanFlag: {
          type: 'radio',
          label: '是否清洗',
          next: 'encryptionFlag',
          events: {
            // change: this.cleanFlagChange,
          },
          option: {
            data: [
              {label: '是', value: 1},
              {label: '否', value: 0},
            ],
          },
          rules: [
            {
              required: true,
              message: '数据清洗标志不能为空',
              trigger: 'blur',
            },
          ],
        },
        cleanUrl: {
          type: 'input',
          label: '清洗服务地址',
          used: false,
          next: 'cleanKey',
          rules: [
            {min: 0, message: '长度', trigger: 'blur'},
            {
              required: true,
              message: '清洗服务地址不能为空',
              trigger: 'blur',
            },
          ],
        },
        cleanCdmv: {
          type: 'select',
          label: '清洗模型名称',
          used: false,
          next: '',
          attributes: {
            'no-data-text': '无数据，①检查服务地址是否配置正确②在“清洗配置”处配置清洗规则。！',
            filterable: true,
          },
          events: {
            change: this.cleanCdmvChange,
          },
          props: {
            labelFeild: 'cdmv',
            valueFeild: 'cdmv',
          },
          option: {
            data: this.cleanModelName,
          },
          rules: [
            {
              required: true,
              message: '清洗模型名称不能为空',
              trigger: 'blur',
            },
          ],
        },
        cleanKey: {
          type: 'select',
          label: '指定清洗表名称',
          used: false,
          next: '',
          attributes: {
            'no-data-text': '无数据，请在“清洗配置”处配置清洗规则！',
            filterable: true,
          },
          props: {
            labelFeild: 'tableName',
            valueFeild: 'tableName',
          },

          option: {
            data: [],
          },
          rules: [
            {
              required: true,
              message: '指定清洗表名称不能为空',
              trigger: 'blur',
            },
          ],
        },
        nlpDiseaseType: {
          type: 'input',
          label: '单病种类型',
          used: false,
          rules: [],
          help: {title: '单病种类型', content: '请咨询算法和项目经理确认'},
        },
        nlpField: {
          type: 'select',
          label: '表主键',
          used: false,
          next: '',
          attributes: {
            multiple: true,
          },
          events: {
            change: this.nlpFieldChange,
          },
          props: {
            labelFeild: 'column_cn_name',
            valueFeild: 'column_name',
          },
          option: {
            data: [],
          },
          rules: [],
        },
        nlpPkField: {
          type: 'select',
          label: '需要nlp的字段',
          used: false,
          attributes: {
            multiple: true,
          },
          events: {
            change: this.nlpPkFieldChange,
          },
          props: {
            labelFeild: 'column_cn_name',
            valueFeild: 'column_name',
          },
          option: {
            data: [],
          },
          rules: [],
        },
        nlpFlag: {
          type: 'select',
          label: 'nlp结构化',
          used: false,
          show: true,
          option: {
            data: [
              {label: '是', value: 1},
              {label: '否', value: 0},
            ],
          },
          rules: [{required: true, message: 'nlp结构化不能为空', trigger: 'blur'}],
        },
        encryptionFlag: {
          type: 'select',
          label: '加解密方式',
          next: 'enDeCryptFlag',
          used: false,
          events: {
            change: this.encryptionFlagChange,
          },
          option: {
            data: [
              {label: '无加解密', value: 0},
              {label: '数据密文-解密-目标端', value: 1},
              {label: '数据密文-解密-目标端数据加密-目标端', value: 2},
              {label: '数据明文-加密-目标端', value: 3},
              {label: '数据明文-加密-目标端数据解密-目标端', value: 4},
            ],
          },
        },
        enDeCryptFlag: {
          type: 'select',
          label: '是否加解密',
          next: 'enDeCryptColumnList',
          show: true,
          used: false,
          events: {
            change: this.enDeCryptFlagChange,
          },
          option: {
            data: [
              {label: '无加解密', value: 0},
              {label: '有加密解密', value: 1},
            ],
          },
        },
        remark: {
          type: 'input',
          label: '备注',
        },
      },
      nlpDiseaseTyperule: {
        required: true,
        message: 'nlp disease_type参数不能为空',
        trigger: 'blur',
      },
      nlpFieldrule: {
        required: true,
        message: 'nlp结构化字段不能为空',
        trigger: 'blur',
      },
      nlpPkFieldrule: {
        required: true,
        message: 'nlp结构化pk字段不能为空',
        trigger: 'blur',
      },
      nlpUrlrule: {
        required: true,
        message: 'nlp结构化地址不能为空',
        trigger: 'blur',
      },
      tableNamesrule: {validator: this.findTable, trigger: 'blur', max: 4},
      enDeCryptColumnrule: {
        required: true,
        message: '加解密字段不能为空',
        trigger: 'change',
      },
      incrementSecretKeyrule: {
        required: true,
        message: '增量秘钥不能为空',
        trigger: 'change',
      },
      interfaceSecretKeyrule: {
        required: true,
        message: '接口秘钥不能为空',
        trigger: 'change',
      },
    };
  },
  beforeCreate() {
    console.log('子集开始构建-1-------------', this.$attrs);
  },
  created() {
    console.log('子集构建结束-2-------------', this.$attrs);
    this.watchForAttrs();
  },
  beforeMount() {
    console.log('子集开始渲染-3-------------', this.$attrs);
  },
  mounted() {
    console.log('子集渲染结束-4-------------', this.$attrs);
  },
  methods: {
    init(increInfo) {
      this.applicationTypeChange(increInfo.applicationType);

      this.$nextTick(() => {
        this.tableBoundaryChange(increInfo.tableBoundary);
      });

      this.$nextTick(() => {
        this.subData = cloneDeep(increInfo);
      });
    },
    openHandle() {
      this.subData = cloneDeep(this.increInfo);
      // this.init(this.increInfo);
      // this.$nextTick(() => {
      //     this.$refs.form.refs('form').clearValidate();
      // });
    },
    closeHandle() {
      this.subData.applicationType = 0;
    },
    applicationTypeChange(params) {
      this.basicForm.mainTableEn.attributes.disabled = false;

      this.modleShow = false;
      this.fullShow = false;

      this.basicForm.cdrUrl.used = false;

      this.basicForm.researchAddUrl.used = false;
      this.basicForm.researchQueryUrl.used = false;
      this.basicForm.tableBoundary.show = false;
      this.basicForm.tableNames.show = false;
      this.basicForm.triggers.show = false;
      this.basicForm.archivingComplete.show = false;

      switch (params) {
        case 0:
          this.basicForm.cdrUrl.used = true;
          break;
        case 1:
          this.basicForm.researchAddUrl.used = true;
          this.basicForm.researchQueryUrl.used = true;
          this.basicForm.tableBoundary.show = true;
          this.basicForm.tableNames.show = true;
          this.basicForm.triggers.show = true;
          this.basicForm.archivingComplete.show = true;
          break;
        case 2:
          this.fullShow = true;
          break;
        case 3:
          break;
        case 4:
          break;
        case 5:
          this.modleShow = true;
          break;
        case 6:
          this.modleShow = true;
          break;
        case 7:
          break;
        default:
          break;
      }
    },
    mainTableEnChange(params) {
      if (!params) {
        this.basicForm.enDeCryptColumnList.option.data = [];
        this.subData.enDeCryptColumnList = '';
        return;
      }

      let chooseData = this.findMainTableEnId(params); //this.$refs.form.refs('mainTableEn').getCheckedNodes()[0].data;

      if (this.operation === Symbol.for('increAdd')) {
        this.subData.name = chooseData.name;
        this.subData.mainTableCn = chooseData.cnName;

        if (this.subData.applicationType != '1') {
          this.subData.cleanKey = chooseData.enName;
        }
      }

      searchColumn([chooseData.id])
        .then(({data}) => {
          if (data.code == 0) {
            this.basicForm.enDeCryptColumnList.option.data = data.data;
            this.basicForm.nlpField.option.data = cloneDeep(data.data);
            this.basicForm.nlpPkField.option.data = cloneDeep(data.data);
          } else {
          }
        })
        .catch(({data}) => {
          console.log(data);
        });
    },
    tableBoundaryChange(params) {
      this.basicForm.tableNames.attributes.props.multiple = true;

      this.$nextTick(() => {
        switch (params) {
          case 0:
            this.basicForm.tableNames.attributes.props.multiple = false;
            this.$nextTick(() => {
              if (this.subData.applicationType == 1) {
                this.basicForm.mainTableEn.attributes.disabled = false;
                this.subData.tableNames = this.increInfo.tableNames;
              }
            });
            break;
          case 1:
            this.basicForm.tableNames.attributes.props.multiple = true;
            this.$nextTick(() => {
              if (this.subData.applicationType == 1) {
                this.subData.tableNames = ['visits_visit_info', 'patient_info'];
                this.subData.mainTableEn = 'visits_visit_info';
                this.subData.name = 'visits_visit_info(就诊.就诊基本信息)';
                this.subData.mainTableCn = '就诊.就诊基本信息';
                this.basicForm.mainTableEn.attributes.disabled = true;
              }
            });

            break;
          default:
            break;
        }
      });
    },
    tableNamesChange(params) {
      console.log('tableNamesChange变化');
      if (this.subData.tableBoundary == 1 && Array.isArray(params)) {
        let temp = [...params];
        this.dbInfo[0].children.forEach(item => {
          temp.forEach(citem => {
            if (citem.indexOf(item.enName) == 0) {
              temp.push(item.enName);
            }
          });
        });
        temp = [...new Set(temp)];
        this.subData.tableNames = temp;
      }
    },
    findMainTableEnId(enName) {
      console.log('enName', enName);
      if (!!enName) {
        for (let item of this.dbInfo[0].children) {
          if (item.enName == enName) {
            return item;
          }
        }
      }
    },
    findParent(cval, option, a) {
      for (let p of option) {
        if (p.children) {
          let c = this.findParent(cval, p.children, a);
          if (c.length) {
            return [a ? `${p.enName}(${p.cnName})` : p.enName, ...c];
          } else {
            return [];
          }
        } else {
          if (cval == p.enName) {
            return [a ? `${p.enName}(${p.cnName})` : p.enName];
          }
        }
      }
      return [];
    },
    findTable(rule, value, callback) {
      if (this.subData.tableBoundary == 0) {
        callback();
        return;
      }
      let v = this.findParent('visits_visit_info', this.dbInfo);
      let p = this.findParent('patient_info', this.dbInfo);
      if (v.length && p.length) {
        callback();
      } else {
        callback(new Error('任务无法运行， 请确保有 visits_visit_info表和patient_info表'));
      }
    },

    // formChange:function () {
    //     let temp
    //     return function () {

    //     }
    // },
    /**
     * 对绑定表单备选项进行监听
     * 
     */
    watchForAttrs() {
      for (const key in this.basicForm) {
        if (Object.hasOwnProperty.call(this.basicForm, key)) {
          const element = this.basicForm[key];
          if (element.option && element.option.type === 'props') {
            let source = '$attrs.' + element.option.source.join('.');
            this.$watch(source, function (val, old) {
              element.option.data = val;
            });
          }
        }
      }
    },
    /**
     * 表单联动，改变表单项
     */
    formChange(feild, val) {
      console.log(feild, val, this.basicForm[feild].action);
      if (this.basicForm[feild].action && this.basicForm[feild].action.field) {
        let fields = this.basicForm[feild].action.field;
        for (const f in fields) {
          for (const use of fields[f]) {
            console.log('处理字段：', f, val, use);
            if (f == val) {
              this.basicForm[use].used = true;
            } else {
              this.basicForm[use].used = false;
            }
          }
        }
      }
    },
    ccc() {
      this.$set(this.subData, 'oneCount', 666);
      // this.subData = {oneCount:666};
    },
    destroy() {

    }
  },
};
</script>

<style scoped>
.buttonBox {
  text-align: right;
}
.el-button {
  margin-left: 10px;
}
</style>