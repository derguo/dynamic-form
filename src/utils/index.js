import Vue from 'vue'
import router from '@/router'
import store from '@/store'

/**
 * 获取uuid
 */
export function getUUID () {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    return (c === 'x' ? (Math.random() * 16 | 0) : ('r&0x3' | '0x8')).toString(16)
  })
}

/**
 * 是否有权限
 * @param {*} key
 */
export function isAuth (key) {
  return JSON.parse(sessionStorage.getItem('permissions') || '[]').indexOf(key) !== -1 || false
}

/**
 * 树形数据转换
 * @param {*} data
 * @param {*} id
 * @param {*} pid
 */
export function treeDataTranslate (data, id = 'id', pid = 'parentId') {
  var res = []
  var temp = {}
  for (var i = 0; i < data.length; i++) {
    temp[data[i][id]] = data[i]
  }
  for (var k = 0; k < data.length; k++) {
    if (temp[data[k][pid]] && data[k][id] !== data[k][pid]) {
      if (!temp[data[k][pid]]['children']) {
        temp[data[k][pid]]['children'] = []
      }
      if (!temp[data[k][pid]]['_level']) {
        temp[data[k][pid]]['_level'] = 1
      }
      data[k]['_level'] = temp[data[k][pid]]._level + 1
      temp[data[k][pid]]['children'].push(data[k])
    } else {
      res.push(data[k])
    }
  }
  return res
}

/**
 * 清除登录信息
 */
export function clearLoginInfo () {
  Vue.cookie.delete('token')
  store.commit('resetStore')
  router.options.isAddDynamicMenuRoutes = false
}


/**
 * 处理级联选择器数据----库表2级
 */
export function disposeDBData(data,arrData){
  let obj0 = {};
  let obj1 = {};
  data.map(item =>{
    if(Array.isArray(item)){
      disposeDBData(item,arrData)
    }else{
      let arr = item.split("++");
      if(arr[2] === "0"){
        obj0 = {
          dbName:arr[0],
          dbId:arr[1],
          modelId:arr[3],
        }
      }else if(arr[2] === "1"){
        obj1 = {
          tableName:arr[0],
          tableId:arr[1],
        }
      }
      let obj = Object.assign(obj0,obj1);
      arrData.push(obj);
    }
  })
  return arrData;
}


/**
 * 处理级联选择器数据----表、字段2级
 */
export function disposeTableFieldData(data,arrData){
  let obj0 = {};
  let obj1 = {};
  data.map(item =>{
    if(Array.isArray(item)){
      disposeTableFieldData(item,arrData)
    }else{
      let arr = item.split("++");
      if(arr[2] === "0"){
        obj0 = {
          dbName:arr[0],
          dbId:arr[1],
          //modelId:arr[3],
        }
      }else if(arr[2] === "1"){
        obj1 = {
          tableName:arr[0],
          tableId:arr[1],
        }
      }
      let obj = Object.assign(obj0,obj1);
      arrData.push(obj);
    }
  })
  return arrData;
}


/**
 * 处理级联选择器数据----表、字段2级 =====》的逆方法
 */
export function reverseDisposeTableFieldData(data){
  data.map((items) =>{
    let itemArr = [];

    itemArr[0] = items.tableName + "++" + items.tableId + "++" + 1;
    itemArr[1] = items.sourceFieldName + "++" + items.sourceFieldId + "++" + 2 + "++" + items.sourceFieldCnName;
    // obj = {
    //   ...items,
    //   selectName:selectName,  //反显级联选择器
    // }
    items.selectName = itemArr;
  })
}



/**
 * 源数据预览：处理级联选择器数据（库表2级）  不需要modelId
 */
export function disposePreviewDBData(data,arrData){
  let obj0 = {};
  let obj1 = {};
  data.map(item =>{
    if(Array.isArray(item)){
      disposePreviewDBData(item,arrData)
    }else{
      let arr = item.split("++");
      if(arr[2] === "0"){ //level
        obj0 = {
          dbName:arr[0],
          dbId:arr[1],
        }
      }else if(arr[2] === "1"){
        obj1 = {
          tableName:arr[0],
          tableId:arr[1],
        }
      }
      let obj = Object.assign(obj0,obj1);
      arrData.push(obj);
    }
  })
  return arrData;
}

/**
 * 源数据预览：处理级联选择器数据（库表2级）  不需要modelId
 */
export function disposeOriginDBData(data,arrData){
  let obj0 = {};
  let obj1 = {};
  data && data.length > 0 && data.map(item =>{
    if(Array.isArray(item)){
      disposeOriginDBData(item,arrData)
    }else{
      let arr = item.split("++");
      if(arr[2] === "0"){ //level
        obj0 = {
          sourceDbName:arr[0],
          sourceDbId:arr[1],
        }
      }else if(arr[2] === "1"){
        obj1 = {
          sourceTableName:arr[0],
          sourceTableId:arr[1],
        }
      }
      let obj = Object.assign(obj0,obj1);
      arrData.push(obj);
    }
  })
  return arrData;
}

/**
 * 源数据预览：处理级联选择器数据（库表2级）不需要modelId  的逆方法
 */
export function reverseDisposePreviewDBData(data){
  data.map((items) =>{
    let itemArr = [];
    itemArr[0] = items.dbName + "++" + items.dbId + "++" + 0;
    itemArr[1] = items.tableName + "++" + items.tableId + "++" + 1;
    items.selectName = itemArr;
    if(items.fieldRelation.length === 0){
      items.fieldRelation = [
        {
        fieldRelationId: -1,
        tableId: "",
        relationChar: "",
        fieldName1: "",
        fieldId1: "",
        compareChar: "",
        fieldName2: "",
        fieldId2: "",
      }
    ]
    }else{   //有子集表格数据的情况
      items.fieldRelation.map(item =>{
        if(item.fieldId1){  //为 选择字段
          item.fieldName1 = item.fieldName1.split(".");
        }
        if(item.fieldId2){  //为 选择字段
          item.fieldName2 = item.fieldName2.split(".");
        }
      })
    }
  })
}


/**
 * 处理级联选择器数据----库表字段3级
 */
export function disposeDBTableData(data,arrData){
  let obj = {};
  data.map((item,index) =>{
    if(Array.isArray(item)){
      disposeDBTableData(item,arrData)
    }else{
      if(index === 0){  //库
        let arr = item.split("++");
        obj.sourceDbName = arr[0];
        obj.sourceDbId = arr[1];
        obj.sourceDbCnName = arr[3];
      }else if(index === 1){   //表
        let arr = item.split("++");
        obj.sourceTableName = arr[0];
        obj.sourceTableId = arr[1];
        obj.sourceTableCnName = arr[3];
      }else if(index === 2){   //第三层是字段
        let arr = item.split("++");
        obj.sourceFieldName = arr[0];
        obj.sourceFieldId = arr[1];
        obj.sourceFieldCnName = arr[3];
      }
      arrData.push(obj);
    }
  })
  return arrData;
}


/**
 * 处理级联选择器数据----库表字段3级的逆方法
 *[
 * ["genesis(genesis)++4++0++genesis", "PDMAN_DB_VERSION++1++1++null", "DB_VERSION++1++1++null"]
   ["genesis(genesis)++4++0++genesis", "PDMAN_DB_VERSION++1++1++null", "VERSION_DESC++2++1++null"]
  ]
 */
export function reverseDisposeDBTableData(data){
  let arr =[];
  data.map((item) =>{
    if(item.source && Array.isArray(item.source) && item.source.length >0){  //有source
      item.source.map(items =>{
        let itemArr = [];
        itemArr[0] = items.sourceDbName + "++" + items.sourceDbId + "++" + 0 + "++" + items.sourceDbCnName;
        itemArr[1] = items.sourceTableName + "++" + items.sourceTableId + "++" + 1 + "++" + items.sourceTableCnName;
        //itemArr[2] = items.sourceFieldName + "++" + items.sourceFieldId + "++" + 2 + "++" + items.sourceFieldCnName;
        arr.push(itemArr);
      })
    }
  })
  return arr;
}


/**
 * n层嵌套数组去重后变一层数组
 */
export function rowArrayUnique(arr) {
  let newArr = [];
  for(var i=0;i<arr.length;i++) {
      if(Array.isArray(arr[i])) {
          let dealArr = rowArrayUnique(arr[i]);
          newArr = [...newArr,...dealArr];
      }else {
          newArr.push(arr[i]);
      }
  }
 let shoArr = [...new Set(newArr)];
 let arr0 = shoArr.sort((a,b)=>a-b); //a-b<0 升序
 return arr0;
}


/**
 * 两层嵌套数组去重
 *  [
      ["genesis(genesis)++4++0++genesis", "PDMAN_DB_VERSION++1++1++null"],
      ["genesis(genesis)++4++0++genesis", "QRTZ_BLOB_TRIGGERS++2++1++null"]
    ]
 */
export function arrayUnique(arr) {
  let newArr = [];
  for(var i=0;i<arr.length;i++) {
      if(Array.isArray(arr[i])) {
        if(newArr.length === 0){
          newArr.push(arr[i].toString())
        }else{
          if(newArr.indexOf(arr[i].toString()) === -1){
            newArr.push(arr[i].toString())
          }
        }
      }
  }
 return newArr;
}

//处理级联选择器的数据----库表两级名称
export function disposeCascaderLevel2Data(data, level) {
  if (data.length > 0) {
    data.map((item) => {
      for (let key in item) {
        if (Array.isArray(item[key])) {
          let level = 0;
          level++;
          disposeCascaderLevel2Data(item[key], level);
        } else {
          item.__level = level; //为了在保存的时候知道是哪层
          item.sqlList__rawValue =
            item.name + "++" + item.id + "++" + level + "++" + item.modelId; //sql list 用
          item.distinct__rawValue =
            item.name + "++" + item.id + "++" + level + "++" + item.cnName; //源数据预览联动表格
          item.relation__rawValue =
            item.name + "++" + item.id + "++" + level; //表关联关系父表格
        }
      }
    });
  } else {
    return [];
  }
}

/*
* sortId  递增
* */
export function idIncreate(tableData,pageIndex,pageSize){
  let i=1
  tableData.forEach((ele)=>{
    ele.sortId=(pageIndex-1)*pageSize+i
      i++
  })
}


//判断对象为空
export function objEmpty(obj) {
  if (typeof obj == 'undefined' || obj === null || obj === '') {
    return true
  } else {
    return false
  }
}
