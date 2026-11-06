// Front-end preview only. Real catalogue, stock limits, checkout and orders
// will be connected to a secure backend before the website accepts payments.
const books = [
  {id:'mystery-01',genre:'Literary Fiction',title:'The Quiet Unravelling',description:'A woman returns to a place she once called home and discovers how much can change in the spaces between two versions of a life.',pages:320,origin:'Sample author origin',cover:'cover-1',symbol:'I',label:'A STUDY IN BECOMING'},
  {id:'mystery-02',genre:'Romance',title:'Terms of Almost',description:'Two stubborn people, one unfinished conversation, and a connection that refuses to stay neatly in the past.',pages:368,origin:'Sample author origin',cover:'cover-2',symbol:'II',label:'A COMPLICATED AFFAIR'},
  {id:'mystery-03',genre:'Fantasy',title:'The Map of Lost Things',description:'A strange map, a city with a memory of its own, and a journey where every answer asks for something in return.',pages:416,origin:'Sample author origin',cover:'cover-3',symbol:'III',label:'A WORLD BETWEEN WORLDS'},
  {id:'mystery-04',genre:'Thrillers',title:'Someone Knows the Ending',description:'A small detail in an old case refuses to stay buried. The closer the truth gets, the less anyone can be trusted.',pages:304,origin:'Sample author origin',cover:'cover-4',symbol:'IV',label:'NOTHING STAYS HIDDEN'},
  {id:'mystery-05',genre:'Literary Fiction',title:'The Shape of Leaving',description:'An intimate story about friendship, reinvention and the quiet decisions that alter the course of an ordinary life.',pages:352,origin:'Sample author origin',cover:'cover-5',symbol:'V',label:'THE ART OF LETTING GO'},
  {id:'mystery-06',genre:'Fantasy',title:'A Kingdom of Small Miracles',description:'In a kingdom governed by old bargains, one impossible act of kindness may be the most dangerous magic of all.',pages:448,origin:'Sample author origin',cover:'cover-6',symbol:'VI',label:'A TALE OF OLD MAGIC'}
];
const tiers = [{name:'The Little Mystery',price:699},{name:'The Lovely Surprise',price:799},{name:'The Grand Unwrap',price:899}];
let selectedFilter='All';
let bag=[];
const rupees = value => new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0}).format(value);

function renderBooks(){
  const grid=document.querySelector('#book-grid');
  const visible=selectedFilter==='All'?books:books.filter(book=>book.genre===selectedFilter);
  grid.innerHTML=visible.map(book=>`<article class="book-card">
    <div class="book-cover ${book.cover}"><span class="cover-symbol">${book.symbol}</span><span class="cover-label">${book.label}</span></div>
    <div class="book-info"><span class="book-genre">${book.genre}</span><h3>${book.title}</h3><p>${book.description}</p>
      <div class="book-meta"><span>${book.pages} pages</span><span>${book.origin}</span></div>
      <div class="card-actions"><label class="sr-only" for="tier-${book.id}">Choose package for ${book.title}</label><select class="tier-select" id="tier-${book.id}">${tiers.map(tier=>`<option value="${tier.price}">${tier.name} · ${rupees(tier.price)}</option>`).join('')}</select><button class="add-button" data-add="${book.id}" type="button">Add to bag +</button></div>
    </div></article>`).join('');
}
function addToBag(id){
  const book=books.find(item=>item.id===id);
  const select=document.querySelector(`#tier-${id}`);
  const price=Number(select.value);
  const tier=tiers.find(item=>item.price===price);
  bag.push({key:`${id}-${Date.now()}-${Math.random()}`,id,title:book.title,price,tier:tier.name});
  renderBag();
}
function renderBag(){
  const count=bag.length;
  document.querySelector('#bag-count').textContent=count;
  document.querySelector('#drawer-count').textContent=`(${count})`;
  document.querySelector('#bag-total').textContent=rupees(bag.reduce((sum,item)=>sum+item.price,0));
  const container=document.querySelector('#bag-items');
  container.innerHTML=count?bag.map(item=>`<div class="bag-item"><div><strong>${item.title}</strong><small>${item.tier} · ${rupees(item.price)}</small></div><button class="remove-item" data-remove="${item.key}" type="button">Remove</button></div>`).join(''):'<p class="empty-bag">Your bag is waiting for a story.</p>';
}
function openBag(){document.querySelector('#bag-drawer').classList.add('open');document.querySelector('#bag-drawer').setAttribute('aria-hidden','false');document.querySelector('#drawer-backdrop').hidden=false;document.body.style.overflow='hidden';}
function closeBag(){document.querySelector('#bag-drawer').classList.remove('open');document.querySelector('#bag-drawer').setAttribute('aria-hidden','true');document.querySelector('#drawer-backdrop').hidden=true;document.body.style.overflow='';}

document.addEventListener('click',event=>{
  const add=event.target.closest('[data-add]');if(add)addToBag(add.dataset.add);
  const remove=event.target.closest('[data-remove]');if(remove){bag=bag.filter(item=>item.key!==remove.dataset.remove);renderBag();}
  const filter=event.target.closest('[data-filter]');if(filter){selectedFilter=filter.dataset.filter;document.querySelectorAll('.filter-chip').forEach(chip=>chip.classList.toggle('active',chip===filter));renderBooks();}
});
document.querySelector('#open-bag').addEventListener('click',openBag);
document.querySelector('#close-bag').addEventListener('click',closeBag);
document.querySelector('#drawer-backdrop').addEventListener('click',closeBag);
document.addEventListener('keydown',event=>{if(event.key==='Escape')closeBag();});
document.querySelector('#year').textContent=new Date().getFullYear();
renderBooks();renderBag();
