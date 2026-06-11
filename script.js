(function(){
  /* ===== 粒子系统（优化：更细腻的尘埃感） ===== */
  var pCanvas=document.getElementById('particleCanvas'),pCtx=pCanvas?pCanvas.getContext('2d'):null,particles=[],pAnimId=null;
  if(pCanvas&&pCtx){
    function resizeP(){pCanvas.width=window.innerWidth;pCanvas.height=window.innerHeight;}
    resizeP();window.addEventListener('resize',resizeP);
    for(var i=0;i<60;i++){
      var size=Math.random()<0.3?Math.random()*3+1:Math.random()*1.5+0.3;
      particles.push({
        x:Math.random()*pCanvas.width,y:Math.random()*pCanvas.height,
        r:size,
        dx:(Math.random()-.5)*0.2,
        dy:-Math.random()*0.4-0.05,
        o:Math.random()*0.2+0.05,
        pulse:Math.random()*Math.PI*2
      });
    }
    function drawP(){
      pCtx.clearRect(0,0,pCanvas.width,pCanvas.height);
      for(var j=0;j<particles.length;j++){
        var p=particles[j];
        p.pulse+=0.02;
        var flickerO=p.o*(0.7+0.3*Math.sin(p.pulse));
        pCtx.beginPath();pCtx.arc(p.x,p.y,p.r,0,Math.PI*2);
        pCtx.fillStyle='rgba(212,168,83,'+flickerO+')';pCtx.fill();
        p.x+=p.dx;p.y+=p.dy;
        if(p.y<-10){p.y=pCanvas.height+10;p.x=Math.random()*pCanvas.width;}
      }
      pAnimId=requestAnimationFrame(drawP);
    }
    drawP();
  }

  /* ===== 开篇动画控制 ===== */
  var opening=document.getElementById('opening'),openingDone=false;
  function endOpening(){
    if(openingDone)return;openingDone=true;
    if(pAnimId)cancelAnimationFrame(pAnimId);
    if(opening){opening.classList.add('fade-out');setTimeout(function(){opening.style.display='none';},1500);}
    document.getElementById('nav').classList.add('show');
  }
  document.addEventListener('DOMContentLoaded',function(){
    if(window.innerWidth < 768){
      endOpening();
    }else{
      setTimeout(endOpening,2500);
    }
  });
  setTimeout(endOpening,3500);
  if(opening)opening.addEventListener('click',endOpening);
  document.addEventListener('keydown',function skipKey(e){if(!openingDone){endOpening();document.removeEventListener('keydown',skipKey);}});

  /* ===== 数字动画 ===== */
  function animateNumber(el,target){var duration=2000,start=performance.now();function update(now){var progress=Math.min((now-start)/duration,1);var eased=1-Math.pow(1-progress,3);el.textContent=Math.floor(target*eased).toLocaleString();if(progress<1)requestAnimationFrame(update);}requestAnimationFrame(update);}

  /* ===== 滚动观察 ===== */
  var animEls=document.querySelectorAll('.timeline-item,.fade-in,.fade-in-left,.fade-in-right,.loss-card,.law-item,.bar-row,.rank-item');
  var wantedCards=document.querySelectorAll('.wanted-card');
  wantedCards.forEach(function(card,index){
    card.style.animationDelay=(index*0.15)+'s';
  });
  if(typeof IntersectionObserver!=='undefined'){
    var obs=new IntersectionObserver(function(entries){entries.forEach(function(e){if(e.isIntersecting){e.target.classList.add('visible');var nums=e.target.querySelectorAll('[data-target]');for(var k=0;k<nums.length;k++){(function(n){if(!n.dataset.animated){n.dataset.animated='1';animateNumber(n,parseInt(n.dataset.target));}})(nums[k]);}}});},{threshold:0.1});
    for(var ai=0;ai<animEls.length;ai++)obs.observe(animEls[ai]);
  }else{for(var fi=0;fi<animEls.length;fi++)animEls[fi].classList.add('visible');}

  var heroSection=document.getElementById('hero');
  if(heroSection&&typeof IntersectionObserver!=='undefined'){
    var heroObs=new IntersectionObserver(function(entries){entries.forEach(function(e){if(e.isIntersecting){var nums=e.target.querySelectorAll('.hero-stat .number');for(var hi=0;hi<nums.length;hi++){(function(n){if(!n.dataset.animated){n.dataset.animated='1';animateNumber(n,parseInt(n.dataset.target));}})(nums[hi]);}heroObs.unobserve(e.target);}});},{threshold:0.3});
    heroObs.observe(heroSection);
  }

  /* ===== 导航+进度条 ===== */
  var sections=document.querySelectorAll('section'),navLinks=document.querySelectorAll('#nav a'),progressBar=document.getElementById('progressBar');
  function onScroll(){var scrollTotal=document.documentElement.scrollHeight-window.innerHeight;if(progressBar)progressBar.style.width=(scrollTotal>0?(window.scrollY/scrollTotal)*100:0)+'%';var current='';for(var si=0;si<sections.length;si++)if(window.scrollY>=sections[si].offsetTop-200)current=sections[si].id;for(var ni=0;ni<navLinks.length;ni++){if(navLinks[ni].getAttribute('href')==='#'+current)navLinks[ni].classList.add('active');else navLinks[ni].classList.remove('active');}}
  window.addEventListener('scroll',onScroll,{passive:true});

  /* ===== 轮播 ===== */
  var currentSlide=0,track=document.getElementById('casesTrack'),totalSlides=track?track.children.length:0,dotsC=document.getElementById('sliderDots'),counter=document.getElementById('caseCounter');
  if(track&&dotsC){for(var di=0;di<totalSlides;di++){var dot=document.createElement('div');dot.className='dot'+(di===0?' active':'');dot.setAttribute('data-idx',di);dot.addEventListener('click',function(){goToSlide(parseInt(this.getAttribute('data-idx')));});dotsC.appendChild(dot);}}
  function goToSlide(n){currentSlide=n;if(track)track.style.transform='translateX(-'+n*100+'%)';if(dotsC){var dots=dotsC.querySelectorAll('.dot');for(var d=0;d<dots.length;d++){dots[d].classList.toggle('active',d===n);}}if(counter)counter.textContent=(n+1)+' / '+totalSlides;}
  var prevBtn=document.getElementById('prevBtn'),nextBtn=document.getElementById('nextBtn');
  if(prevBtn)prevBtn.addEventListener('click',function(){goToSlide((currentSlide-1+totalSlides)%totalSlides);});
  if(nextBtn)nextBtn.addEventListener('click',function(){goToSlide((currentSlide+1)%totalSlides);});
  var sliderInterval=setInterval(function(){if(totalSlides>0)goToSlide((currentSlide+1)%totalSlides);},12000);
  var sliderEl=document.querySelector('.cases-slider');
  if(sliderEl){
    sliderEl.addEventListener('mouseenter',function(){clearInterval(sliderInterval);});
    sliderEl.addEventListener('mouseleave',function(){sliderInterval=setInterval(function(){if(totalSlides>0)goToSlide((currentSlide+1)%totalSlides);},12000);});
  }

  /* ===== 地图悬停 ===== */
  var provinces=document.querySelectorAll('.province[data-name]'),tooltip=document.getElementById('mapTooltip');
  for(var pi=0;pi<provinces.length;pi++){(function(pr){pr.addEventListener('mouseenter',function(){document.getElementById('ttName').textContent='📍 '+pr.getAttribute('data-name');document.getElementById('ttCases').textContent=pr.getAttribute('data-cases');document.getElementById('ttInfo').textContent=pr.getAttribute('data-info');if(tooltip)tooltip.classList.add('show');});pr.addEventListener('mousemove',function(e){if(!tooltip)return;var rect=pr.closest('.map-wrapper').getBoundingClientRect();tooltip.style.left=(e.clientX-rect.left+15)+'px';tooltip.style.top=(e.clientY-rect.top-60)+'px';});pr.addEventListener('mouseleave',function(){if(tooltip)tooltip.classList.remove('show');});})(provinces[pi]);}

  /* ===== 趋势图 ===== */
  var trendAnimating=false;
  function drawTrend(animated=true){
    var canvas=document.getElementById('trendCanvas');
    if(!canvas||!canvas.getContext)return;
    var ctx=canvas.getContext('2d'),dpr=window.devicePixelRatio||1,cw=canvas.parentElement.offsetWidth,ch=260;
    canvas.width=cw*dpr;canvas.height=ch*dpr;
    canvas.style.width=cw+'px';canvas.style.height=ch+'px';
    ctx.scale(dpr,dpr);
    
    var data=[{y:'2011',v:78},{y:'2012',v:95},{y:'2013',v:120},{y:'2014',v:155},{y:'2015',v:180},{y:'2016',v:195},{y:'2017',v:225},{y:'2018',v:249},{y:'2019',v:219}];
    var pad={t:28,r:18,b:36,l:42},cW=cw-pad.l-pad.r,cH=ch-pad.t-pad.b,maxV=280;
    
    function drawBackground(){
      ctx.strokeStyle='rgba(212,168,83,0.06)';
      ctx.lineWidth=1;
      for(var g=0;g<=4;g++){
        var gy=pad.t+cH*(g/4);
        ctx.beginPath();ctx.moveTo(pad.l,gy);ctx.lineTo(cw-pad.r,gy);ctx.stroke();
        ctx.fillStyle='#8a7e72';ctx.font='11px sans-serif';ctx.textAlign='right';
        ctx.fillText(Math.round(maxV*(1-g/4)),pad.l-8,gy+4);
      }
    }
    
    function drawLabels(){
      var gap=cW/data.length,barW=gap*0.6;
      for(var b=0;b<data.length;b++){
        var bx=pad.l+gap*b+(gap-barW)/2;
        ctx.fillStyle='#8a7e72';ctx.font='10px sans-serif';
        ctx.textAlign='center';
        ctx.fillText(data[b].y+'年',bx+barW/2,pad.t+cH+18);
      }
      var pkX=pad.l+gap*7+barW/2,pkY=pad.t+cH-(249/maxV)*cH;
      ctx.strokeStyle='rgba(196,75,62,0.4)';ctx.lineWidth=1;ctx.setLineDash([3,3]);
      ctx.beginPath();ctx.moveTo(pkX,pkY-18);ctx.lineTo(pkX+35,pkY-45);ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle='#c44b3e';ctx.font='bold 11px sans-serif';
      ctx.fillText('历年最高',pkX+37,pkY-45);
    }
    
    function drawBars(progress=1){
      var gap=cW/data.length,barW=gap*0.6;
      for(var b=0;b<data.length;b++){
        var bx=pad.l+gap*b+(gap-barW)/2;
        var bh=((data[b].v/maxV)*cH)*progress;
        var by=pad.t+cH-bh;
        
        var grad=ctx.createLinearGradient(bx,by,bx,pad.t+cH);
        if(data[b].v>=240){grad.addColorStop(0,'#c44b3e');grad.addColorStop(1,'rgba(196,75,62,0.25)');}
        else if(data[b].v>=150){grad.addColorStop(0,'#d4a853');grad.addColorStop(1,'rgba(212,168,83,0.25)');}
        else{grad.addColorStop(0,'#6b8f78');grad.addColorStop(1,'rgba(107,143,120,0.25)');}
        ctx.fillStyle=grad;
        
        var r=4;
        ctx.beginPath();
        if(bh>r*2){
          ctx.moveTo(bx+r,by);
          ctx.lineTo(bx+barW-r,by);
          ctx.quadraticCurveTo(bx+barW,by,bx+barW,by+r);
          ctx.lineTo(bx+barW,by+bh);
          ctx.lineTo(bx,by+bh);
          ctx.lineTo(bx,by+r);
          ctx.quadraticCurveTo(bx,by,bx+r,by);
        }else{
          ctx.rect(bx,by,barW,bh);
        }
        ctx.fill();
        
        if(progress>=0.85){
          ctx.fillStyle='#ede5d4';ctx.font='bold 11px sans-serif';ctx.textAlign='center';
          ctx.globalAlpha=(progress-0.85)/0.15;
          ctx.fillText(data[b].v,bx+barW/2,by-7);
          ctx.globalAlpha=1;
        }
      }
    }
    
    if(!animated){
      drawBackground();
      drawBars(1);
      drawLabels();
      return;
    }
    
    drawBackground();
    
    if(trendAnimating)return;
    trendAnimating=true;
    
    var duration=1600;
    var startTime=performance.now();
    
    function animate(now){
      var elapsed=now-startTime;
      var progress=Math.min(elapsed/duration,1);
      var eased=1-Math.pow(1-progress,3);
      
      ctx.clearRect(0,0,cw,ch);
      drawBackground();
      drawBars(eased);
      if(progress>=0.85)drawLabels();
      
      if(progress<1)requestAnimationFrame(animate);
      else trendAnimating=false;
    }
    requestAnimationFrame(animate);
  }
  


  /* ===== 环形图 ===== */
  function drawDonut(){var canvas=document.getElementById('donutCanvas');if(!canvas||!canvas.getContext)return;var ctx=canvas.getContext('2d'),dpr=window.devicePixelRatio||1;canvas.width=200*dpr;canvas.height=200*dpr;canvas.style.width='200px';canvas.style.height='200px';ctx.scale(dpr,dpr);var cx=100,cy=100,r=75,lw=22;var segs=[{v:2600,c:'#c44b3e'},{v:280,c:'#d4a853'},{v:50,c:'#6b8f78'},{v:35070,c:'#5c554d'}];var total=0;for(var s=0;s<segs.length;s++)total+=segs[s].v;var angle=-Math.PI/2;for(var si=0;si<segs.length;si++){var sweep=(segs[si].v/total)*Math.PI*2;ctx.beginPath();ctx.arc(cx,cy,r,angle,angle+sweep);ctx.strokeStyle=segs[si].c;ctx.lineWidth=lw;ctx.lineCap='butt';ctx.stroke();angle+=sweep;}ctx.fillStyle='#ede5d4';ctx.font='bold 22px serif';ctx.textAlign='center';ctx.fillText('3.8万',cx,cy+2);ctx.fillStyle='#8a7e72';ctx.font='11px sans-serif';ctx.fillText('件追缴文物',cx,cy+20);}

  var chartsSection=document.querySelector('#charts');
  if(typeof IntersectionObserver!=='undefined'&&chartsSection){
    var chartObs=new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){
          try{drawTrend(true);}catch(ex){}
          try{drawDonut();}catch(ex){}
          chartObs.unobserve(chartsSection);
        }
      });
    },{threshold:0.2});
    chartObs.observe(chartsSection);
  }else{
    setTimeout(function(){try{drawTrend(false);}catch(e){}try{drawDonut();}catch(e){}},800);
  }
  window.addEventListener('resize',function(){try{drawTrend(false);}catch(e){}});

  var scrollTopBtn=document.getElementById('scrollTopBtn');if(scrollTopBtn)scrollTopBtn.addEventListener('click',function(){window.scrollTo({top:0,behavior:'smooth'});});
  var touchX=0,sliderEl=document.querySelector('.cases-slider');
  if(sliderEl){sliderEl.addEventListener('touchstart',function(e){touchX=e.touches[0].clientX;},{passive:true});sliderEl.addEventListener('touchend',function(e){var diff=touchX-e.changedTouches[0].clientX;if(Math.abs(diff)>50){if(diff>0)goToSlide((currentSlide+1)%totalSlides);else goToSlide((currentSlide-1+totalSlides)%totalSlides);}},{passive:true});}
  document.addEventListener('keydown',function(e){if(e.key==='ArrowRight'&&nextBtn)nextBtn.click();if(e.key==='ArrowLeft'&&prevBtn)prevBtn.click();});

  /* ===== 通缉令查看详情 ===== */
  document.querySelectorAll('.wanted-expand[data-action="toggle"]').forEach(function(btn){
    btn.addEventListener('click',function(){
      var card = this.closest('.wanted-card');
      var note = card.querySelector('.wanted-note');
      var isExpanded = card.classList.contains('expanded');
      if(isExpanded){
        card.classList.remove('expanded');
        note.style.display = 'none';
        this.textContent = '▸ 点击查看备注';
      } else {
        card.classList.add('expanded');
        note.style.display = 'block';
        this.textContent = '▼ 收起备注';
      }
    });
  });
})();

(function(){
var A=[{"name":"青铜鼎","era":"商代晚期 · 青铜礼器","cols":2,"rows":2,"image":"images/image-24.png","title":"判决文书样本","data":"1,316 份","copy":"本报道梳理了公开裁判文书中的盗墓相关案件。修复一件文物，只需数分钟；现实中的证据整理、追索与归还，往往需要多年。","source":"来源：中国裁判文书网（本报道样本口径）"},{"name":"唐三彩马","era":"唐代 · 陶俑","cols":2,"rows":2,"image":"images/image-25.png","title":"案件判决高峰","data":"249 起","copy":"样本中，2018 年判决数量达到阶段高点。产业化、跨区域化和网络化，使文物犯罪链条更难切断。","source":"来源：中国裁判文书网，2011-2019 年趋势统计"},{"name":"壁画残片","era":"北魏 · 石窟艺术","cols":3,"rows":2,"image":"images/image-26.svg","title":"追缴行动","data":"3.8 万件","copy":"2021 年专项行动追缴文物约 3.8 万件。数字背后，是鉴定、比对、侦查和跨地区协作共同完成的修复链。","source":"来源：公安部 2021 年专项行动通报"},{"name":"玉璧","era":"良渚文化 · 史前玉器","cols":2,"rows":2,"image":"images/image-27.png","title":"平台公示追索","data":"227 件","copy":"国家文物局被盗文物信息发布平台仍有数百件文物公开追索。公开档案让社会识别和跨境追踪有据可查。","source":"来源：国家文物局被盗（丢失）文物信息发布平台"},{"name":"佛首","era":"北齐 · 石刻造像","cols":2,"rows":2,"image":"images/image-28.svg","title":"漫长的归乡路","data":"100 万件+","copy":"据本报道引用的国家文物局估算，仍有大量中国文物流失海外。每一次归还，都是法律、外交、学术与公众关注共同推动的结果。","source":"来源：国家文物局公开估算（本报道引用口径）"}],q=function(s){return document.querySelector(s)},level=0,placed=0,total=A.reduce(function(n,a){return n+a.cols*a.rows},0),started=0,startAt=0,timer=0,drag=null;
function pos(i,a){var c=i%a.cols,r=Math.floor(i/a.cols);return{x:a.cols===1?0:c/(a.cols-1)*100,y:a.rows===1?0:r/(a.rows-1)*100};}
function paint(el,a,i){var p=pos(i,a);el.style.backgroundImage='url("'+a.image+'")';el.style.backgroundSize=(a.cols*100)+'% '+(a.rows*100)+'%';el.style.backgroundPosition=p.x+'% '+p.y+'%';}
function load(){var a=A[level],pool=q('#rg-pool'),board=q('#rg-board');pool.querySelectorAll('.rg-piece').forEach(function(x){x.remove()});board.innerHTML='';q('#rg-name').textContent=a.name;q('#rg-era').textContent=a.era;q('#rg-level').textContent=(level+1)+' / '+A.length;var bw=board.clientWidth,bh=board.clientHeight,sw=bw/a.cols,sh=bh/a.rows;for(var i=0;i<a.cols*a.rows;i++){var s=document.createElement('div');s.className='rg-slot';s.dataset.i=i;s.style.cssText='left:'+(i%a.cols*sw)+'px;top:'+(Math.floor(i/a.cols)*sh)+'px;width:'+sw+'px;height:'+sh+'px';board.appendChild(s);}var order=[];for(var j=0;j<a.cols*a.rows;j++)order.push(j);order.sort(function(){return Math.random()-.5});order.forEach(function(idx,k){var p=document.createElement('div');p.className='rg-piece';p.dataset.i=idx;paint(p,a,idx);p.style.left=(18+(k%3)*105)+'px';p.style.top=(55+Math.floor(k/3)*108)+'px';pool.appendChild(p);p.addEventListener('pointerdown',down);});}
function down(e){if(!started)return;e.preventDefault();var p=e.currentTarget,r=p.getBoundingClientRect();drag={p:p,ox:e.clientX-r.left,oy:e.clientY-r.top,parent:p.parentNode,left:p.style.left,top:p.style.top};document.body.appendChild(p);p.style.position='fixed';p.style.zIndex=3500;p.style.width=r.width+'px';p.style.height=r.height+'px';move(e);p.setPointerCapture&&p.setPointerCapture(e.pointerId);p.addEventListener('pointermove',move);p.addEventListener('pointerup',up,{once:true});}
function move(e){if(!drag)return;drag.p.style.left=(e.clientX-drag.ox)+'px';drag.p.style.top=(e.clientY-drag.oy)+'px';document.querySelectorAll('#rg-board .rg-slot').forEach(function(s){var r=s.getBoundingClientRect();s.classList.toggle('rg-hot',e.clientX>r.left&&e.clientX<r.right&&e.clientY>r.top&&e.clientY<r.bottom&&!s.classList.contains('rg-ok'));});}
function up(e){if(!drag)return;var hit=null;document.querySelectorAll('#rg-board .rg-slot').forEach(function(s){var r=s.getBoundingClientRect();if(e.clientX>r.left&&e.clientX<r.right&&e.clientY>r.top&&e.clientY<r.bottom)hit=s;s.classList.remove('rg-hot');});var p=drag.p,a=A[level];p.removeEventListener('pointermove',move);if(hit&&!hit.classList.contains('rg-ok')&&+hit.dataset.i===+p.dataset.i){hit.classList.add('rg-ok');var z=document.createElement('div');z.className='rg-placed';paint(z,a,+p.dataset.i);hit.appendChild(z);p.remove();placed++;update();if(q('#rg-board').querySelectorAll('.rg-ok').length===a.cols*a.rows)setTimeout(card,350);}else{drag.parent.appendChild(p);p.style.position='absolute';p.style.zIndex='5';p.style.width='92px';p.style.height='92px';p.style.left=drag.left;p.style.top=drag.top;}drag=null;}
function update(){q('#rg-score').textContent=placed+' / '+total;q('#rg-progress').style.width=(placed/total*100)+'%';}
function card(){var a=A[level];q('#rg-card-title').textContent=a.title;q('#rg-card-data').textContent=a.data;q('#rg-card-copy').textContent=a.copy;q('#rg-card-source').textContent=a.source;q('#rg-card-overlay').classList.add('rg-show');}
function next(){q('#rg-card-overlay').classList.remove('rg-show');level++;if(level>=A.length)finish();else load();}
function tick(){var s=Math.floor((Date.now()-startAt)/1000),m=Math.floor(s/60);q('#rg-time').textContent=m+':'+String(s%60).padStart(2,'0');}
function start(){level=0;placed=0;started=1;startAt=Date.now();clearInterval(timer);timer=setInterval(tick,1000);q('#rg-time').textContent='0:00';q('#rg-start').classList.add('rg-hidden');q('#rg-end').classList.add('rg-hidden');update();load();}
function finish(){started=0;clearInterval(timer);var secs=Math.floor((Date.now()-startAt)/1000),rating=secs<=150?'S':secs<=240?'A':'B';q('#rg-end-title').textContent='修复完成 · '+rating+' 级';q('#rg-end-copy').textContent='你已归位 '+total+' 块碎片，用时 '+Math.floor(secs/60)+' 分 '+secs%60+' 秒。文物可以在屏幕上复原，但真实的追索仍需要可靠数据与长期协作。';q('#rg-end').classList.remove('rg-hidden');}
q('#rg-start-btn').addEventListener('click',start);q('#rg-restart-btn').addEventListener('click',start);q('#rg-next-btn').addEventListener('click',next);load();update();
})();
