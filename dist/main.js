(()=>{"use strict";const e={PIXEL_SCALE:4,TILE_SIZE:15,SCREEN_WIDTH:25,SCREEN_HEIGHT:13,FRAME_DELAY:0,GRAVITY:1.1,MAX_Y_SPEED:8},t=[[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]];class i{constructor(){this.queue=[],window.addEventListener("keydown",(e=>this.updateInputQueue(e)),!1),window.addEventListener("keyup",(e=>this.updateInputQueue(e)),!1)}updateInputQueue(e){let t=e.keyCode;"keydown"===e.type?this.queue.includes(t)||this.queue.push(t):this.queue.includes(t)&&this.queue.splice(this.queue.indexOf(t),1)}}const{abs:d}=Math;class n{constructor(){this.x=e.TILE_SIZE,this.y=e.TILE_SIZE,this.width=e.TILE_SIZE,this.height=2*e.TILE_SIZE,this.xSpeed=0,this.ySpeed=0}applyMomentum(t){let i=e=>t.indexOf(e)>-1;i(37)&&(!i(39)||t.indexOf(37)>t.indexOf(39))?(this.xSpeed-=1,this.xSpeed<-5&&(this.xSpeed=-5)):i(39)&&(!i(39)||t.indexOf(39)>t.indexOf(37))&&(this.xSpeed+=1,this.xSpeed>5&&(this.xSpeed=5)),this.xSpeed=this.xSpeed/1.5,d(this.xSpeed)<=.001&&(this.xSpeed=0),0===this.ySpeed?this.ySpeed=e.GRAVITY:(this.ySpeed*=e.GRAVITY,this.ySpeed>e.MAX_Y_SPEED&&(this.ySpeed=e.MAX_Y_SPEED)),this.y>=150&&(this.y=150,this.ySpeed=0),this.x+=this.xSpeed,this.y+=this.ySpeed}}let s,E,S,h,o,u,l=0,{round:p}=Math;function I(){if(l++,l<=e.FRAME_DELAY)return requestAnimationFrame(I);l=0,u.applyMomentum(o.queue),E.clearRect(0,0,S,h),E.fillStyle="#002080",E.fillRect(0,0,500,500),function(){let i=(t,i)=>{E.fillStyle="#505050",E.fillRect(t,i,e.TILE_SIZE,e.TILE_SIZE),E.fillStyle="#aaa",E.fillRect(t+1,i+1,e.TILE_SIZE-2,e.TILE_SIZE-2)};for(let d=0;d<e.SCREEN_HEIGHT;d++)for(let n=0;n<e.SCREEN_WIDTH;n++)t[d][n]>0&&i(n*e.TILE_SIZE,d*e.TILE_SIZE)}(),E.fillStyle="#dddddd",E.fillRect(p(u.x),p(u.y),u.width,u.height),function(){let e=`x:${u.x.toPrecision(5)} y:${u.y.toPrecision(5)} xSpeed: ${u.xSpeed.toPrecision(5)} ySpeed: ${u.ySpeed.toPrecision(5)} inputs: ${o.queue}`;E.fillStyle="#050505",E.font="bold 10px monospace",E.textBaseline="hanging",E.fillText(e,2,2)}(),requestAnimationFrame(I)}document.addEventListener("DOMContentLoaded",(function(){s=document.createElement("canvas"),s.id="gameCanvas",S=e.SCREEN_WIDTH*e.TILE_SIZE*e.PIXEL_SCALE,h=e.SCREEN_HEIGHT*e.TILE_SIZE*e.PIXEL_SCALE,s.width=S,s.height=h,E=s.getContext("2d"),E.scale(e.PIXEL_SCALE,e.PIXEL_SCALE),E.imageSmoothingEnabled=!1,document.body.style.backgroundColor="#000",document.body.style.height="100%",document.body.style.overflow="hidden",document.body.appendChild(s),u=new n,o=new i,I()}),!1)})();