// Theme toggle
const themeBtn=document.getElementById('themeBtn');
themeBtn.onclick=()=>{
  const cur=document.documentElement.getAttribute('data-theme');
  const next=cur==='light'?'dark':'light';
  document.documentElement.setAttribute('data-theme', next);
  themeBtn.textContent = next==='light' ? '☀️' : '🌙';
};

// Progress bar
const prog=document.getElementById('prog');
window.addEventListener('scroll',()=>{
  const h=document.documentElement;
  const pct=(h.scrollTop)/(h.scrollHeight-h.clientHeight)*100;
  prog.style.width=Math.min(100,Math.max(0,pct))+'%';
});

// Static area diagram (theory section)
function drawArea(){
  const svg=document.getElementById('areaSvg');
  svg.innerHTML=`
    <rect x="10" y="10" width="160" height="160" fill="var(--teal)" opacity="0.85" rx="4"/>
    <rect x="10" y="10" width="60" height="60" fill="var(--coral)" opacity="0.9" rx="4"/>
    <text x="90" y="145" fill="#06231F" font-size="15" text-anchor="middle">a²−b²</text>
    <text x="40" y="45" fill="#3a0a0a" font-size="12" text-anchor="middle">b²</text>
  `;
}
drawArea();

// Playground
const aSlide=document.getElementById('aSlide'), bSlide=document.getElementById('bSlide');
const aVal=document.getElementById('aVal'), bVal=document.getElementById('bVal');
const pgSvg=document.getElementById('pgSvg'), solveBox=document.getElementById('solveBox');

function clampB(){
  if(parseInt(bSlide.value) >= parseInt(aSlide.value)){
    bSlide.value = parseInt(aSlide.value)-1;
  }
  bSlide.max = parseInt(aSlide.value)-1;
}

function renderPG(){
  clampB();
  const a=parseInt(aSlide.value), b=parseInt(bSlide.value);
  aVal.textContent=a; bVal.textContent=b;
  const scale=180/a;
  const side=a*scale, bSide=b*scale;
  pgSvg.innerHTML=`
    <rect x="20" y="20" width="${side}" height="${side}" fill="var(--teal)" opacity="0.85" rx="3"/>
    <rect x="20" y="20" width="${bSide}" height="${bSide}" fill="var(--coral)" opacity="0.95" rx="3"/>
    <text x="${20+side/2}" y="${20+side+22}" fill="var(--text)" font-size="13" text-anchor="middle">lado a=${a}</text>
    <text x="${20+bSide/2}" y="${20+bSide/2+5}" fill="#3a0a0a" font-size="12" text-anchor="middle">b=${b}</text>
  `;
  const a2=a*a, b2=b*b, diff=a2-b2, sum=a+b, sub=a-b;
  solveBox.innerHTML=`
    a² − b² = ${a2} − ${b2} = <b>${diff}</b><br>
    (a+b)(a−b) = (${sum})(${sub}) = <b>${diff}</b>
  `;
}
aSlide.oninput=renderPG; bSlide.oninput=renderPG;
document.querySelectorAll('.preset-btn').forEach(btn=>{
  btn.onclick=()=>{ aSlide.value=btn.dataset.a; bSlide.value=btn.dataset.b; renderPG(); };
});
renderPG();

// Accordion exercises
const exercises=[
 {lvl:"Nivel 0 · Base operativa", q:"Calcula 6² y 2²", steps:["6² = 36","2² = 4"], res:"36 y 4"},
 {lvl:"Nivel 1 · Aplicación directa", q:"Factoriza 9x² − 25", steps:["9x² = (3x)², 25 = 5²","Aplica la regla: (3x+5)(3x−5)"], res:"(3x+5)(3x−5)"},
 {lvl:"Nivel 2 · Combinación", q:"Factoriza x⁴ − 16", steps:["x⁴ − 16 = (x²)² − 4²","= (x²+4)(x²−4)","x²−4 aún es diferencia de cuadrados: (x+2)(x−2)","Resultado final: (x²+4)(x+2)(x−2)"], res:"(x²+4)(x+2)(x−2)"},
 {lvl:"Nivel 3 · Aplicación con radicales", q:"Racionaliza 1 / (√5 + 2)", steps:["Multiplica numerador y denominador por el conjugado (√5 − 2)","Denominador: (√5+2)(√5−2) = 5 − 4 = 1","Resultado: √5 − 2"], res:"√5 − 2"}
];
const acc=document.getElementById('accordion');
exercises.forEach((ex,i)=>{
  const div=document.createElement('div');
  div.className='acc-item';
  div.innerHTML=`
    <div class="acc-head" onclick="this.parentElement.classList.toggle('open')">
      <div><span class="lvl">${ex.lvl}</span><br>${ex.q}</div>
      <span class="chevron">▾</span>
    </div>
    <div class="acc-body"><div class="acc-body-in">
      <ol class="steps">${ex.steps.map(s=>`<li>${s}</li>`).join('')}</ol>
      <div class="result-box">Resultado: ${ex.res}</div>
    </div></div>
  `;
  acc.appendChild(div);
});

// Practice widget
let curP={};
function genPractice(){
  const a=Math.floor(Math.random()*8)+2, b=Math.floor(Math.random()*(a-1))+1;
  curP={a,b};
  document.getElementById('practiceQ').textContent = `Factoriza: x² − ${a*a>0?'':''}${(a*a-0)}... `; // placeholder replaced below
  document.getElementById('practiceQ').textContent = `Factoriza: ${a}²x² − ${b}²  (usa a=${a}x, b=${b})`;
  document.getElementById('pAnswer').value='';
  document.getElementById('pfeedback').textContent='';
}
function checkPractice(){
  const val=document.getElementById('pAnswer').value.replace(/\s+/g,'').toLowerCase();
  const a=curP.a, b=curP.b;
  const opt1=`(${a}x+${b})(${a}x-${b})`.replace(/\s+/g,'').toLowerCase();
  const opt2=`(${a}x-${b})(${a}x+${b})`.replace(/\s+/g,'').toLowerCase();
  const fb=document.getElementById('pfeedback');
  if(val===opt1||val===opt2){
    fb.style.color='var(--teal)'; fb.textContent='¡Correcto! ✔';
  } else {
    fb.style.color='var(--coral)'; fb.textContent=`Pista: recuerda (a+b)(a−b). Intenta con a=${a}x y b=${b}.`;
  }
}
function newPractice(){ genPractice(); }
genPractice();

// Quiz
const quizData=[
 {q:"¿Cuál es la factorización completa de x⁴ − 81?", opts:["(x²+9)(x+3)(x−3)","(x²−9)(x²+9)","(x−3)⁴"], correct:0},
 {q:"¿Qué condición deben cumplir los dos binomios para dar diferencia de cuadrados?", opts:["Mismos términos, signos opuestos","Términos distintos","Ambos negativos"], correct:0},
 {q:"Al racionalizar 1/(√7−1), ¿por qué se multiplica por (√7+1)?", opts:["Es el conjugado y elimina la raíz del denominador","Porque simplifica el numerador","Porque cambia el signo del resultado"], correct:0},
 {q:"Factoriza 16x² − 9y²", opts:["(4x+3y)(4x−3y)","(16x+9y)(16x−9y)","(4x+9y)(4x−9y)"], correct:0}
];
let score=0;
const quizDiv=document.getElementById('quiz');
quizData.forEach((qd,qi)=>{
  const qDiv=document.createElement('div'); qDiv.className='q';
  qDiv.innerHTML=`<p>${qi+1}. ${qd.q}</p>`;
  qd.opts.forEach((opt,oi)=>{
    const b=document.createElement('button');
    b.className='opt'; b.textContent=opt;
    b.onclick=()=>{
      if(b.dataset.done)return;
      qDiv.querySelectorAll('.opt').forEach(o=>o.dataset.done='1');
      if(oi===qd.correct){ b.classList.add('correct'); score++; }
      else { b.classList.add('wrong'); qDiv.querySelectorAll('.opt')[qd.correct].classList.add('correct'); }
      document.getElementById('quizScore').textContent=score;
    };
    qDiv.appendChild(b);
  });
  quizDiv.appendChild(qDiv);
});