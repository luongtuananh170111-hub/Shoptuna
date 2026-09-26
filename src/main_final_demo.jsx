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
  const [receivedAccounts,setReceivedAccounts] = useState(()=>load("tuna_received_accounts",[]));
  const [events,setEvents] = useState(()=>load("tuna_events",[]));
  const [eventName,setEventName] = useState("");
  const [eventDesc,setEventDesc] = useState("");
  const [eventReward,setEventReward] = useState("");
  const [accountName,setAccountName] = useState("Acc DEMO VIP");
  const [accountPrice,setAccountPrice] = useState(99000);

  useEffect(()=>localStorage.setItem("tuna_balance",JSON.stringify(balance)),[balance]);
  useEffect(()=>localStorage.setItem("tuna_history",JSON.stringify(history)),[history]);
  useEffect(()=>localStorage.setItem("tuna_users",JSON.stringify(users)),[users]);
  useEffect(()=>localStorage.setItem("tuna_demo_deposits",JSON.stringify(demoDeposits)),[demoDeposits]);
  useEffect(()=>localStorage.setItem("tuna_received_accounts",JSON.stringify(receivedAccounts)),[receivedAccounts]);
  useEffect(()=>localStorage.setItem("tuna_events",JSON.stringify(events)),[events]);
  useEffect(()=>localStorage.setItem("tuna_virtual_customers",JSON.stringify(virtualCustomers)),[virtualCustomers]);
  useEffect(()=>localStorage.setItem("tuna_auto_demo",JSON.stringify(autoDemo)),[autoDemo]);
  useEffect(()=>localStorage.setItem("tuna_auto_purchase_log",JSON.stringify(autoPurchaseLog)),[autoPurchaseLog]);

  useEffect(()=>{
    if(!autoDemo) return;
    const timer=setInterval(()=>{
      const customer=virtualCustomers[Math.floor(Math.random()*virtualCustomers.length)];
      const price=Math.floor(Math.random()*8+1)*10000;
      const packageNames=["Gói Random DEMO","Gói VIP DEMO","Gói Tân Binh DEMO","Gói Siêu Rẻ DEMO"];
      const pkg=packageNames[Math.floor(Math.random()*packageNames.length)];
      const item={id:Date.now(),customer:customer?.name||"Khách DEMO",pkg,price,time:new Date().toLocaleTimeString("vi-VN")};
      setAutoPurchaseLog(v=>[item,...v].slice(0,30));
      setHistory(h=>[{id:Date.now(),name:`${customer?.name||"Khách DEMO"} • ${pkg}`,price,time:new Date().toLocaleString("vi-VN"),type:"virtual",orderId:"DEMO-"+Date.now().toString().slice(-8)},...h].slice(0,50));
      setNotice(`🤖 ${item.customer} vừa mua ${item.pkg} • DEMO`);
    },5000);
    return ()=>clearInterval(timer);
  },[autoDemo,virtualCustomers]);

  const fmt=n=>new Intl.NumberFormat("vi-VN").format(n)+"đ";

  function buy(pack){
    if(balance < pack.price){ setNotice("❌ Số dư DEMO không đủ."); return; }
    setBalance(b=>b-pack.price);
    setHistory(h=>[{id:Date.now(),name:pack.name,price:pack.price,time:new Date().toLocaleString("vi-VN")},...h].slice(0,50));
    setNotice(`✅ Đã mua ${pack.name} — DEMO`);
  }

  function buyAccount(){
    const price=Number(accountPrice)||0;
    if(price<=0){setNotice("⚠️ Giá acc DEMO không hợp lệ.");return;}
    if(balance < price){setNotice("❌ Số dư DEMO không đủ.");return;}
    const orderId="ACC-"+Date.now().toString().slice(-8);
    const account={id:Date.now(),orderId,name:accountName||"Acc DEMO",username:"demo_"+Math.random().toString(36).slice(2,8),password:"DEMO-"+Math.random().toString(36).slice(2,10),price,time:new Date().toLocaleString("vi-VN")};
    setBalance(b=>b-price);
    setReceivedAccounts(a=>[account,...a].slice(0,50));
    setHistory(h=>[{id:Date.now(),name:account.name,price,time:new Date().toLocaleString("vi-VN"),type:"account",orderId},...h].slice(0,50));
    setNotice(`✅ Mua acc DEMO thành công • ${orderId}`);
  }

  function addVirtualCustomer(){
    const name=customerName.trim();
    if(!name){setNotice("⚠️ Nhập tên khách ảo.");return;}
    setVirtualCustomers(v=>[...v,{id:Date.now(),name}].slice(-30));
    setCustomerName("");
    setNotice("👤 Đã thêm khách ảo DEMO.");
  }

  function createEvent(){
    if(!eventName.trim()){setNotice("⚠️ Nhập tên sự kiện.");return;}
    const e={id:Date.now(),name:eventName.trim(),desc:eventDesc.trim(),reward:eventReward.trim(),time:new Date().toLocaleString("vi-VN")};
    setEvents(v=>[e,...v].slice(0,20));
    setEventName("");setEventDesc("");setEventReward("");
    setNotice("🛠️ Đã tạo sự kiện DEMO.");
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
        <div className="titleRow"><h2>🎫 Mua acc DEMO</h2><span>DEMO</span></div>
        <div className="row">
          <input value={accountName} onChange={e=>setAccountName(e.target.value)} placeholder="Tên acc"/>
          <input className="priceInput" type="number" value={accountPrice} onChange={e=>setAccountPrice(e.target.value)} placeholder="Giá"/>
        </div>
        <button className="wide" onClick={buyAccount}>Mua acc DEMO</button>
        <p className="muted">Sau khi mua, thông tin acc DEMO sẽ được lưu trong Lịch sử nhận acc.</p>
      </section>

      <section className="card">
        <div className="titleRow"><h2>🛠️ Admin • Tạo sự kiện</h2><span>DEMO</span></div>
        <input value={eventName} onChange={e=>setEventName(e.target.value)} placeholder="Tên sự kiện"/>
        <input value={eventDesc} onChange={e=>setEventDesc(e.target.value)} placeholder="Mô tả sự kiện"/>
        <input value={eventReward} onChange={e=>setEventReward(e.target.value)} placeholder="Phần thưởng"/>
        <button className="wide" onClick={createEvent}>+ Tạo sự kiện DEMO</button>
      </section>

      <section className="card">
        <div className="titleRow"><h2>🤖 Khách ảo & tự mua</h2><span>DEMO</span></div>
        <p className="muted">Mỗi khoảng 5 giây, hệ thống DEMO tự tạo 1 đơn mua ngẫu nhiên.</p>
        <div className="row">
          <input value={customerName} onChange={e=>setCustomerName(e.target.value)} placeholder="Tên khách ảo"/>
          <button onClick={addVirtualCustomer}>+ Thêm</button>
        </div>
        <button className="wide" onClick={()=>setAutoDemo(v=>!v)}>
          {autoDemo ? "⏸️ Tạm dừng tự mua DEMO" : "▶️ Bật tự mua DEMO"}
        </button>
        <div className="customerChips">{virtualCustomers.map(c=><span className="customerChip" key={c.id}>👤 {c.name}</span>)}</div>
        {autoPurchaseLog.length>0 && <div className="autoLog">
          {autoPurchaseLog.slice(0,8).map(x=><div key={x.id}><b>{x.customer}</b> vừa mua <b>{x.pkg}</b> • {x.price.toLocaleString("vi-VN")}đ <small>{x.time} • DEMO</small></div>)}
        </div>}
      </section>

      {events.length>0 && <section className="card">
        <div className="titleRow"><h2>🎉 Sự kiện</h2><span>DEMO</span></div>
        {events.map(e=><div className="eventItem" key={e.id}>
          <b>{e.name}</b><small>{e.time}</small>
          {e.desc && <span>{e.desc}</span>}
          {e.reward && <strong>🎁 {e.reward}</strong>}
        </div>)}
      </section>

      <section className="card">
        <h2>📬 Lịch sử nhận acc</h2>
        {receivedAccounts.length===0 ? <p className="muted">Chưa có acc DEMO đã nhận.</p> :
          <div className="history">{receivedAccounts.map(x=><div className="accountItem" key={x.id}>
            <div><b>{x.name}</b><small>Mã đơn: {x.orderId} • {x.time}</small></div>
            <div><span>Tài khoản: <b>{x.username}</b></span><span>Mật khẩu: <b>{x.password}</b></span></div>
          </div>)}</div>}
      </section>

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
