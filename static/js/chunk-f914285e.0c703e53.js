(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-f914285e"],{"36bd":function(t,e,i){"use strict";var s=i("4bf8"),n=i("77f1"),o=i("9def");t.exports=function(t){var e=s(this),i=o(e.length),h=arguments.length,r=n(h>1?arguments[1]:void 0,i),a=h>2?arguments[2]:void 0,l=void 0===a?i:n(a,i);while(l>r)e[r++]=t;return e}},"6c7b":function(t,e,i){var s=i("5ca1");s(s.P,"Array",{fill:i("36bd")}),i("9c6c")("fill")},"735d":function(t,e,i){"use strict";var s=i("f370"),n=i.n(s);n.a},"9ed6":function(t,e,i){"use strict";i.r(e);var s=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"login-container"},[t._m(0),t._v(" "),i("el-form",{ref:"loginForm",staticClass:"login-form",attrs:{"auto-complete":"on","status-icon":"",model:t.loginForm,rules:t.loginRules,"label-position":"left"}},[i("h3",{staticClass:"title"},[t._v("洁雅康后台管理")]),t._v(" "),i("el-form-item",{attrs:{prop:"username"}},[i("span",{staticClass:"svg-container svg-container_login"},[i("svg-icon",{attrs:{"icon-class":"user"}})],1),t._v(" "),i("el-input",{attrs:{name:"username",type:"text",spellcheck:"false","auto-complete":"on",maxlength:"30",clearable:"",placeholder:"请输入账号"},model:{value:t.loginForm.username,callback:function(e){t.$set(t.loginForm,"username","string"===typeof e?e.trim():e)},expression:"loginForm.username"}})],1),t._v(" "),i("el-form-item",{attrs:{prop:"password"}},[i("span",{staticClass:"svg-container svg-container_login"},[i("svg-icon",{attrs:{"icon-class":"password"}})],1),t._v(" "),i("el-input",{attrs:{name:"password",type:t.pwdType,spellcheck:"false",maxlength:"30",clearable:"","auto-complete":"on",placeholder:"请输入密码"},nativeOn:{keyup:function(e){return!e.type.indexOf("key")&&t._k(e.keyCode,"enter",13,e.key,"Enter")?null:t.handleLogin(e)}},model:{value:t.loginForm.password,callback:function(e){t.$set(t.loginForm,"password","string"===typeof e?e.trim():e)},expression:"loginForm.password"}}),t._v(" "),i("span",{staticClass:"show-pwd",on:{click:t.showPwd}},[i("svg-icon",{attrs:{"icon-class":"password"===t.pwdType?"eye":"eye-open"}})],1)],1),t._v(" "),i("el-form-item",[i("el-button",{staticClass:"login-button",attrs:{type:"primary",loading:t.loading},nativeOn:{click:function(e){return e.preventDefault(),t.handleLogin(e)}}},[t._v("\n        登录\n      ")])],1)],1)],1)},n=[function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"bg-animation"},[i("canvas",{attrs:{id:"cvs_bg",width:"1443",height:"596"}}),t._v(" "),i("canvas",{attrs:{id:"cvs_key"}})])}];i("6c7b"),i("ac6a"),i("a481"),i("4917");function o(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}var h,r,a,l,c=i("85f2"),d=i.n(c);function u(t,e){for(var i=0;i<e.length;i++){var s=e[i];s.enumerable=s.enumerable||!1,s.configurable=!0,"value"in s&&(s.writable=!0),d()(t,s.key,s)}}function f(t,e,i){return e&&u(t.prototype,e),i&&u(t,i),t}function y(){var t=document.body.clientWidth,e=document.documentElement.clientHeight||window.screen.height||document.body.clientHeight;l=document.getElementById("cvs_key"),h=t,r=e,l.setAttribute("width",h+""),l.setAttribute("height",r+""),a=l.getContext("2d"),x()}var m=function(){function t(e,i,s){o(this,t),this.word=e,this.size=i,this.color=s,this.x=0,this.y=0,this.bound=0,this.speed=0,this.forward=0,this.speedx=0,this.speedy=0,this.YA=0,this.XA=0,this.deg=0,this.rotatedeg=0,this.rotatedegA=0,this.declinedeg=0,this.declinePoint=[],this.declinedegV=0,this.declinedegVA=0}return f(t,[{key:"init",value:function(t,e,i,s,n,o){return this.x=t,this.y=e,this.bound=e+20,this.speed=i,this.forward=s,this.speedx=Math.floor(i*Math.cos(Math.PI*s/180)),this.speedy=Math.floor(i*Math.sin(Math.PI*s/180)),this.YA=2,this.XA=0,this.deg=n,this.rotatedeg=o,this}},{key:"draw",value:function(t){"bottom"===t?this.rotate(this.declinedeg,this.declinePoint[0],this.declinePoint[1]):this.rotate(this.deg,this.x,this.y),a.font=this.size+"px Verdana",a.textBaseline=t||"middle",a.textAlign="center",a.fillStyle=this.color,a.fillText(this.word,this.x,this.y),"bottom"===t?this.rotate(-this.declinedeg,this.declinePoint[0],this.declinePoint[1]):this.rotate(-this.deg,this.x,this.y)}},{key:"rotate",value:function(t,e,i){a.translate(e,i),a.rotate(t*(Math.PI/180)),a.translate(-e,-i)}},{key:"setPosition",value:function(t,e){this.x=t,this.y=e}},{key:"fade",value:function(){var t=/[0-9]\.[0-9]+/,e=this.color.match(t);if(e=parseFloat(e[0]),e-=.02,e<=0)return!0;this.color=this.color.replace(t,e+"")}},{key:"move",value:function(){var t;return this.x+=this.speedx,this.y+=this.speedy,this.hit(),this.speedy+=this.YA,this.rotateText(),t=this.fade(),this.draw("middle"),t}},{key:"hit",value:function(){if(this.x>=h-this.size/2&&(this.speedx=-this.speedx/2,this.x=h-this.size/2,this.forwardx=-this.forwardx),this.y>=this.bound-this.size/2&&(this.speedy=-this.speedy/4,this.y=this.bound-this.size/2,Math.abs(this.speedy+this.YA)<5))return!0;this.x<=this.size/2&&(this.speedx=-this.speedx,this.x=this.size/2,this.forwardx=-this.forwardx),this.y<=this.size/2&&(this.speedy=-this.speedy,this.y=this.size/2)}},{key:"rotateText",value:function(){this.deg+=this.rotatedeg}},{key:"shakeText",value:function(){if(Math.abs(this.declinedeg)>45&&(this.declinedeg,this.declinedeg),(0===this.declinedeg||(this.declinedeg+this.declinedegV)*this.declinedeg<0)&&(this.declinedegVA=2*-this.declinedegVA,Math.abs(this.declinedegV)<3))return this.declinedeg=0,this.declinedegV=0,this.declinedegVA=0,!1;this.declinedeg+=this.declinedegV,this.declinedegV+=this.declinedegVA}}]),t}(),g=function(){function t(){o(this,t),this.words=[],this.circles=[]}return f(t,[{key:"addWord",value:function(t,e,i,s,n,o){var h,r,a="rgba("+Math.floor(this.random(0,225))+","+Math.floor(this.random(0,225))+","+Math.floor(this.random(0,225))+",1.00)",l=new m(t,e,i),c=this.random(-80,-100);c<-90?(h=this.random(0,-10),r=this.random(0,-5)):(h=this.random(0,10),r=this.random(0,5)),this.words.push(l.init(s,o,this.random(30,50),c,h,r)),this.circles.push(new w(s,n,1,a))}},{key:"animateWord",value:function(){var t=this;this.words.forEach(function(e,i){e.move()&&t.delWord(i)})}},{key:"animateCircle",value:function(){var t=this;this.circles.forEach(function(e,i){e.animate()&&t.delCircle(i)})}},{key:"delWord",value:function(t){this.words.splice(t,1)}},{key:"delCircle",value:function(t){this.circles.splice(t,1)}},{key:"random",value:function(t,e){return Math.random()*(e-t)+t}}]),t}(),p=function(){function t(e,i,s){o(this,t),this.x=e,this.y=i,this.size=s,this.fontSize=s/2,this.keyWords=[],this.keyWords[0]=["0","1","2","3","4","5","6","7","8","9"],this.keys=[],this.keysInfo={}}return f(t,[{key:"init",value:function(){var t=this,e=this.x,i=this.y;return this.keyWords.forEach(function(s,n){e=t.x+2*n*t.size/3,s.forEach(function(s){t.keys.push(new v(s,t.fontSize,"white","#444444","#999999",t.size,t.size,e,i)),t.keysInfo[s]={x:e+t.size/2,y:i+t.size/2},e=e+10+t.size}),i=i+10+t.size}),this.keysInfo}},{key:"press",value:function(t){this.keys.forEach(function(e){t===e.word?e.press():e.unPress()}),this.draw()}},{key:"draw",value:function(){this.keys.forEach(function(t){t.draw()})}}]),t}(),v=function(){function t(e,i,s,n,h,r,a,l,c){o(this,t),this.word=e,this.size=i,this.wordColor=s,this.color=n,this.pressColor=h||"gray",this.isPress=!1,this.width=r,this.height=a,this.x=l,this.y=c,this.r=5}return f(t,[{key:"press",value:function(){this.isPress=!0}},{key:"unPress",value:function(){this.isPress=!1}},{key:"draw",value:function(){a.beginPath(),a.strokeStyle="white",a.moveTo(this.x+this.r,this.y),a.arcTo(this.x+this.width,this.y,this.x+this.width,this.y+this.height,this.r),a.arcTo(this.x+this.width,this.y+this.height,this.x,this.y+this.height,this.r),a.arcTo(this.x,this.y+this.height,this.x,this.y,this.r),a.arcTo(this.x,this.y,this.x+this.width,this.y,this.r),a.stroke(),a.textBaseline="middle",a.textAlign="center",a.fillStyle=this.wordColor,a.font=this.size+"px Verdana",a.fillText(this.word,this.x+this.width/2,this.y+this.height/2),a.closePath()}}]),t}(),w=function(){function t(e,i,s,n){o(this,t),this.x=e,this.y=i,this.r=s,this.color=n}return f(t,[{key:"draw",value:function(){a.beginPath(),a.fillStyle=this.color,a.arc(this.x,this.y,this.r,0,2*Math.PI),a.fill(),a.closePath()}},{key:"animate",value:function(){return this.r+=20,this.draw(),this.fade()}},{key:"fade",value:function(){var t=/[0-9]\.[0-9]+/,e=this.color.match(t);if(e=parseFloat(e[0]),e-=.05,e<=0)return!0;this.color=this.color.replace(t,e+"")}}]),t}();function k(){a.clearRect(0,0,h,r)}var x=function(){var t={};return function(){var e,i=r/3*2,s=new g,n=new p((h-10*((r-i)/4+10))/2,i+80,(r-i)/4);function o(){k(),s.animateCircle(),l(),n.draw(),s.animateWord(),requestAnimationFrame(o)}function l(){a.beginPath(),a.fillStyle="#2d3a4b",a.moveTo(0,0),a.lineTo(0,i+40),a.lineTo(h,i+40),a.lineTo(h,0),a.fill(),a.closePath(),a.beginPath(),a.lineWidth=3,a.strokeStyle="white",a.moveTo(0,i+40),a.lineTo(h,i+40),a.stroke(),a.closePath()}t=n.init(),window.onkeydown=function(o){(o.keyCode>=49&&o.keyCode<=59||o.keyCode>=96&&o.keyCode<=105)&&"password"!==o.target.type&&(e=o.key,n.press(e),s.addWord(e,100,"rgba(225,225,225,1.0)",t[e].x,t[e].y,i-20))},window.onkeyup=function(){n.press()},o()}}(),b=function(){function t(e,i){o(this,t),i=i||{},this.Element=e,this.cvs=e.getContext("2d"),this.off_cvs=document.createElement("canvas"),this.off_cvs.width=e.width,this.off_cvs.height=e.height,this.Dom=this.off_cvs.getContext("2d"),this.width=e.width,this.height=e.height,this.length=i.length||100,this.RoundColor=i.RoundColor||"#1296db",this.RoundDiameter=i.RoundDiameter||20,this.LineColor=i.LineColor||"rgba(248,204,220,.1)",this.LineWeight=i.LineWeight||1,this.clicked=i.clicked||!1,this.moveon=i.moveon||!1,this.list=[],this.paused=!0}return f(t,[{key:"Run",value:function(){this.clicked&&this.Element.addEventListener("click",this.Clicked.bind(this)),this.moveon&&(this.Element.addEventListener("mousemove",this.moveXY.bind(this)),this.Element.addEventListener("mouseout",this.moveoutXY.bind(this))),this.Draw(this.getLength())}},{key:"getLength",value:function(){for(var t=[],e=0;e<this.length;e++){var i={};i.x=parseInt(Math.random()*this.width),i.y=parseInt(Math.random()*this.height),i.r=parseInt(10*Math.random())||1,i.controlX=parseInt(10*Math.random())>5?"left":"right",i.controlY=parseInt(10*Math.random())>5?"bottom":"top",t.push(i)}return t}},{key:"Draw",value:function(t){var e=this,i=[],s=[];t.map(function(t){var s=e.ControlXY(t),n=e.ControlRound(s);i.push(n)}),i.map(function(t){i.map(function(e){if(t!==e){var i=t.x-e.x,n=t.y-e.y;if(Math.abs(i)<100&&Math.abs(n)<100){var o={x1:t.x,y1:t.y,x2:e.x,y2:e.y};s.push(o)}}})}),this.drawLine(s),i.map(function(t){e.drawRound(t)}),this.list=i,this.cvs.drawImage(this.off_cvs,0,0,this.width,this.height),setTimeout(function(){e.paused&&e.next()},50)}},{key:"next",value:function(){this.cvs.clearRect(0,0,this.width,this.height),this.Dom.clearRect(0,0,this.width,this.height),this.Draw(this.list)}},{key:"drawRound",value:function(t){var e=t.x,i=t.y;this.Dom.beginPath(),this.Dom.arc(e,i,1.5,0,2*Math.PI),this.Dom.fillStyle=this.RoundColor,this.Dom.fill(),this.Dom.closePath()}},{key:"drawLine",value:function(t){var e=this;t.map(function(t){e.Dom.beginPath(),e.Dom.moveTo(t.x1,t.y1),e.Dom.lineTo(t.x2,t.y2),e.Dom.lineWidth=e.LineWeight,e.Dom.strokeStyle=e.LineColor,e.Dom.stroke(),e.Dom.closePath()})}},{key:"ControlXY",value:function(t){return t.x>=this.width-t.r?t.controlX="left":t.x<=parseInt(t.r/2)&&(t.controlX="right"),t.y>=this.height-t.r?t.controlY="bottom":t.y<=parseInt(t.r/2)&&(t.controlY="top"),t}},{key:"ControlRound",value:function(t){switch(t.controlX){case"right":t.x++;break;case"left":t.x--;break}switch(t.controlY){case"top":t.y++;break;case"bottom":t.y--;break}return t}},{key:"Clicked",value:function(t){var e={};e.x=t.clientX,e.y=t.clientY,e.r=parseInt(10*Math.random()),e.controlX=parseInt(10*Math.random())>5?"left":"right",e.controlY=parseInt(10*Math.random())>5?"bottom":"top",this.list.push(e)}},{key:"moveXY",value:function(t){var e={};e.x=t.clientX,e.y=t.clientY,e.r=0,e.move=!0,this.list[0]["move"]?(this.list[0]["x"]=e.x,this.list[0]["y"]=e.y,this.list[0]["r"]=1):this.list.unshift(e)}},{key:"moveoutXY",value:function(){this.list.shift()}},{key:"pause",value:function(){this.paused=!this.paused,this.paused&&this.Draw(this.list)}}]),t}(),P={name:"Login",data:function(){return{loginForm:{username:Object({NODE_ENV:"production",VUE_APP_BASE_API:"/prod-api",BASE_URL:"/"}).VUE_APP_USERNAME,password:Object({NODE_ENV:"production",VUE_APP_BASE_API:"/prod-api",BASE_URL:"/"}).VUE_APP_USER_PASSWORD},loginRules:{username:[{required:!0,trigger:"blur"},{min:5,max:30,message:"长度在 5 到 30 个字符",trigger:"change"}],password:[{required:!0,trigger:"blur"},{min:5,max:30,message:"长度在 5 到 30 个字符",trigger:"change"}]},loading:!1,eye:"fa-eye-slash",pwdType:"password"}},mounted:function(){var t=new b(document.getElementById("cvs_bg"),{length:100,clicked:!0,moveon:!0});t.Run(),y()},methods:{showPwd:function(){"password"===this.pwdType?(this.pwdType="",this.eye="fa-eye"):(this.pwdType="password",this.eye="fa-eye-slash")},handleLogin:function(){var t=this;this.$refs.loginForm.validate(function(e){if(!e)return console.log("error submit!!"),!1;t.loading=!0,t.$store.dispatch("user/login",t.loginForm).then(function(){t.loading=!1,t.$router.push({path:t.redirect||"/"}),t.$message1000("登录成功","success")}).catch(function(){t.loading=!1})})}}},_=P,C=(i("735d"),i("ad08"),i("2877")),E=Object(C["a"])(_,s,n,!1,null,null,null);e["default"]=E.exports},ad08:function(t,e,i){"use strict";var s=i("e973"),n=i.n(s);n.a},e973:function(t,e,i){},f370:function(t,e,i){}}]);