const SUPABASE_URL = 'https://tmqnjxjborvuegzojwmx.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRtcW5qeGpib3J2dWVnem9qd214Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE4MTE1NzUsImV4cCI6MjA5NzM4NzU3NX0.EcFSSOFGZKQ0HZL1Cz1IMYsh1UIkSiopVmMg7vZn_-g';

const RESTAURANT_NAMES = [
  'Sequoia','Abou El Sid','Zitouni','Pier 88','Taboula','Left Bank','Mori Sushi',
  'Sabai Sabai','Laguiole','The Smokery','Zooba','Felfela','Koshary El Tahrir',
  'El Fishawi','Cairo Jazz Club','Naguib Mahfouz Cafe','El Shabrawy','Kazouza',
  'Mastaba','Ovio','Bab El Sharq','Cook Door',"Mo'men",'Revolving Restaurant',
  'Tamarai','Hawawshi Sultan','El Omda','Karam Beirut','Mandarine Koueider',
  'Il Mulino','The Grill - Four Seasons Nile Plaza','Abou El Sid Sheikh Zayed',
  'Eataly Cairo','The Cellar Door','Beanos Cafe','Peking','Fish Market Alexandria',
  'Kadoura','Balbaa','Elite','Trianon','Pastroudis','Mohammed Ahmed','Santa Lucia',
  'Zephyrion','Farsha Cafe','Pomodoro Sharm','Hard Rock Cafe Sharm El Sheikh',
  'Rangoli','Fares Restaurant','Little Buddha Hurghada','Moby Dick','Moods El Gouna',
  "Kiki's El Gouna",'Blu Bar El Gouna','Sofra Restaurant Luxor','Sunset Restaurant Luxor',
  'Aswan Moon Restaurant','Nubian House Restaurant',"Abdu's Restaurant Siwa",
  'The Tap','Cilantro','Mandarine',"Lucille's",'Crimson','Cookroom','El Abd Bakery',
  'TBS - The Bakery Shop','Bun Mee','Pane Vino','Wok to Walk','Fuji','Buddha-Bar Cairo',
  'Spice It','Wabi Sabi','Kazbar','Koshary Abou Tarek','Sobhy Kaber','Gad','Abu El Ezz',
  'Sawa Sawa','El Dawar','Fuul We Taamiya El Omda','Osmanly','Baraka','Leila Zalabya',
  'Sham Bil Sham','Al Dente','Biella','Prime Steakhouse','Steak & Co','BRGR',
  'Jones The Grocer','Salad Boutique','Zeed','Greenhouse','Aqua','El Ghoureya','Crave',
  'The Lab','Sugar and Spice','Aice','Bocadillo','Pimento','RoofTop by The Nile',
  'Grillon Alexandria','China House Alexandria','White and Blue','Samakmak',
  'Alexandria Grill','Gad Alexandria',"Cap D'Or",'Pizza Palace Alexandria',
  'Spitfire Alexandria','Koshary El Amir','Jobo','La Scala',"Coco's El Gouna",
  'Abu Tig Marina Restaurant','Tamr Henna','Bliss','Kan Zaman El Gouna',
  'Pirates Bar El Gouna','El Gouna Sushi','Oum El Dounia','Lakeside Cafe',
  "Kempinski Nile Grill",'Sky Lounge Cairo',"Charwood's",
];

async function patch(name, type) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/brands?name=eq.${encodeURIComponent(name)}`, {
    method: 'PATCH',
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal',
    },
    body: JSON.stringify({ business_type: type }),
  });
  if (!res.ok) {
    const err = await res.text();
    console.error(`❌ ${name}: ${err}`);
  } else {
    console.log(`✅ ${name} → ${type}`);
  }
}

async function main() {
  // First set all to fashion
  console.log('Setting all to fashion...');
  const setAll = await fetch(`${SUPABASE_URL}/rest/v1/brands?id=neq.00000000-0000-0000-0000-000000000000`, {
    method: 'PATCH',
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal',
    },
    body: JSON.stringify({ business_type: 'fashion' }),
  });
  console.log('All set to fashion:', setAll.status);

  // Then update restaurants
  console.log('\nUpdating restaurants...');
  for (const name of RESTAURANT_NAMES) {
    await patch(name, 'restaurant');
    await new Promise(r => setTimeout(r, 50));
  }
  console.log('\nDone!');
}

main();
