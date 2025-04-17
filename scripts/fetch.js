import { apiUrl, dbConfig, table } from './config.js';

function getKeywordFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const encodedKeyword = encodeURIComponent(urlParams.get('keyword'));
    return urlParams.get(encodedKeyword);
}

function getPostFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('post');
}

async function selectAll() {
    try {
        const res = await fetch(`${apiUrl}/select-where`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                db: dbConfig,
                table: table,
                where: `active = 1`
            })
        });

        const data = await res.json();
        renderPosts(data);
    } catch (error) {
        console.error('Erro ao buscar todos os posts:', error);
        renderPosts([]);
    }
}

async function selectKeyword(keyword) {
    try {
        const res = await fetch(`${apiUrl}/select-where`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                db: dbConfig,
                table: table,
                where: `keywords LIKE '%${keyword}%' AND active = 1`
            })
        });

        const data = await res.json();
        renderPosts(data);
    } catch (error) {
        console.error('Erro ao buscar posts:', error);
        renderPosts([]);
    }
}

async function selectPost(post) {
    try {
        const res = await fetch(`${apiUrl}/select-where`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                db: dbConfig,
                table: table,
                where: `id = ${parseInt(post)} AND active = 1`
            })
        });

        const data = await res.json();
        renderPost(data[0]);
    } catch (error) {
        renderPost(null);
    }
}

function renderPosts(posts) {
    const container = document.getElementById('post-container');

    if (posts.length === 0) {
        container.innerHTML = '<p>Não foram encontrados posts.</p>';
        return;
    }

    container.innerHTML = posts.map(post => `
        <h1>${post.title}</h1>
        <p>${post.content}</p>
        <p>${post.views}</p>
        <p>${post.subtitle}</p>
    `).join('');
}

function renderPost(post) {
    const container = document.getElementById('post-container');

    if (!post) {
        container.innerHTML = '<p>Post não encontrado.</p>';
        return;
    }

    container.innerHTML = `
        <h1>${post.title}</h1>
        <p>${post.content}</p>
        <p>${post.views}</p>
        <p>${post.subtitle}</p>
    `;
}

window.addEventListener('DOMContentLoaded', async () => {
    const keyword = getKeywordFromUrl();
    const post = getPostFromUrl();

    if (keyword) { await selectKeyword(keyword); } 
    else if (post) { await selectPost(post); }
    else { await selectAll(); }
});
