import React, {useEffect, useState} from "react";
import {createRoot} from "react-dom/client";
import "./style.css";

const packs = [
  {id:29, name:"Túi mù 29k", price:29000},
  {id:49, name:"Túi mù 49k", price:49000},
  {id:99, name:"Túi mù 99k", price:99000},
  {id:199, name:"Túi mù 199k", price:199000},
  {id:499, name:"Túi mù 499k", price:499000},
];

const seedUsers = Array.from({length:50}, (_,i)=>({
  name:`DemoUser${String(i+1).padStart(2,"0")}`,
  amount: 5000000 - i*73000
}));

function load(key, fallback){
  try { const v=localStorage.getItem(key); return v===null ? fallback : JSON.parse(v); }
  catch { return fallback; }
}

function App(){
  const [balance,setBalance] = useState(()=>load("tuna_balance",1000000));
  const [history,setHistory] = useState(()=>load("tuna_history",[]));
  const [users,setUsers] = useState(()=>load("tuna_users",seedUsers));
  const [gift,setGift] = useState("");
  const [notice,setNotice] = useState("");
  const [demoDeposits,setDemoDeposits] = useState(()=>load("tuna_demo_deposits",true));

  useEffect(()=>localStorage.setItem("tuna_balance",JSON.stringify(balance)),[balance]);
  useEffect(()=>localStorage.setItem("tuna_history",JSON.stringify(history)),[history]);
  useEffect(()=>localStorage.setItem("tuna_users",JSON.stringify(users)),[users]);
  useEffect(()=>localStorage.setItem("tuna_demo_deposits",JSON.stringify(demoDeposits)),[demoDeposits]);

  const fmt=n=>new Intl.NumberFormat("vi-VN").format(n)+"đ";

  function buy(pack){
    if(balance < pack.price){ setNotice("❌ Số dư DEMO không đủ."); return; }
    setBalance(b=>b-pack.price);
    setHistory(h=>[{id:Date.now(),name:pack.name,price:pack.price,time:new Date().toLocaleString("vi-VN")},...h].slice(0,50));
    setNotice(`✅ Đã mua ${pack.name} — DEMO`);
  }

  function redeem(){
    const code=gift.trim().toUpperCase();
    if(!code){setNotice("⚠️ Nhập mã giftcode.");return;}
    if(code==="WELCOME50K"){
      setBalance(b=>b+50000); setGift(""); setNotice("🎁 Nhận 50.000đ DEMO thành công!");
    } else setNotice("❌ Giftcode không hợp lệ trong bản DEMO.");
  }

  function addDemo(){
    if(!demoDeposits){setNotice("⚠️ Nạp DEMO đang tắt.");return;}
    const amount=[50000,100000,200000,500000][Math.floor(Math.random()*4)];
    setUsers(u=>[...u.map(x=>({...x,amount:x.amount+Math.floor(Math.random()*80000)}))].sort((a,b)=>b.amount-a.amount).slice(0,50));
    setNotice(`🤖 Mô phỏng hoạt động nạp +${fmt(amount)} — không phải giao dịch thật.`);
  }

  function reset(){
    setBalance(1000000); setHistory([]); setUsers(seedUsers);
    setNotice("♻️ Đã reset dữ liệu DEMO.");
  }

  return <div className="app">
    <header>
      <div><b>TUNA DEMO SHOP</b><span> • React App</span></div>
      <small>Chỉ mô phỏng — không có giao dịch thật</small>
    </header>

    <main>
      <section className="card hero">
        <div><div className="label">SỐ DƯ DEMO</div><div className="balance">{fmt(balance)}</div></div>
        <button onClick={reset}>Reset DEMO</button>
      </section>

      {notice && <div className="notice" onClick={()=>setNotice("")}>{notice}</div>}

      <section className="card">
        <h2>🎁 Giftcode</h2>
        <div className="row"><input value={gift} onChange={e=>setGift(e.target.value)} placeholder="Nhập WELCOME50K"/><button onClick={redeem}>Nhận mã</button></div>
      </section>

      <section className="card">
        <div className="titleRow"><h2>👜 Túi mù</h2><span>DEMO</span></div>
        <div className="grid">
          {packs.map(p=><div className="product" key={p.id}>
            <div className="bag">🎁</div><b>{p.name}</b><strong>{fmt(p.price)}</strong>
            <button onClick={()=>buy(p)}>Mua DEMO</button>
          </div>)}
        </div>
      </section>

      <section className="card">
        <div className="titleRow"><h2>🤖 Nạp tiền ảo mô phỏng</h2><button className={demoDeposits?"on":"off"} onClick={()=>setDemoDeposits(v=>!v)}>{demoDeposits?"ĐANG BẬT":"ĐANG TẮT"}</button></div>
        <p className="muted">Các hoạt động ở đây chỉ là dữ liệu giả lập để test BXH.</p>
        <button className="wide" onClick={addDemo}>+ Tạo hoạt động nạp DEMO</button>
      </section>

      <section className="card">
        <h2>🛒 Lịch sử mua</h2>
        {history.length===0 ? <p className="muted">Chưa có giao dịch DEMO.</p> :
          <div className="history">{history.map(x=><div className="historyItem" key={x.id}><b>{x.name}</b><span>-{fmt(x.price)}</span><small>{x.time}</small></div>)}</div>}
      </section>

      <section className="card">
        <div className="titleRow"><h2>🏆 BXH Top 50</h2><span>DEMO</span></div>
        <div className="leaderboard">{users.map((u,i)=><div className="rank" key={u.name}><b>#{i+1}</b><span>{u.name}</span><strong>{fmt(u.amount)}</strong></div>)}</div>
      </section>
    </main>
    <footer>© TUNA DEMO SHOP • Dữ liệu chỉ dùng để mô phỏng giao diện</footer>
  </div>
}
createRoot(document.getElementById("root")).render(<App/>);
