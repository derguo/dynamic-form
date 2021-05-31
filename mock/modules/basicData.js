module.exports = [
  {
    url: "/dict/list/v1",
    type: "post",
    response: (config) => {
      // console.log("基础数据接口：", config);
      return {
        msg: "success",
        code: 200,
        data: {
            applicationType:[{value:0,name:'全量'}, {value:1,name:'增量科研'},{value:2,name:'cdr'}],
            tableBoundary:[{value:0,name:'全量11'}, {value:1,name:'增量科研11'},{value:2,name:'cdr11'}]
        },
      };
    },
  },
];
