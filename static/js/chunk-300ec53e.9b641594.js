(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-300ec53e"],{"1f48":function(e,t,n){"use strict";var o=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"base-table"},[n("el-table",{directives:[{name:"loading",rawName:"v-loading",value:e.loading,expression:"loading"}],ref:"baseTable",attrs:{"highlight-current-row":"",data:e.tableData,stripe:e.stripe,"header-row-class-name":"header-row"},on:{"row-click":e.clickRow,select:e.handleSelection,"select-all":e.selectAll,"selection-change":e.handleSelectionChange,"cell-dblclick":e.dblclickRow,"cell-click":e.clickCell,"row-contextmenu":e.showMenu}},[e.selection?n("el-table-column",{attrs:{type:"selection",width:"55"}}):e._e(),e._v(" "),e.index?n("el-table-column",{attrs:{type:"index",width:"55"}}):e._e(),e._v(" "),e._l(e.columns,function(t){return n("el-table-column",e._b({key:t.label,scopedSlots:e._u([{key:"default",fn:function(o){return t.component?[n(t.component,e._b({tag:"component"},"component",e.getComponentBind(o,t),!1))]:void 0}}],null,!0)},"el-table-column",t,!1))})],2),e._v(" "),e.total>e.pageSize?n("el-pagination",{staticClass:"pagination",attrs:{background:"","current-page":e.pageNo,"page-size":e.pageSize,"prev-text":"上一页","next-text":"下一页",layout:"prev, pager, next, jumper",total:e.total},on:{"current-change":e.handleCurrentChange}}):e._e()],1)},l=[],a=n("cebc"),i=(n("c5f6"),function(){return{functional:!0,render:function(e,t){var n=t.props,o=n.row,l=n.col,a=t._v,i=l.formatter,c=i&&i(o,l)||o[l.prop]||"";return a&&a(c)||c}}}),c={name:"BaseTable",props:{selection:{type:String,default:""},tableData:{type:Array,default:function(){}},tableColumns:{type:Array,default:function(){}},stripe:{type:Boolean,default:!1},loading:{type:Boolean,default:!1},total:{type:Number,default:0},pageNo:{type:Number,default:1},pageSize:{type:Number,default:15},index:Boolean},data:function(){return{columns:[]}},mounted:function(){this.columns=this.tableColumns.filter(function(e){return!e.hidden}).map(function(e){var t=i();return e.render&&(t.render=e.render),"index"===e.type?Object(a["a"])({},e):Object(a["a"])({},e,{component:t})})},methods:{handleCurrentChange:function(e){this.$emit("change-page",e)},getComponentBind:function(e,t){var n=e.row,o=e.column,l=e.$index;return{row:n,col:t,column:o,$index:l}},clickRow:function(e){this.toggleRowSelection(e)},toggleRowSelection:function(e,t){this.$refs.baseTable.toggleRowSelection(e,t)},showMenu:function(e,t,n){this.$emit("row-contextmenu",e,t,n)},dblclickRow:function(e){this.$emit("cell-dblclick",e)},clickCell:function(e,t,n,o){this.$emit("cellclick",e,t,n,o)},handleSelectionChange:function(e){this.$emit("selection-change",e)},handleSelection:function(e){this.$emit("selectchange",e)},selectAll:function(e){this.$emit("selectAll",e)}}},r=c,s=(n("e338"),n("2877")),u=Object(s["a"])(r,o,l,!1,null,"24261058",null);t["a"]=u.exports},"5d2b":function(e,t,n){"use strict";n.r(t);var o=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"app-container"},[n("base-table",{ref:"schoolTable",attrs:{index:!0,loading:e.loading,"table-data":e.schoolData,"table-columns":e.columns}}),e._v(" "),n("add-button",{on:{add:e.add}}),e._v(" "),n("el-dialog",{attrs:{width:"40%",title:e.isAdd?"增加学校信息":"更新学校信息","close-on-click-modal":!0,visible:e.editVisible},on:{"update:visible":function(t){e.editVisible=t},close:e.close}},[n("el-form",{ref:"form",attrs:{model:e.schoolForm,"label-width":"80px",rules:e.rules}},[n("el-form-item",{attrs:{label:"学校名称",prop:"name"}},[n("el-input",{attrs:{"suffix-icon":"el-icon-school",maxLength:"30"},model:{value:e.schoolForm.name,callback:function(t){e.$set(e.schoolForm,"name",t)},expression:"schoolForm.name"}})],1)],1),e._v(" "),n("div",{staticClass:"dialog-footer"},[n("el-button",{attrs:{type:"primary"},on:{click:e.submitForm}},[e._v("提交")]),e._v(" "),n("el-button",{on:{click:e.resetForm}},[e._v("重置")])],1)],1)],1)},l=[],a=n("1f48"),i=n("b4e4"),c=n("a417"),r={getSchool:function(e){return Object(c["a"])("/school/list",e)},addSchool:function(e){return Object(c["a"])("/school/add",e)},updateSchool:function(e){return Object(c["a"])("/school/update",e)},deleteSchool:function(e){return Object(c["a"])("/school/delete",e)}},s=n("ed08"),u={name:"School",components:{BaseTable:a["a"],AddButton:i["a"]},data:function(){var e=this;this.$createElement;return{schoolData:[],columns:[{label:"学校名称",prop:"name",align:"center"},{label:"添加时间",prop:"addTime",align:"center"},{label:"更新时间",prop:"updateTime",align:"center"},{label:"操作",prop:"region",align:"center",render:function(t,n){var o=n.props.row;return t("div",{class:"table-action"},[t("span",{on:{click:function(){return e.update(o)}}},["编辑"]),t("el-divider",{attrs:{direction:"vertical"}}),t("span",{on:{click:function(){return e.delete(o.id)}}},["删除"])])}}],loading:!1,isAdd:!1,editVisible:!1,schoolForm:{name:""},rules:{name:[{required:!0,message:"请输入学校名称",trigger:"blur"},{min:2,max:30,message:"长度在 2 到 30 个字符",trigger:"blur"}]}}},created:function(){this.fetchData()},methods:{fetchData:function(){var e=this;this.loading=!0,r.getSchool().then(function(t){e.schoolData=t.list}).finally(function(t){e.loading=!1})},add:function(){this.isAdd=!0,this.editVisible=!0},update:function(e){this.isAdd=!1,this.schoolForm=Object(s["b"])(e),this.editVisible=!0},delete:function(e){var t=this;this.$confirm("此操作将删除该学校信息, 是否继续?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(function(){r.deleteSchool(e).then(function(e){t.$message1000("删除成功","success"),t.fetchData()})})},close:function(){this.editVisible=!1,this.schoolForm={name:""}},submitForm:function(){var e=this;this.$refs.form.validate(function(t){if(!t)return console.log("error submit!!"),!1;r.updateSchool(e.schoolForm).then(function(t){e.$message1000("提交成功","success"),e.close(),e.fetchData()})})},resetForm:function(){this.$refs.form.resetFields()}}},d=u,f=(n("e4a6"),n("2877")),h=Object(f["a"])(d,o,l,!1,null,"52cd7ef6",null);t["default"]=h.exports},6418:function(e,t,n){},"8add":function(e,t,n){"use strict";var o=n("6418"),l=n.n(o);l.a},ad09:function(e,t,n){},b4e4:function(e,t,n){"use strict";var o=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"add-button",on:{click:e.add}},[n("i",{staticClass:"el-icon-plus"})])},l=[],a={name:"AddButton",methods:{add:function(){this.$emit("add")}}},i=a,c=(n("8add"),n("2877")),r=Object(c["a"])(i,o,l,!1,null,"0eca12e7",null);t["a"]=r.exports},d7a4:function(e,t,n){},e338:function(e,t,n){"use strict";var o=n("d7a4"),l=n.n(o);l.a},e4a6:function(e,t,n){"use strict";var o=n("ad09"),l=n.n(o);l.a}}]);