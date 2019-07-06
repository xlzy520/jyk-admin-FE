(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-389a2463"],{"1b80":function(e,t,o){"use strict";t["a"]={data:function(){return{pageOption:{pageIndex:1,pageSize:20},total:0}},methods:{pageChange:function(e){console.log(2),this.pageOption.pageIndex=e,this.fetchData()},sizeChange:function(e){console.log(3),this.pageOption.pageSize=e,this.fetchData()}}}},"5d2b":function(e,t,o){"use strict";o.r(t);var n=function(){var e=this,t=e.$createElement,o=e._self._c||t;return o("div",{staticClass:"app-container"},[o("xl-table",{directives:[{name:"loading",rawName:"v-loading",value:e.loading,expression:"loading"}],ref:"schoolTable",attrs:{index:!0,"table-data":e.schoolData,"table-columns":e.columns,total:e.total,pageSize:e.pageOption.pageSize,pageNo:e.pageOption.pageIndex},on:{"change-page":e.pageChange,"size-change":e.sizeChange}}),e._v(" "),o("add-button",{on:{add:e.add}}),e._v(" "),o("el-dialog",{attrs:{width:"40%",title:e.isAdd?"增加学校信息":"更新学校信息","close-on-click-modal":!0,visible:e.editVisible},on:{"update:visible":function(t){e.editVisible=t},close:e.close}},[o("el-form",{ref:"form",attrs:{model:e.schoolForm,"label-width":"80px",rules:e.rules}},[o("el-form-item",{attrs:{label:"学校名称",prop:"name"}},[o("el-input",{attrs:{"suffix-icon":"el-icon-school",maxLength:"30"},model:{value:e.schoolForm.name,callback:function(t){e.$set(e.schoolForm,"name",t)},expression:"schoolForm.name"}})],1),e._v(" "),o("el-form-item",{attrs:{label:"学校类型",prop:"type"}},[o("el-select",{attrs:{placeholder:"请选择学校类型"},model:{value:e.schoolForm.type,callback:function(t){e.$set(e.schoolForm,"type",t)},expression:"schoolForm.type"}},[o("el-option",{attrs:{label:"幼儿园",value:"0"}}),e._v(" "),o("el-option",{attrs:{label:"小学",value:"1"}}),e._v(" "),o("el-option",{attrs:{label:"中学",value:"2"}})],1)],1)],1),e._v(" "),o("div",{staticClass:"dialog-footer"},[o("el-button",{attrs:{type:"primary"},on:{click:e.submitForm}},[e._v("提交")]),e._v(" "),o("el-button",{on:{click:e.resetForm}},[e._v("重置")])],1)],1)],1)},a=[],i=o("b4e4"),l=o("a417"),s={getSchool:function(e){return Object(l["a"])("/school/list",e)},addSchool:function(e){return Object(l["a"])("/school/add",e)},updateSchool:function(e){return Object(l["a"])("/school/update",e)},deleteSchool:function(e){return Object(l["a"])("/school/delete",e)}},c=o("ed08"),r=o("1b80"),d={name:"School",components:{AddButton:i["a"]},mixins:[r["a"]],data:function(){var e=this;this.$createElement;return{schoolData:[],columns:[{label:"学校名称",prop:"name",align:"center"},{label:"学校类型",prop:"type",align:"center",render:function(e,t){var o=t.props.row,n=["幼儿园","小学","中学"],a=n[o.type];return e("el-tag",{attrs:{type:"success"}},[e("i",{class:"el-icon-school"}),a])}},{label:"添加时间",prop:"addTime",align:"center"},{label:"更新时间",prop:"updateTime",align:"center"},{label:"操作",prop:"region",align:"center",render:function(t,o){var n=o.props.row;return t("div",{class:"table-action"},[t("span",{on:{click:function(){return e.update(n)}}},["编辑"]),t("el-divider",{attrs:{direction:"vertical"}}),t("span",{on:{click:function(){return e.delete(n.id)}}},["删除"])])}}],loading:!1,isAdd:!1,editVisible:!1,schoolForm:{name:"",type:"2"},rules:{name:[{required:!0,message:"请输入学校名称",trigger:"blur"},{min:2,max:30,message:"长度在 2 到 30 个字符",trigger:"blur"}],type:[{required:!0,message:"请选择一个学校类型",trigger:"change"}]}}},created:function(){this.fetchData()},methods:{fetchData:function(){var e=this;this.loading=!0,s.getSchool(this.pageOption).then(function(t){e.schoolData=t.list,e.total=t.total}).finally(function(t){e.loading=!1})},add:function(){this.isAdd=!0,this.editVisible=!0},update:function(e){this.isAdd=!1,this.schoolForm=Object(c["b"])(e),this.editVisible=!0},delete:function(e){var t=this;this.$confirm("此操作将删除该学校信息, 是否继续?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(function(){s.deleteSchool(e).then(function(e){t.$message1000("删除成功","success"),t.fetchData()})})},close:function(){this.editVisible=!1,this.resetForm()},submitForm:function(){var e=this;this.$refs.form.validate(function(t){if(!t)return console.log("error submit!!"),!1;s.updateSchool(e.schoolForm).then(function(t){e.$message1000("提交成功","success"),e.close(),e.fetchData()})})},resetForm:function(){this.$refs.form.resetFields()}}},u=d,p=(o("9e91"),o("2877")),h=Object(p["a"])(u,n,a,!1,null,"6afb3942",null);t["default"]=h.exports},"65ed":function(e,t,o){"use strict";var n=o("a8da"),a=o.n(n);a.a},"686d":function(e,t,o){},"9e91":function(e,t,o){"use strict";var n=o("686d"),a=o.n(n);a.a},a8da:function(e,t,o){},b4e4:function(e,t,o){"use strict";var n=function(){var e=this,t=e.$createElement,o=e._self._c||t;return o("div",{staticClass:"add-button",on:{click:e.add}},[o("i",{staticClass:"el-icon-plus"})])},a=[],i={name:"AddButton",methods:{add:function(){this.$emit("add")}}},l=i,s=(o("65ed"),o("2877")),c=Object(s["a"])(l,n,a,!1,null,"f1447e70",null);t["a"]=c.exports}}]);