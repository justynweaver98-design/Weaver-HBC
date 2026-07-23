
const menu=document.querySelector('.menu'), links=document.querySelector('.navlinks');
if(menu) menu.addEventListener('click',()=>links.classList.toggle('open'));
document.querySelectorAll('.navlinks a').forEach(a=>a.addEventListener('click',()=>links.classList.remove('open')));
const modal=document.querySelector('.modal');
if(modal){
 document.querySelectorAll('.gallery img').forEach(img=>img.addEventListener('click',()=>{modal.querySelector('img').src=img.src;modal.classList.add('open')}));
 modal.addEventListener('click',e=>{if(e.target===modal||e.target.tagName==='BUTTON')modal.classList.remove('open')});
}
