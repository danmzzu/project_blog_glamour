import { apiUrl, dbConfig, table, siteName } from './config.js';

function setMetaTag(property, content, attrType = 'name') {
    let tag = document.querySelector(`meta[${attrType}="${property}"]`);
    if (tag) {
        tag.setAttribute('content', content);
    } else {
        tag = document.createElement('meta');
        tag.setAttribute(attrType, property);
        tag.setAttribute('content', content);
        document.head.appendChild(tag);
    }
}

function getKeywordFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('keyword');
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
        renderPosts(data, keyword);
    } catch (error) {
        console.error('Erro ao buscar posts:', error);
        renderPosts([], keyword);
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

function renderPosts(posts, keyword = null) {
    const container = document.getElementById('post-container');

    if (posts.length === 0) {
        container.innerHTML = '<p>Não foram encontrados posts.</p>';
        return;
    }

    container.innerHTML = posts.map(post => `
        <h1>${post.title}</h1>
        <p>${post.subtitle}</p>
        <p>${post.content}</p>
        <p>${post.views}</p>
        <p>${post.datetime}</p>
        <p>${post.readingtime}</p>
        <p>${post.active}</p>
        <p>${post.keywords}</p>
        <p>${post.author}</p>
    `).join('');

    if (keyword) {
        setMetaTag('keywords', keyword);
    }
}

function renderPost(post) {
    const container = document.getElementById('post-container');

    if (!post) {
        container.innerHTML = '<p>Post não encontrado.</p>';
        return;
    }

    document.title = siteName + ' - ' +  post.title;

    setMetaTag('description', post.subtitle);
    setMetaTag('keywords', post.keywords);
    setMetaTag('og:title', post.title, 'property');
    setMetaTag('og:description', post.subtitle, 'property');
    setMetaTag('og:type', 'article', 'property');
    setMetaTag('og:url', window.location.href, 'property');

    if (post.image) {
        setMetaTag('og:image', post.image, 'property');
    }

    container.innerHTML = `
        <h1>${post.title}</h1>
        <p>${post.subtitle}</p>
        <p>${post.content}</p>
        <p>${post.views}</p>
        <p>${post.datetime}</p>
        <p>${post.readingtime}</p>
        <p>${post.active}</p>
        <p>${post.keywords}</p>
        <p>${post.author}</p>
    `;
}

window.addEventListener('DOMContentLoaded', async () => {
    const keyword = getKeywordFromUrl();
    const post = getPostFromUrl();

    if (post) {
        await selectPost(post);
    } else if (keyword) {
        await selectKeyword(keyword);
    } else {
        await selectAll();
    }
});
