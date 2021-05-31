module.exports = [
  // user login
  {
    url: '/proxyApi/altm-auth/oauth/token',
    type: 'post',
    response: config => {
      console.log("登陆接口",config)
      return {
        msg:"success",
        code:200,
        data: {},
        access_token:"02829a77dc6fae29df0aedf8a77a28cf"
      }
    }
  },
  {
    url: '/proxyApi/altm-icu-system/menu/nav',
    type: 'get',
    response: config => {
      console.log("获取菜单",config)
      return {
        "code": 200,
        "data": [
          {
            "createTime": "",
            "deleted": 0,
            "icon": "",
            "id": 0,
            "list": [{createDate: "2020-07-17 21:31:04",
            icon: "icon-unorderedlist",
            id: "1067246875800000025",
            name: "菜单管理",
            parentName: null,
            permissions: null,
            pid: "1067246875800000035",
            sort: 0,
            type: 0,
            url: "icu/icu-monitor"}],
            "name": "",
            "open": 0,
            "orderNum": 0,
            "parentId": 0,
            "parentName": "",
            "perms": "",
            "type": 0,
            "updateTime": "",
            "url": ""
          }
        ],
        "msg": ""
      }
    }
  },
  {
    url: '/proxyApi/altm-icu-system/user/currentInfo',
    type: 'get',
    response: config => {
      console.log("当前配置",config)
      return {
        "code": 200,
        "data": {
          "accountNonExpired": true,
          "accountNonLocked": true,
          "createTime": "",
          "credentialsNonExpired": true,
          "enable": true,
          "enabled": true,
          "headImgUrl": "",
          "id": 0,
          "newPassword": "",
          "nickname": "",
          "oldPassword": "",
          "password": "",
          "permissions": [],
          "phone": "",
          "roleId": "",
          "roles": [
            {
              "code": "",
              "createTime": "",
              "id": 0,
              "name": "",
              "updateTime": "",
              "userId": 0
            }
          ],
          "sex": 0,
          "sysRoles": [
            {
              "code": "",
              "createTime": "",
              "id": 0,
              "name": "",
              "updateTime": "",
              "userId": 0
            }
          ],
          "type": "",
          "updateTime": "",
          "username": ""
        },
        "msg": ""
      }
    }
  },
]
