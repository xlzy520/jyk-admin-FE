(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-423ef69e"],{"807b":function(e,t,r){},cc18:function(e,t,r){"use strict";r.r(t);var a=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{staticClass:"app-container"},[r("div",{staticClass:"header"},[r("el-form",{ref:"searchForm",attrs:{model:e.searchForm,inline:!0,size:"medium"}},[r("el-form-item",{attrs:{label:"昵称:",prop:"nickname"}},[r("el-input",{attrs:{maxLength:"11"},model:{value:e.searchForm.nickname,callback:function(t){e.$set(e.searchForm,"nickname",t)},expression:"searchForm.nickname"}})],1),e._v(" "),r("el-form-item",{attrs:{label:"联系人:",prop:"name"}},[r("el-input",{attrs:{maxLength:"11"},model:{value:e.searchForm.name,callback:function(t){e.$set(e.searchForm,"name",t)},expression:"searchForm.name"}})],1),e._v(" "),r("el-form-item",{attrs:{label:"手机号:",prop:"phone"}},[r("el-input",{attrs:{maxLength:"11"},model:{value:e.searchForm.phone,callback:function(t){e.$set(e.searchForm,"phone",t)},expression:"searchForm.phone"}})],1),e._v(" "),r("el-form-item",{attrs:{label:"用户类型:",prop:"type"}},[r("el-select",{attrs:{placeholder:"请选择用户类型"},model:{value:e.searchForm.type,callback:function(t){e.$set(e.searchForm,"type",t)},expression:"searchForm.type"}},[r("el-option",{attrs:{label:"全部",value:""}}),e._v(" "),r("el-option",{attrs:{label:"餐厅",value:"restaurant"}}),e._v(" "),r("el-option",{attrs:{label:"学校",value:"school"}})],1)],1),e._v(" "),r("el-form-item",{attrs:{label:"是否默认:",prop:"isDefault"}},[r("el-switch",{attrs:{"active-color":"#13ce66","inactive-color":"#ff4949"},model:{value:e.searchForm.isDefault,callback:function(t){e.$set(e.searchForm,"isDefault",t)},expression:"searchForm.isDefault"}})],1),e._v(" "),r("el-form-item",{attrs:{label:"添加时间:",prop:"addTime"}},[r("el-date-picker",{attrs:{type:"daterange",align:"center","start-placeholder":"开始日期","end-placeholder":"结束日期"},model:{value:e.searchForm.addTime,callback:function(t){e.$set(e.searchForm,"addTime",t)},expression:"searchForm.addTime"}})],1),e._v(" "),r("el-form-item",{attrs:{label:"更新时间:",prop:"updateTime"}},[r("el-date-picker",{attrs:{type:"daterange",align:"center","start-placeholder":"开始日期","end-placeholder":"结束日期"},model:{value:e.searchForm.updateTime,callback:function(t){e.$set(e.searchForm,"updateTime",t)},expression:"searchForm.updateTime"}})],1),e._v(" "),r("el-form-item",[r("el-button",{attrs:{type:"primary",icon:"el-icon-search"},on:{click:function(t){return e.fetchData(e.searchForm)}}},[e._v("查询")]),e._v(" "),r("el-button",{attrs:{type:"info"},on:{click:e.resetForm}},[e._v("清空")])],1)],1)],1),e._v(" "),r("xl-table",{ref:"addressTable",attrs:{index:!0,loading:e.loading,"table-data":e.addressData,"table-columns":e.columns}}),e._v(" "),r("el-dialog",{attrs:{width:"40%",title:"地址信息编辑","close-on-click-modal":!0,visible:e.editVisible},on:{"update:visible":function(t){e.editVisible=t},close:e.close}},[r("el-form",{ref:"form",attrs:{model:e.addressForm,"label-width":"80px",rules:e.rules}},[r("el-form-item",{attrs:{label:"联系人",prop:"name"}},[r("el-input",{attrs:{"suffix-icon":"el-icon-user",maxLength:"15"},model:{value:e.addressForm.name,callback:function(t){e.$set(e.addressForm,"name",t)},expression:"addressForm.name"}})],1),e._v(" "),r("el-form-item",{attrs:{label:"手机号",prop:"phone"}},[r("el-input",{attrs:{"suffix-icon":"el-icon-phone",maxLength:"11"},model:{value:e.addressForm.phone,callback:function(t){e.$set(e.addressForm,"phone",t)},expression:"addressForm.phone"}})],1),e._v(" "),r("el-form-item",{attrs:{label:"详细地址",prop:"address"}},[r("el-input",{attrs:{"suffix-icon":"el-icon-location",maxLength:"40",type:"textarea",rows:2},model:{value:e.addressForm.address,callback:function(t){e.$set(e.addressForm,"address",t)},expression:"addressForm.address"}})],1),e._v(" "),r("el-form-item",{attrs:{label:"用户类型",prop:"type"}},[r("el-radio-group",{model:{value:e.addressForm.type,callback:function(t){e.$set(e.addressForm,"type",t)},expression:"addressForm.type"}},[r("el-radio",{attrs:{label:"restaurant",border:""}},[e._v("餐厅")]),e._v(" "),r("el-radio",{attrs:{label:"school",border:""}},[e._v("学校")])],1)],1)],1),e._v(" "),r("div",{staticClass:"dialog-footer"},[r("el-button",{attrs:{type:"primary"},on:{click:e.submitForm}},[e._v("提交")]),e._v(" "),r("el-button",{on:{click:e.resetForm}},[e._v("重置")])],1)],1)],1)},s=[],n=(r("6b54"),r("a417")),o={getAddress:function(e){return Object(n["a"])("/address/list",e)},updateAddress:function(e){return Object(n["a"])("/address/update",e)},deleteAddress:function(e){return Object(n["a"])("/address/delete",e)}},l=r("ed08"),i={name:"Address",data:function(){var e=this;this.$createElement;return{addressData:[],columns:[{label:"昵称",prop:"nickname",align:"center",width:120},{label:"联系人",prop:"name",align:"center",width:100},{label:"手机号",prop:"phone",align:"center",width:110,formatter:function(e){return e.phone.toString()}},{label:"类型",prop:"type",align:"center",width:80,filters:[{text:"学校",value:"school"},{text:"餐厅",value:"restaurant"}],filterMethod:function(e,t){return t.type===e},filterPlacement:"bottom-end",render:function(e,t){var r=t.props.row;return"school"===r.type?e("el-tag",{attrs:{type:"danger"}},["学校"]):e("el-tag",{attrs:{type:"primary"}},["餐厅"])}},{label:"详细地址",prop:"address",align:"center",minWidth:180},{label:"是否默认",prop:"isDefault",align:"center",width:80,render:function(e,t){var r=t.props.row;return e("div",{class:"is-default-icon"},[e("i",{class:"el-icon-"+(r.isDefault?"success":"error")})])}},{label:"添加时间",prop:"addTime",align:"center",minWidth:80},{label:"更新时间",prop:"updateTime",align:"center",minWidth:80},{label:"操作",prop:"region",align:"center",minWidth:120,render:function(t,r){var a=r.props.row;return t("div",{class:"table-action"},[t("span",{on:{click:function(){return e.update(a)}}},["编辑"]),t("el-divider",{attrs:{direction:"vertical"}}),t("span",{on:{click:function(){return e.delete(a.id)}}},["删除"])])}}],loading:!1,editVisible:!1,searchForm:{nickname:"",name:"",phone:"",type:"",isDefault:"",addTime:"",updateTime:""},addressForm:{name:"",type:"",phone:"",address:""},rules:{name:[{required:!0,message:"请输入姓名",trigger:"blur"},{min:2,max:15,message:"长度在 2 到 15 个字符",trigger:"blur"}],type:[{required:!0,message:"请选择一个类型",trigger:"change"}],phone:[{required:!0,message:"请填写手机号",trigger:"blur"},{pattern:/^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/,message:"请填写符合要求的11位手机号",trigger:"blur"}],address:[{required:!0,message:"请填写地址",trigger:"blur"}]}}},created:function(){this.fetchData()},methods:{fetchData:function(e){var t=this;this.loading=!0,o.getAddress(e).then(function(e){t.addressData=e.list}).finally(function(e){t.loading=!1})},update:function(e){this.addressForm=Object(l["b"])(e),this.editVisible=!0},delete:function(e){var t=this;this.$confirm("此操作将删除该地址信息, 是否继续?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(function(){o.deleteAddress(e).then(function(e){t.$message1000("删除成功","success"),t.fetchData()})})},close:function(){this.editVisible=!1,this.addressForm={name:"",roles:"",phone:"",password:"",region:""}},submitForm:function(){var e=this;this.$refs.form.validate(function(t){if(!t)return console.log("error submit!!"),!1;o.updateAddress(e.addressForm).then(function(t){e.$message1000("提交成功","success"),e.close(),e.fetchData()})})},resetForm:function(){this.$refs.form.resetFields()}}},c=i,d=(r("dde9"),r("2877")),m=Object(d["a"])(c,a,s,!1,null,"6e11d72d",null);t["default"]=m.exports},dde9:function(e,t,r){"use strict";var a=r("807b"),s=r.n(a);s.a}}]);