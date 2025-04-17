const apiUrl = 'projectnodemysql-production.up.railway.app';

const dbConfig = {
    host: 'mainline.proxy.rlwy.net',
    user: 'root',
    password: 'gkuDgVTCXFcbBHHpWucUJJZvIeDHzyIe',
    database: 'railway',
    port: 48753
};

const table = '...';

async function selectAll() {
    const res = await fetch(`${apiUrl}/select`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ db: dbConfig, table })
    });
  
    const data = await res.json();
    console.log('SELECT result:', data);
}

async function insertRow() {
    const columns = ['name', 'email'];
    const values = ['Alice', 'alice@email.com'];
  
    const res = await fetch(`${apiUrl}/insert`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ db: dbConfig, table, columns, values })
    });
  
    const data = await res.json();
    console.log('INSERT result:', data);
}

async function update() {
    const id = 1;
    const idColumn = 'id';
    const columns = ['name', 'email'];
    const values = ['Alice Silva', 'alice.silva@email.com'];
  
    const res = await fetch(`${apiUrl}/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ db: dbConfig, table, id, idColumn, columns, values })
    });
  
    const data = await res.json();
    console.log('UPDATE result:', data);
}

async function deleteRow() {
    const id = 1;
    const idColumn = 'id';
  
    const res = await fetch(`${apiUrl}/delete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ db: dbConfig, table, id, idColumn })
    });
  
    const data = await res.json();
    console.log('DELETE result:', data);
}  
  