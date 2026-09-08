// 简版 debug 脚本（直接用 fetch 不引 dotenv）
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function check() {
  const headers = { 'apikey': key, 'Authorization': 'Bearer ' + key };

  // 猫订单
  const r1 = await fetch(url + '/rest/v1/generated_portraits?order_id=eq.88a7870e-2288-46a7-860f-92ac5ec13f1d&select=style,image_url&limit=100', { headers });
  const data1 = await r1.json();
  console.log('Cat order 88a7870e rows:', data1.length);
  if (data1.length > 0) {
    console.log('  First 3 styles:', data1.slice(0, 3).map(r => r.style));
    console.log('  Last 3 styles:', data1.slice(-3).map(r => r.style));
  }

  // 狗订单
  const r2 = await fetch(url + '/rest/v1/generated_portraits?order_id=eq.22283302-8db0-473b-9998-2db3870497d4&select=style&limit=100', { headers });
  const data2 = await r2.json();
  console.log('\nDog order 22283302 rows:', data2.length);
  if (data2.length > 0) {
    console.log('  First 3 styles:', data2.slice(0, 3).map(r => r.style));
  }

  // orders 表
  const r3 = await fetch(url + '/rest/v1/orders?select=id,email,status,created_at&order=created_at.desc&limit=5', { headers });
  const data3 = await r3.json();
  console.log('\n=== Recent orders ===');
  data3.forEach(o => console.log(' ', o.id, o.email, o.status, o.created_at));
}

check().catch(e => { console.error('Error:', e.message); process.exit(1); });