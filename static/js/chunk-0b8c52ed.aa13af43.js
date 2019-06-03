(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-0b8c52ed"],{"1f48":function(e,t,n){"use strict";var a=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"base-table"},[n("el-table",{directives:[{name:"loading",rawName:"v-loading",value:e.loading,expression:"loading"}],ref:"baseTable",attrs:{"highlight-current-row":"",data:e.tableData,stripe:e.stripe,"header-row-class-name":"header-row"},on:{"row-click":e.clickRow,select:e.handleSelection,"select-all":e.selectAll,"selection-change":e.handleSelectionChange,"cell-dblclick":e.dblclickRow,"cell-click":e.clickCell,"row-contextmenu":e.showMenu}},[e.selection?n("el-table-column",{attrs:{type:"selection",width:"55"}}):e._e(),e._v(" "),e.index?n("el-table-column",{attrs:{type:"index",width:"55"}}):e._e(),e._v(" "),e._l(e.columns,function(t){return n("el-table-column",e._b({key:t.label,scopedSlots:e._u([{key:"default",fn:function(a){return t.component?[n(t.component,e._b({tag:"component"},"component",e.getComponentBind(a,t),!1))]:void 0}}],null,!0)},"el-table-column",t,!1))})],2),e._v(" "),e.total>e.pageSize?n("el-pagination",{staticClass:"pagination",attrs:{background:"","current-page":e.pageNo,"page-size":e.pageSize,"prev-text":"上一页","next-text":"下一页",layout:"prev, pager, next, jumper",total:e.total},on:{"current-change":e.handleCurrentChange}}):e._e()],1)},r=[],o=n("cebc"),l=(n("c5f6"),function(){return{functional:!0,render:function(e,t){var n=t.props,a=n.row,r=n.col,o=t._v,l=r.formatter,i=l&&l(a,r)||a[r.prop]||"";return o&&o(i)||i}}}),i={name:"BaseTable",props:{selection:{type:String,default:""},tableData:{type:Array,default:function(){}},tableColumns:{type:Array,default:function(){}},stripe:{type:Boolean,default:!1},loading:{type:Boolean,default:!1},total:{type:Number,default:0},pageNo:{type:Number,default:1},pageSize:{type:Number,default:15},index:Boolean},data:function(){return{columns:[]}},mounted:function(){this.columns=this.tableColumns.filter(function(e){return!e.hidden}).map(function(e){var t=l();return e.render&&(t.render=e.render),"index"===e.type?Object(o["a"])({},e):Object(o["a"])({},e,{component:t})})},methods:{handleCurrentChange:function(e){this.$emit("change-page",e)},getComponentBind:function(e,t){var n=e.row,a=e.column,r=e.$index;return{row:n,col:t,column:a,$index:r}},clickRow:function(e){this.toggleRowSelection(e)},toggleRowSelection:function(e,t){this.$refs.baseTable.toggleRowSelection(e,t)},showMenu:function(e,t,n){this.$emit("row-contextmenu",e,t,n)},dblclickRow:function(e){this.$emit("cell-dblclick",e)},clickCell:function(e,t,n,a){this.$emit("cellclick",e,t,n,a)},handleSelectionChange:function(e){this.$emit("selection-change",e)},handleSelection:function(e){this.$emit("selectchange",e)},selectAll:function(e){this.$emit("selectAll",e)}}},s=i,c=(n("e338"),n("2877")),u=Object(c["a"])(s,a,r,!1,null,"24261058",null);t["a"]=u.exports},6418:function(e,t,n){},"8add":function(e,t,n){"use strict";var a=n("6418"),r=n.n(a);r.a},b4e4:function(e,t,n){"use strict";var a=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"add-button",on:{click:e.add}},[n("i",{staticClass:"el-icon-plus"})])},r=[],o={name:"AddButton",methods:{add:function(){this.$emit("add")}}},l=o,i=(n("8add"),n("2877")),s=Object(i["a"])(l,a,r,!1,null,"0eca12e7",null);t["a"]=s.exports},b97d:function(e,t,n){"use strict";n.r(t);var a=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"app-container"},[n("add-button",{on:{add:e.add}}),e._v(" "),n("base-table",{ref:"staffTable",attrs:{index:!0,loading:e.loading,"table-data":e.staffData,"table-columns":e.columns}}),e._v(" "),n("el-dialog",{attrs:{width:"40%",title:e.isAdd?"新增人员":"人员信息更新","close-on-click-modal":!0,visible:e.editVisible},on:{"update:visible":function(t){e.editVisible=t},close:e.close}},[n("el-form",{ref:"form",attrs:{model:e.form,"label-width":"80px",rules:e.rules}},[n("el-form-item",{attrs:{label:"姓名",prop:"name"}},[n("el-input",{model:{value:e.form.name,callback:function(t){e.$set(e.form,"name",t)},expression:"form.name"}})],1),e._v(" "),n("el-form-item",{attrs:{label:"手机号",prop:"phone"}},[n("el-input",{attrs:{maxLength:"11"},model:{value:e.form.phone,callback:function(t){e.$set(e.form,"phone",t)},expression:"form.phone"}})],1),e._v(" "),n("el-form-item",{attrs:{label:"角色类型",prop:"roles"}},[n("el-radio-group",{model:{value:e.form.roles,callback:function(t){e.$set(e.form,"roles",t)},expression:"form.roles"}},[n("el-radio",{attrs:{label:"super",border:""}},[e._v("超级管理员")]),e._v(" "),n("el-radio",{attrs:{label:"admin",border:""}},[e._v("管理员")]),e._v(" "),n("el-radio",{attrs:{label:"staff",border:""}},[e._v("普通员工")])],1)],1),e._v(" "),n("el-form-item",{attrs:{label:"负责区域",prop:"region"}},[n("el-select",{attrs:{placeholder:"请选择负责区域"},model:{value:e.form.region,callback:function(t){e.$set(e.form,"region",t)},expression:"form.region"}},[n("el-option",{attrs:{label:"上海",value:"shanghai"}}),e._v(" "),n("el-option",{attrs:{label:"深圳",value:"shenzhen"}})],1)],1),e._v(" "),n("el-form-item",{attrs:{label:"登录密码",prop:"password"}},[n("el-input",{attrs:{type:"password","max-length":"20"},model:{value:e.form.password,callback:function(t){e.$set(e.form,"password",t)},expression:"form.password"}})],1)],1),e._v(" "),n("div",{staticClass:"dialog-footer"},[n("el-button",{attrs:{type:"primary"},on:{click:e.submitForm}},[e._v("提交")]),e._v(" "),n("el-button",{on:{click:e.resetForm}},[e._v("重置")])],1)],1)],1)},r=[],o=(n("96cf"),n("3b8d")),l=n("1f48"),i=n("b4e4"),s=n("a417"),c={getStaff:function(e){return Object(s["a"])("/staff/list",e)},addStaff:function(e){return Object(s["a"])("/staff/add",e)},updateStaff:function(e){return Object(s["a"])("/staff/update",e)},deleteStaff:function(e){return Object(s["a"])("/staff/delete",e)}},u=n("ed08"),d={name:"Staff",components:{BaseTable:l["a"],AddButton:i["a"]},data:function(){var e=this;this.$createElement;return{staffData:[],columns:[{label:"姓名",prop:"name",align:"center"},{label:"手机号",prop:"phone",align:"center"},{label:"角色",prop:"roles",align:"center",render:function(t,n){var a=n.props.row,r=e.statusFilter(a.roles);return t("el-tag",{attrs:{type:r.type}},[r.text])}},{label:"负责区域",prop:"region",align:"center"},{label:"操作",prop:"region",align:"center",render:function(t,n){var a=n.props.row;return t("div",{class:"table-action"},[t("span",{on:{click:function(){return e.update(a)}}},["编 辑"]),t("el-divider",{attrs:{direction:"vertical"}}),t("span",{on:{click:function(){return e.delete(a.id)}}},["删 除"])])}}],loading:!1,isAdd:!1,editVisible:!1,form:{name:"",roles:"",phone:"",password:"",region:""},rules:{name:[{required:!0,message:"请输入姓名",trigger:"blur"},{min:2,max:15,message:"长度在 2 到 15 个字符",trigger:"blur"}],roles:[{required:!0,message:"请选择一个角色",trigger:"change"}],phone:[{required:!0,message:"请填写手机号",trigger:"blur"},{pattern:/^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/,message:"请填写符合要求的11位手机号",trigger:"blur"}],password:[{required:!0,message:"请填写密码",trigger:"change"},{pattern:/^[^\\\\\\\/:*?\s\\"<>|]+$/,message:"请不要输入特殊字符",trigger:"blur"},{min:6,max:20,message:"长度在 6 到 20 个字符",trigger:"blur"}]}}},created:function(){this.fetchData()},methods:{statusFilter:function(e){var t={super:"danger",admin:"warning",staff:"success"},n={super:"超级管理员",admin:"管理员",staff:"员工"};return{text:n[e],type:t[e]}},fetchData:function(){var e=this;this.loading=!0,c.getStaff().then(function(t){e.staffData=t.list}).finally(function(t){e.loading=!1})},add:function(){this.isAdd=!0,this.editVisible=!0},update:function(e){this.isAdd=!1,this.form=Object(u["b"])(e),this.editVisible=!0},delete:function(e){var t=this;this.$confirm("此操作将删除该人员, 是否继续?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(function(){c.deleteStaff(e).then(function(e){t.$message1000("删除成功","success"),t.fetchData()})})},close:function(){this.editVisible=!1,this.form={name:"",roles:"",phone:"",password:"",region:""}},submitForm:function(){var e=this;this.$refs.form.validate(function(){var t=Object(o["a"])(regeneratorRuntime.mark(function t(n){var a;return regeneratorRuntime.wrap(function(t){while(1)switch(t.prev=t.next){case 0:if(!n){t.next=12;break}return t.next=3,e.isAdd;case 3:if(!t.sent){t.next=7;break}t.t0=c.addStaff(e.form),t.next=8;break;case 7:t.t0=c.updateStaff(e.form);case 8:a=t.t0,a.then(function(t){e.$message1000("提交成功","success"),e.close(),e.fetchData()}),t.next=14;break;case 12:return console.log("error submit!!"),t.abrupt("return",!1);case 14:case"end":return t.stop()}},t)}));return function(e){return t.apply(this,arguments)}}())},resetForm:function(){this.$refs.form.resetFields()}}},f=d,p=n("2877"),m=Object(p["a"])(f,a,r,!1,null,"25d1a656",null);t["default"]=m.exports},d7a4:function(e,t,n){},e338:function(e,t,n){"use strict";var a=n("d7a4"),r=n.n(a);r.a}}]);