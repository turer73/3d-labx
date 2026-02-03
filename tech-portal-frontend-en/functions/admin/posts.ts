interface Env {
  ADMIN_SECRET: string;
  ADMIN_PASSWORD: string;
}

function unauthorized() {
  return new Response("Unauthorized", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Admin Area"',
    },
  });
}

function escapeHtml(str: string): string {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
    .replace(/`/g, "&#096;");
}

type AdminPost = {
  id: number;
  title_tr: string;
  summary_tr: string;
  category: string;
  is_featured: number;
  published: number;
  status: string;
  created_at: string;
};

const categoryNames: Record<string, string> = {
  "3d-baski": "3D Baskı",
  "teknoloji": "Teknoloji",
  "yapay-zeka": "Yapay Zeka"
};

export async function onRequest(context: { request: Request; env: Env }) {
  const { request, env } = context;

  // Basic Auth kontrolü
  const auth = request.headers.get("Authorization");
  if (!auth) return unauthorized();

  const [type, encoded] = auth.split(" ");
  if (type !== "Basic" || !encoded) return unauthorized();

  try {
    const decoded = atob(encoded);
    const [, password] = decoded.split(":");

    if (password !== env.ADMIN_PASSWORD) {
      return unauthorized();
    }
  } catch {
    return unauthorized();
  }

  // API'den verileri al
  let posts: AdminPost[] = [];
  let apiError = false;

  try {
    const apiRes = await fetch(
      "https://tech-portal-api.turgut-d01.workers.dev/admin/posts",
      {
        headers: {
          "X-ADMIN-SECRET": env.ADMIN_SECRET,
        },
      }
    );

    if (!apiRes.ok) {
      throw new Error(`API error: ${apiRes.status}`);
    }

    posts = (await apiRes.json()) as AdminPost[];
  } catch (error) {
    apiError = true;
    console.error("Admin posts API error:", error);
  }

  const rows = posts
    .map((p) => {
      const safeTitle = escapeHtml(p.title_tr);
      const safeSummary = escapeHtml(p.summary_tr || "");
      const categoryDisplay = categoryNames[p.category] || p.category;
      const statusBadge = p.published
        ? '<span class="status published">Yayında</span>'
        : '<span class="status draft">Taslak</span>';

      return `
      <tr class="${p.is_featured ? "featured" : ""} ${!p.published ? "unpublished" : ""}">
        <td>
          <div class="title-cell">
            <strong>${safeTitle}</strong>
            ${statusBadge}
          </div>
        </td>
        <td>${categoryDisplay}</td>
        <td class="actions">
          <button class="btn publish"
            onclick="togglePublish(${p.id}, ${p.published ? 0 : 1})">
            ${p.published ? "📴 Yayından Kaldır" : "📢 Yayınla"}
          </button>

          <button class="btn feature"
            onclick="toggleFeature(${p.id}, ${p.is_featured ? 0 : 1})">
            ${p.is_featured ? "⭐ Kaldır" : "⭐ Öne Çıkar"}
          </button>

          <button class="btn edit"
            onclick="openEditModal(${p.id}, '${safeTitle.replace(/'/g, "\\'")}', '${safeSummary.replace(/'/g, "\\'")}')">
            ✏️ Düzenle
          </button>

          <button class="btn delete"
            onclick="deletePost(${p.id})">
            🗑️ Sil
          </button>
        </td>
      </tr>
    `;
    })
    .join("");

  return new Response(
    `
<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Admin – İçerik Yönetimi</title>
  <style>
    * {
      box-sizing: border-box;
    }

    body {
      font-family: system-ui, -apple-system, sans-serif;
      padding: 24px;
      background: #f7f7f7;
      margin: 0;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    h1 {
      margin: 0;
    }

    .stats {
      display: flex;
      gap: 16px;
      font-size: 0.9rem;
      color: #666;
    }

    .stats span {
      background: white;
      padding: 8px 16px;
      border-radius: 8px;
      border: 1px solid #eee;
    }

    ${apiError ? `
    .error-banner {
      background: #fef2f2;
      border: 1px solid #fecaca;
      color: #991b1b;
      padding: 16px;
      border-radius: 8px;
      margin-bottom: 24px;
    }
    ` : ""}

    table {
      border-collapse: collapse;
      width: 100%;
      background: #fff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }

    th, td {
      padding: 12px 16px;
      border-bottom: 1px solid #eee;
      text-align: left;
    }

    th {
      background: #f9fafb;
      font-weight: 600;
      color: #374151;
    }

    tr:hover {
      background: #f9fafb;
    }

    tr.featured {
      background: #fffbe6;
    }

    tr.featured:hover {
      background: #fff8cc;
    }

    tr.unpublished {
      opacity: 0.7;
    }

    .title-cell {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .status {
      font-size: 0.7rem;
      padding: 2px 8px;
      border-radius: 4px;
      font-weight: 500;
    }

    .status.published {
      background: #d1fae5;
      color: #065f46;
    }

    .status.draft {
      background: #fef3c7;
      color: #92400e;
    }

    .actions {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .btn {
      padding: 6px 12px;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.8rem;
      transition: opacity 0.2s;
      white-space: nowrap;
    }

    .btn:hover {
      opacity: 0.8;
    }

    .btn.publish { background: #d1fae5; color: #065f46; }
    .btn.feature { background: #fde68a; color: #92400e; }
    .btn.edit { background: #bfdbfe; color: #1e40af; }
    .btn.delete { background: #fecaca; color: #991b1b; }

    /* Modal */
    .modal {
      display: none;
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.5);
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .modal-content {
      background: white;
      padding: 24px;
      border-radius: 12px;
      width: 90%;
      max-width: 500px;
      box-shadow: 0 25px 50px rgba(0,0,0,0.25);
    }

    .modal-content h3 {
      margin-top: 0;
      margin-bottom: 16px;
    }

    .modal-content label {
      display: block;
      margin-bottom: 4px;
      font-weight: 500;
      color: #374151;
    }

    .modal-content input,
    .modal-content textarea {
      width: 100%;
      margin-bottom: 16px;
      padding: 10px 12px;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      font-size: 1rem;
    }

    .modal-content input:focus,
    .modal-content textarea:focus {
      outline: none;
      border-color: #2563eb;
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
    }

    .modal-buttons {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
    }

    .modal-buttons button {
      padding: 10px 20px;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.9rem;
    }

    .modal-buttons .save {
      background: #2563eb;
      color: white;
    }

    .modal-buttons .cancel {
      background: #f3f4f6;
      color: #374151;
    }

    .loading {
      pointer-events: none;
      opacity: 0.6;
    }

    .toast {
      position: fixed;
      bottom: 24px;
      right: 24px;
      padding: 12px 24px;
      border-radius: 8px;
      color: white;
      font-weight: 500;
      z-index: 1001;
      animation: slideIn 0.3s ease;
    }

    .toast.success { background: #10b981; }
    .toast.error { background: #ef4444; }

    @keyframes slideIn {
      from { transform: translateY(100px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }

    @media (max-width: 768px) {
      body {
        padding: 12px;
      }

      .header {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
      }

      .actions {
        flex-direction: column;
      }

      th:nth-child(2), td:nth-child(2) {
        display: none;
      }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>İçerik Yönetimi</h1>
    <div class="stats">
      <span>Toplam: ${posts.length}</span>
      <span>Yayında: ${posts.filter(p => p.published).length}</span>
      <span>Taslak: ${posts.filter(p => !p.published).length}</span>
    </div>
  </div>

  ${apiError ? `
  <div class="error-banner">
    API'ye bağlanırken bir hata oluştu. Lütfen daha sonra tekrar deneyin.
  </div>
  ` : ""}

  <table>
    <thead>
      <tr>
        <th>Başlık</th>
        <th>Kategori</th>
        <th>İşlemler</th>
      </tr>
    </thead>
    <tbody>
      ${rows || '<tr><td colspan="3" style="text-align: center; color: #666;">Henüz içerik yok</td></tr>'}
    </tbody>
  </table>

  <!-- Edit Modal -->
  <div id="modal" class="modal">
    <div class="modal-content">
      <h3>İçeriği Düzenle</h3>
      <label for="edit-title">Başlık</label>
      <input id="edit-title" type="text" placeholder="Başlık girin" />
      <label for="edit-summary">Özet</label>
      <textarea id="edit-summary" rows="4" placeholder="Kısa özet girin"></textarea>
      <div class="modal-buttons">
        <button class="cancel" onclick="closeModal()">İptal</button>
        <button class="save" onclick="saveEdit()">Kaydet</button>
      </div>
    </div>
  </div>

  <script>
    let editId = null;

    function showToast(message, type = 'success') {
      const toast = document.createElement('div');
      toast.className = 'toast ' + type;
      toast.textContent = message;
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 3000);
    }

    function openEditModal(id, title, summary) {
      editId = id;
      document.getElementById("edit-title").value = title;
      document.getElementById("edit-summary").value = summary;
      document.getElementById("modal").style.display = "flex";
    }

    function closeModal() {
      document.getElementById("modal").style.display = "none";
      editId = null;
    }

    // ESC ile modal kapat
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeModal();
    });

    // Modal dışına tıklayınca kapat
    document.getElementById("modal").addEventListener('click', (e) => {
      if (e.target.id === 'modal') closeModal();
    });

    async function saveEdit() {
      const btn = document.querySelector('.modal-buttons .save');
      btn.classList.add('loading');
      btn.textContent = 'Kaydediliyor...';

      try {
        const res = await fetch("/admin/update", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editId,
            title_tr: document.getElementById("edit-title").value,
            summary_tr: document.getElementById("edit-summary").value
          })
        });

        if (!res.ok) throw new Error('Kaydetme başarısız');

        showToast('Değişiklikler kaydedildi');
        setTimeout(() => location.reload(), 500);
      } catch (error) {
        showToast('Hata: ' + error.message, 'error');
        btn.classList.remove('loading');
        btn.textContent = 'Kaydet';
      }
    }

    async function togglePublish(id, published) {
      try {
        const res = await fetch("/admin/update", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, published: !!published })
        });

        if (!res.ok) throw new Error('İşlem başarısız');

        showToast(published ? 'İçerik yayınlandı' : 'İçerik yayından kaldırıldı');
        setTimeout(() => location.reload(), 500);
      } catch (error) {
        showToast('Hata: ' + error.message, 'error');
      }
    }

    async function toggleFeature(id, featured) {
      try {
        const res = await fetch("/admin/feature", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, featured })
        });

        if (!res.ok) throw new Error('İşlem başarısız');

        showToast(featured ? 'Öne çıkarıldı' : 'Öne çıkarma kaldırıldı');
        setTimeout(() => location.reload(), 500);
      } catch (error) {
        showToast('Hata: ' + error.message, 'error');
      }
    }

    async function deletePost(id) {
      if (!confirm("Bu yazı kalıcı olarak silinecek. Emin misiniz?")) return;

      try {
        const res = await fetch("/admin/delete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id })
        });

        if (!res.ok) throw new Error('Silme başarısız');

        showToast('İçerik silindi');
        setTimeout(() => location.reload(), 500);
      } catch (error) {
        showToast('Hata: ' + error.message, 'error');
      }
    }
  </script>
</body>
</html>
    `,
    {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
      },
    }
  );
}
