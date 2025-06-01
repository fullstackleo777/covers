(async () => {
  const username = "fullstackleo777";
  const perPage = 100;
  let page = 1;
  let allRepos = [];
  let token = null; // ← Optional: Paste your GitHub token here

  while (true) {
      const url = `https://api.github.com/users/${username}/repos?per_page=${perPage}&page=${page}`;
      const res = await fetch(url, {
          headers: token ? { Authorization: `token ${token}` } : {}
      });
      const data = await res.json();
      if (data.length === 0) break;
      allRepos = allRepos.concat(data);
      page++;
  }

  // Add "cover_image" as the last header column
  const csvRows = [
      [
          "name", "full_name", "html_url", "description",
          "created_at", "updated_at", "pushed_at",
          "stargazers_count", "watchers_count", "language",
          "forks_count", "open_issues_count", "default_branch", "private",
          "cover_image"
      ].join(",")
  ];

  for (const repo of allRepos) {
      const coverImageUrl = `https://raw.githubusercontent.com/fullstackleo777/covers/refs/heads/main/covers/${repo.name}/cover_${repo.name}.png`;

      const row = [
          repo.name,
          repo.full_name,
          repo.html_url,
          `"${(repo.description || "").replace(/"/g, '""')}"`,
          repo.created_at,
          repo.updated_at,
          repo.pushed_at,
          repo.stargazers_count,
          repo.watchers_count,
          repo.language,
          repo.forks_count,
          repo.open_issues_count,
          repo.default_branch,
          repo.private,
          coverImageUrl // new column value
      ]
      .map(v => (v === null ? "" : v))
      .join(",");

      csvRows.push(row);
  }

  const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${username}_repos.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  console.log("✅ CSV download started for user:", username);
})();
