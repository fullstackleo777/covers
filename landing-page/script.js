// script.js

// 1) Minimal CSV parser (handles quoted fields)
function parseCSV(text) {
    const lines = text.trim().split('\n');
    const headers = lines[0].split(',');
    return lines.slice(1).map((line) => {
      // Match either: "quoted, value" (with internal double‐quotes escaped as "") or unquoted values
      const values = line.match(/("([^"]|"")*"|[^,]+)(?=,|$)/g);
      const obj = {};
      headers.forEach((header, i) => {
        let val = values[i] || '';
        // If quoted, strip surrounding quotes and unescape "" → "
        if (val.startsWith('"') && val.endsWith('"')) {
          val = val.slice(1, -1).replace(/""/g, '"');
        }
        obj[header] = val;
      });
      return obj;
    });
  }
  
  // 2) Build a single <article> card for one repo object
  function createCard(repo) {
    // Create <article> container
    const card = document.createElement('article');
    card.className = 'card';
    card.tabIndex = 0; // make focusable
  
    // 2a) Cover image
    const img = document.createElement('img');
    img.className = 'card__image';
    img.src = repo.cover_image || '';
    img.alt = repo.name + ' Cover Image';
    card.appendChild(img);
  
    // 2b) Content container
    const content = document.createElement('div');
    content.className = 'card__content';
  
    // Title (linked)
    const title = document.createElement('h2');
    title.className = 'card__title';
    const link = document.createElement('a');
    link.href = repo.html_url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = repo.name;
    title.appendChild(link);
    content.appendChild(title);
  
    // Description
    const desc = document.createElement('p');
    desc.className = 'card__desc';
    desc.textContent = repo.description || 'No description';
    content.appendChild(desc);
  
    // Metadata (stars, language, forks, issues)
    const metaList = document.createElement('ul');
    metaList.className = 'card__meta';
    const fields = [
      { key: 'stargazers_count', label: '⭐ Stars' },
      { key: 'language', label: '📝 Language' },
      { key: 'forks_count', label: '🍴 Forks' },
      { key: 'open_issues_count', label: '🐞 Issues' },
    ];
    fields.forEach(({ key, label }) => {
      if (repo[key] !== undefined) {
        const li = document.createElement('li');
        li.textContent = `${label}: ${repo[key]}`;
        metaList.appendChild(li);
      }
    });
    content.appendChild(metaList);
  
    card.appendChild(content);
    return card;
  }
  
  // 3) Fetch CSV, parse it, then render all cards
  async function loadAndRenderCards() {
    try {
      const resp = await fetch('../fullstackleo777_repos.csv');
      if (!resp.ok) throw new Error('Failed to fetch CSV');
      const text = await resp.text();
      const data = parseCSV(text);
      const container = document.getElementById('cards-container');
  
      data.forEach((repo) => {
        const card = createCard(repo);
        container.appendChild(card);
      });
    } catch (err) {
      console.error(err);
      const container = document.getElementById('cards-container');
      container.innerHTML =
        '<p style="color:red; text-align:center;">Error loading CSV.</p>';
    }
  }
  
  // Kick things off once DOM is ready
  document.addEventListener('DOMContentLoaded', loadAndRenderCards);
  