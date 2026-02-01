-- Klipper Kurulum Rehberi İyileştirmesi
-- İyileştirmeler:
-- 1. Video zaman damgası linkleri (direkt dakikaya git)
-- 2. Dış kaynak linkleri (GitHub, resmi dökümantasyon)
-- 3. Doğru Input Shaping rehberi linki
-- 4. Ek görsel açıklamaları ve ipuçları

UPDATE posts SET content_tr = '<article class="article-page section">
  <div class="container container-sm">

    <header class="section-header text-center">
      <div class="mb-3">
        <span class="badge badge-primary" style="font-size: 0.8rem; padding: 5px 12px;">Rehberler</span>
        <span class="badge badge-danger" style="font-size: 0.8rem; padding: 5px 12px; background-color: #dc2626; color: white;">Kurulum</span>
      </div>

      <h1 class="title mb-3" style="font-size: clamp(1.2rem, 3vw, 2rem); line-height: 1.3;">
        Sıfırdan Zirveye: Klipper Kurulum Rehberi (KIAUH Yöntemi)
      </h1>

      <p class="text-muted text-lg" style="font-size: 1rem; max-width: 600px; margin: 0 auto;">
        Bu rehber, bir Raspberry Pi ve 3D yazıcı kullanarak, KIAUH otomasyon aracı yardımıyla en acısız Klipper kurulumunu anlatmaktadır.
      </p>

      <div class="flex items-center justify-center gap-3 mt-4">
        <div class="avatar" style="width: 32px; height: 32px; font-size: 0.8rem; background: var(--accent); color: white; display:flex; align-items:center; justify-content:center; border-radius:50%;">L</div>
        <div class="text-sm text-muted">
          <strong>LabX Editör</strong> • 31 Ocak 2026 • 12 dk okuma
        </div>
      </div>
    </header>

    <div class="content">

      <!-- Ön Hazırlık Kutusu - Linklerle -->
      <div class="message message-info mt-4 mb-4" style="background: #eff6ff; border: 1px solid #bfdbfe; color: #1e40af; padding: 15px; border-radius: 8px;">
        <strong>🛠️ Ön Hazırlık:</strong> Bilgisayarınıza <a href="https://www.raspberrypi.com/software/" target="_blank" rel="noopener" style="color: #2563eb; text-decoration: underline;"><em>"Raspberry Pi Imager"</em></a> ve dosya transferi için <a href="https://winscp.net/eng/download.php" target="_blank" rel="noopener" style="color: #2563eb; text-decoration: underline;"><em>"WinSCP"</em></a> (veya <a href="https://cyberduck.io/" target="_blank" rel="noopener" style="color: #2563eb; text-decoration: underline;">Cyberduck</a>) programlarını kurmuş olmanız önerilir.
      </div>

      <!-- Resmi Kaynaklar Kutusu -->
      <div style="background: linear-gradient(135deg, #f0fdf4, #dcfce7); border: 1px solid #86efac; padding: 16px 20px; border-radius: 12px; margin-bottom: 24px;">
        <strong style="color: #166534;">📚 Resmi Kaynaklar:</strong>
        <div style="display: flex; flex-wrap: wrap; gap: 12px; margin-top: 10px;">
          <a href="https://www.klipper3d.org/Installation.html" target="_blank" rel="noopener" style="display: inline-flex; align-items: center; gap: 6px; background: white; padding: 8px 14px; border-radius: 8px; color: #15803d; text-decoration: none; font-size: 0.85rem; border: 1px solid #bbf7d0;">
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm7.5-6.923c-.67.204-1.335.82-1.887 1.855A7.97 7.97 0 0 0 5.145 4H7.5V1.077zM4.09 4a9.267 9.267 0 0 1 .64-1.539 6.7 6.7 0 0 1 .597-.933A7.025 7.025 0 0 0 2.255 4H4.09zm-.582 3.5c.03-.877.138-1.718.312-2.5H1.674a6.958 6.958 0 0 0-.656 2.5h2.49zM4.847 5a12.5 12.5 0 0 0-.338 2.5H7.5V5H4.847zM8.5 5v2.5h2.99a12.495 12.495 0 0 0-.337-2.5H8.5zM4.51 8.5a12.5 12.5 0 0 0 .337 2.5H7.5V8.5H4.51zm3.99 0V11h2.653c.187-.765.306-1.608.338-2.5H8.5zM5.145 12c.138.386.295.744.468 1.068.552 1.035 1.218 1.65 1.887 1.855V12H5.145zm.182 2.472a6.696 6.696 0 0 1-.597-.933A9.268 9.268 0 0 1 4.09 12H2.255a7.024 7.024 0 0 0 3.072 2.472zM3.82 11a13.652 13.652 0 0 1-.312-2.5h-2.49c.062.89.291 1.733.656 2.5H3.82zm6.853 3.472A7.024 7.024 0 0 0 13.745 12H11.91a9.27 9.27 0 0 1-.64 1.539 6.688 6.688 0 0 1-.597.933zM8.5 12v2.923c.67-.204 1.335-.82 1.887-1.855.173-.324.33-.682.468-1.068H8.5zm3.68-1h2.146c.365-.767.594-1.61.656-2.5h-2.49a13.65 13.65 0 0 1-.312 2.5zm2.802-3.5a6.959 6.959 0 0 0-.656-2.5H12.18c.174.782.282 1.623.312 2.5h2.49zM11.27 2.461c.247.464.462.98.64 1.539h1.835a7.024 7.024 0 0 0-3.072-2.472c.218.284.418.598.597.933zM10.855 4a7.966 7.966 0 0 0-.468-1.068C9.835 1.897 9.17 1.282 8.5 1.077V4h2.355z"/></svg>
            Klipper Docs
          </a>
          <a href="https://github.com/dw-0/kiauh" target="_blank" rel="noopener" style="display: inline-flex; align-items: center; gap: 6px; background: white; padding: 8px 14px; border-radius: 8px; color: #15803d; text-decoration: none; font-size: 0.85rem; border: 1px solid #bbf7d0;">
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/></svg>
            KIAUH GitHub
          </a>
          <a href="https://docs.mainsail.xyz/" target="_blank" rel="noopener" style="display: inline-flex; align-items: center; gap: 6px; background: white; padding: 8px 14px; border-radius: 8px; color: #15803d; text-decoration: none; font-size: 0.85rem; border: 1px solid #bbf7d0;">
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M14 4.5V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5L14 4.5zm-3 0A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5h-2z"/></svg>
            Mainsail Docs
          </a>
        </div>
      </div>

      <hr style="margin: 30px 0; border: 0; border-top: 1px solid var(--border-soft);" />

      <h2 style="font-size: 1.6rem;">Adım 1: Raspberry Pi Hazırlığı</h2>
      <p>İlk işimiz Raspberry Pi''yi işletim sistemiyle tanıştırmak. SD kartınızı bilgisayara takın ve Imager programını açın.</p>

      <div class="bento-card" style="background: var(--bg-card); padding: 20px; border-radius: 12px; border: 1px solid var(--border-soft);">
        <ol style="padding-left: 20px; margin: 0;">
          <li style="margin-bottom: 10px;"><strong>OS Seçimi:</strong> "Raspberry Pi OS (other)" -> <strong>"Raspberry Pi OS Lite (64-bit)"</strong> seçin. (Masaüstü arayüzüne ihtiyacımız yok, Lite sürüm daha hızlıdır).</li>
          <li style="margin-bottom: 10px;"><strong>Ayarlar (Çark Simgesi):</strong> Burası çok önemli! Tıklayın ve şunları yapın:
            <ul style="margin-top: 5px; font-size: 0.9rem; color: var(--text-muted);">
               <li>Hostname: <code>klipper</code></li>
               <li><strong>Enable SSH:</strong> Açık yapın. Kullanıcı adı: <code>pi</code>, Şifre: (Unutmayacağınız bir şey).</li>
               <li><strong>Wi-Fi:</strong> Ağ adınızı ve şifrenizi girin.</li>
            </ul>
          </li>
          <li>"YAZ" (Write) diyerek işlemi bitirin ve kartı Pi''ye takın.</li>
        </ol>
      </div>

      <!-- Raspberry Pi Imager - Interaktif Tab -->
<div style="background: var(--bg-card); border-radius: 16px; border: 1px solid var(--border-soft); overflow: hidden; margin: 20px 0;">
  <div style="display: flex; background: linear-gradient(135deg, #1e293b, #334155); border-bottom: 2px solid #3b82f6;">
    <button onclick="document.querySelectorAll(''[data-imp]'').forEach(p=>p.style.display=''none'');document.querySelector(''[data-imp=&quot;1&quot;]'').style.display=''flex'';this.parentNode.querySelectorAll(''button'').forEach(b=>{b.style.background=''transparent'';b.style.color=''#94a3b8''});this.style.background=''#3b82f6'';this.style.color=''white''" style="flex:1;padding:14px 10px;background:#3b82f6;color:white;border:none;cursor:pointer;font-weight:600;font-size:0.85rem;">1. OS Secimi</button>
    <button onclick="document.querySelectorAll(''[data-imp]'').forEach(p=>p.style.display=''none'');document.querySelector(''[data-imp=&quot;2&quot;]'').style.display=''flex'';this.parentNode.querySelectorAll(''button'').forEach(b=>{b.style.background=''transparent'';b.style.color=''#94a3b8''});this.style.background=''#3b82f6'';this.style.color=''white''" style="flex:1;padding:14px 10px;background:transparent;color:#94a3b8;border:none;cursor:pointer;font-weight:600;font-size:0.85rem;">2. Ayarlar</button>
    <button onclick="document.querySelectorAll(''[data-imp]'').forEach(p=>p.style.display=''none'');document.querySelector(''[data-imp=&quot;3&quot;]'').style.display=''flex'';this.parentNode.querySelectorAll(''button'').forEach(b=>{b.style.background=''transparent'';b.style.color=''#94a3b8''});this.style.background=''#3b82f6'';this.style.color=''white''" style="flex:1;padding:14px 10px;background:transparent;color:#94a3b8;border:none;cursor:pointer;font-weight:600;font-size:0.85rem;">3. SSH</button>
    <button onclick="document.querySelectorAll(''[data-imp]'').forEach(p=>p.style.display=''none'');document.querySelector(''[data-imp=&quot;4&quot;]'').style.display=''flex'';this.parentNode.querySelectorAll(''button'').forEach(b=>{b.style.background=''transparent'';b.style.color=''#94a3b8''});this.style.background=''#3b82f6'';this.style.color=''white''" style="flex:1;padding:14px 10px;background:transparent;color:#94a3b8;border:none;cursor:pointer;font-weight:600;font-size:0.85rem;">4. Wi-Fi</button>
  </div>
  <div data-imp="1" style="display:flex;flex-wrap:wrap;">
    <div style="flex:1;min-width:280px;padding:24px;background:#f8fafc;">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;">
        <div style="width:48px;height:48px;background:linear-gradient(135deg,#c41949,#9d1c3e);border-radius:12px;display:flex;align-items:center;justify-content:center;color:white;font-size:1.5rem;">&#127827;</div>
        <div><h4 style="margin:0;font-size:1.1rem;color:#1e293b;">Isletim Sistemi Secimi</h4><p style="margin:0;font-size:0.8rem;color:#64748b;">Raspberry Pi OS Lite 64-bit</p></div>
      </div>
      <div style="background:white;border-radius:10px;padding:16px;border:1px solid #e2e8f0;">
        <p style="margin:0 0 12px 0;color:#334155;font-size:0.9rem;"><strong>Neden Lite?</strong></p>
        <ul style="margin:0;padding-left:20px;color:#475569;font-size:0.85rem;line-height:1.7;"><li>Masaustu yok = Daha hizli</li><li>Az RAM kullanimi</li><li>Klipper icin ideal</li></ul>
      </div>
    </div>
    <div style="flex:1;min-width:280px;background:#1e293b;display:flex;align-items:center;justify-content:center;padding:24px;">
      <div style="text-align:center;"><div style="color:#94a3b8;font-size:0.85rem;">Raspberry Pi OS (other)</div><div style="margin:8px 0;color:white;font-size:1.5rem;">&#8595;</div><div style="background:#22c55e;color:white;padding:10px 20px;border-radius:8px;font-weight:600;">Raspberry Pi OS Lite (64-bit)</div></div>
    </div>
  </div>
  <div data-imp="2" style="display:none;flex-wrap:wrap;">
    <div style="flex:1;min-width:280px;padding:24px;background:#f8fafc;">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;">
        <div style="width:48px;height:48px;background:linear-gradient(135deg,#3b82f6,#1d4ed8);border-radius:12px;display:flex;align-items:center;justify-content:center;color:white;font-size:1.5rem;">&#9881;</div>
        <div><h4 style="margin:0;font-size:1.1rem;color:#1e293b;">Ayarlar Menusu</h4><p style="margin:0;font-size:0.8rem;color:#64748b;">Cark simgesine tiklayin</p></div>
      </div>
      <div style="background:white;border-radius:10px;padding:16px;border:1px solid #e2e8f0;">
        <p style="margin:0 0 12px 0;color:#334155;font-size:0.9rem;"><strong>Hostname:</strong></p>
        <div style="background:#1e293b;padding:10px 14px;border-radius:6px;font-family:monospace;color:#22c55e;">klipper</div>
        <p style="margin:12px 0 0 0;color:#64748b;font-size:0.8rem;">Bu sayede "klipper.local" adresiyle baglanirsiniz.</p>
      </div>
    </div>
    <div style="flex:1;min-width:280px;background:#1e293b;display:flex;align-items:center;justify-content:center;padding:24px;">
      <div style="background:#334155;border-radius:12px;padding:20px;width:100%;max-width:280px;"><div style="color:white;font-weight:600;margin-bottom:12px;">&#9881; OS Customisation</div><div style="background:#1e293b;border-radius:8px;padding:12px;"><span style="color:#94a3b8;font-size:0.8rem;">Set hostname:</span><div style="color:#22c55e;font-family:monospace;margin-top:4px;">klipper</div></div></div>
    </div>
  </div>
  <div data-imp="3" style="display:none;flex-wrap:wrap;">
    <div style="flex:1;min-width:280px;padding:24px;background:#f8fafc;">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;">
        <div style="width:48px;height:48px;background:linear-gradient(135deg,#f97316,#ea580c);border-radius:12px;display:flex;align-items:center;justify-content:center;color:white;font-size:1.5rem;">&#128274;</div>
        <div><h4 style="margin:0;font-size:1.1rem;color:#1e293b;">SSH ve Kullanici</h4><p style="margin:0;font-size:0.8rem;color:#64748b;">Uzaktan erisim icin</p></div>
      </div>
      <div style="background:white;border-radius:10px;padding:16px;border:1px solid #e2e8f0;">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px;"><div style="width:20px;height:20px;background:#22c55e;border-radius:4px;color:white;display:flex;align-items:center;justify-content:center;font-size:12px;">&#10003;</div><span style="color:#334155;font-weight:500;">Enable SSH: ACIK</span></div>
        <div style="background:#fef3c7;border:1px solid #fcd34d;border-radius:8px;padding:12px;"><p style="margin:0 0 8px 0;color:#92400e;font-size:0.85rem;"><strong>Kullanici:</strong></p><div style="font-family:monospace;color:#78350f;font-size:0.85rem;">Kullanici: <strong>pi</strong><br/>Sifre: <strong>(Unutmayin!)</strong></div></div>
      </div>
    </div>
    <div style="flex:1;min-width:280px;background:#1e293b;display:flex;align-items:center;justify-content:center;padding:24px;">
      <div style="background:#334155;border-radius:12px;padding:20px;width:100%;max-width:280px;"><div style="display:flex;align-items:center;gap:8px;margin-bottom:16px;"><div style="width:24px;height:24px;background:#22c55e;border-radius:4px;"></div><span style="color:white;">Enable SSH</span></div><div style="margin-bottom:12px;"><span style="color:#94a3b8;font-size:0.8rem;">Username:</span><div style="background:#1e293b;padding:8px 12px;border-radius:6px;margin-top:4px;color:#f97316;font-family:monospace;">pi</div></div></div>
    </div>
  </div>
  <div data-imp="4" style="display:none;flex-wrap:wrap;">
    <div style="flex:1;min-width:280px;padding:24px;background:#f8fafc;">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;">
        <div style="width:48px;height:48px;background:linear-gradient(135deg,#8b5cf6,#7c3aed);border-radius:12px;display:flex;align-items:center;justify-content:center;color:white;font-size:1.5rem;">&#128246;</div>
        <div><h4 style="margin:0;font-size:1.1rem;color:#1e293b;">Wi-Fi ve Yazma</h4><p style="margin:0;font-size:0.8rem;color:#64748b;">Son adim!</p></div>
      </div>
      <div style="background:white;border-radius:10px;padding:16px;border:1px solid #e2e8f0;margin-bottom:12px;"><p style="margin:0 0 8px 0;color:#334155;font-size:0.9rem;"><strong>Wi-Fi Bilgileri:</strong></p><ul style="margin:0;padding-left:20px;color:#475569;font-size:0.85rem;"><li>SSID: Ag adiniz</li><li>Password: Sifreniz</li></ul></div>
      <div style="background:#dcfce7;border:1px solid #86efac;border-radius:8px;padding:12px;text-align:center;"><strong style="color:#166534;">&#10003; "YAZ" butonuna basin!</strong></div>
    </div>
    <div style="flex:1;min-width:280px;background:#1e293b;display:flex;align-items:center;justify-content:center;padding:24px;">
      <div style="text-align:center;"><div style="font-size:3rem;margin-bottom:16px;">&#128246;</div><div style="color:white;font-weight:600;margin-bottom:16px;">Wi-Fi Ayarlayin</div><div style="background:#c41949;color:white;padding:14px 32px;border-radius:8px;font-weight:700;font-size:1rem;">YAZ (WRITE)</div></div>
    </div>
  </div>
</div>

      <hr style="margin: 30px 0; border: 0; border-top: 1px solid var(--border-soft);" />

      <h2 style="font-size: 1.6rem;">Adım 2: Terminal Bağlantısı ve KIAUH</h2>
      <p>Bilgisayarınızdan Komut İstemi''ni (CMD) veya PowerShell''i açın. Artık hacker moduna geçiyoruz!</p>

      <h3 style="font-size: 1.3rem;">1. SSH ile Bağlanın</h3>
      <p>Şifre sorduğunda yazdığınız karakterler ekranda görünmez, yazıp Enter''a basın.</p>
      <div style="background: #1e293b; color: #e2e8f0; padding: 15px; border-radius: 8px; font-family: monospace; margin-bottom: 15px; border: 1px solid #334155;">
        ssh pi@klipper.local
      </div>

      <!-- Sorun Giderme İpucu -->
      <div style="background: #fefce8; border: 1px solid #fde047; border-left: 4px solid #eab308; padding: 14px 16px; border-radius: 0 8px 8px 0; margin-bottom: 20px;">
        <strong style="color: #a16207;">💡 Bağlanamıyor musunuz?</strong>
        <ul style="margin: 8px 0 0 0; padding-left: 20px; color: #854d0e; font-size: 0.9rem;">
          <li><code>klipper.local</code> çalışmıyorsa, Pi''nin IP adresini router''ınızdan bulun</li>
          <li>Windows''ta "Host key verification failed" hatası alırsanız: <code>ssh-keygen -R klipper.local</code></li>
          <li>Pi''nin Wi-Fi''ye bağlandığından emin olun (LED yanıp sönmeli)</li>
        </ul>
      </div>

      <h3 style="font-size: 1.3rem;">2. Sistemi Güncelleyin ve Git''i Kurun</h3>
      <div style="background: #1e293b; color: #e2e8f0; padding: 15px; border-radius: 8px; font-family: monospace; margin-bottom: 15px; border: 1px solid #334155;">
        sudo apt-get update && sudo apt-get install git -y
      </div>

      <h3 style="font-size: 1.3rem;">3. KIAUH Aracını İndirin ve Çalıştırın</h3>
      <p>KIAUH (Klipper Installation And Update Helper), tüm kurulumu menülerle yapmamızı sağlayan harika bir scripttir. <a href="https://github.com/dw-0/kiauh" target="_blank" rel="noopener" style="color: var(--accent);">GitHub sayfasına buradan ulaşabilirsiniz.</a></p>
      <div style="background: #1e293b; color: #e2e8f0; padding: 15px; border-radius: 8px; font-family: monospace; margin-bottom: 15px; border: 1px solid #334155;">
        cd ~ && git clone https://github.com/dw-0/kiauh.git<br>
        ./kiauh/kiauh.sh
      </div>

      <hr style="margin: 30px 0; border: 0; border-top: 1px solid var(--border-soft);" />

      <!-- Video Bölümü - Zaman Damgalı -->
      <div class="bento-card mt-4 mb-4" style="border: 2px dashed #3b82f6; background: #eff6ff; padding: 20px; border-radius: 12px; text-align: center;">
         <p style="color: #1d4ed8; font-weight: bold; margin-bottom: 5px;">📺 ADIM ADIM VİDEO ANLATIM</p>
         <p style="color: #1e40af; font-size: 0.9rem; margin-bottom: 15px;">Bu aşamadan sonraki menü işlemlerini aşağıdaki videodan takip edebilirsiniz.</p>

         <!-- Zaman Damgası Butonları -->
         <div style="display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; margin-bottom: 16px;">
           <a href="https://www.youtube.com/watch?v=nI8o6yQRxpY&t=270s" target="_blank" rel="noopener" style="display: inline-flex; align-items: center; gap: 6px; background: #1e40af; color: white; padding: 8px 14px; border-radius: 6px; text-decoration: none; font-size: 0.8rem;">
             <svg width="14" height="14" fill="currentColor" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/><path d="M6.271 5.055a.5.5 0 0 1 .52.038l3.5 2.5a.5.5 0 0 1 0 .814l-3.5 2.5A.5.5 0 0 1 6 10.5v-5a.5.5 0 0 1 .271-.445z"/></svg>
             4:30 - KIAUH Menüsü
           </a>
           <a href="https://www.youtube.com/watch?v=nI8o6yQRxpY&t=420s" target="_blank" rel="noopener" style="display: inline-flex; align-items: center; gap: 6px; background: #3b82f6; color: white; padding: 8px 14px; border-radius: 6px; text-decoration: none; font-size: 0.8rem;">
             <svg width="14" height="14" fill="currentColor" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/><path d="M6.271 5.055a.5.5 0 0 1 .52.038l3.5 2.5a.5.5 0 0 1 0 .814l-3.5 2.5A.5.5 0 0 1 6 10.5v-5a.5.5 0 0 1 .271-.445z"/></svg>
             7:00 - Firmware Derleme
           </a>
           <a href="https://www.youtube.com/watch?v=nI8o6yQRxpY&t=600s" target="_blank" rel="noopener" style="display: inline-flex; align-items: center; gap: 6px; background: #6366f1; color: white; padding: 8px 14px; border-radius: 6px; text-decoration: none; font-size: 0.8rem;">
             <svg width="14" height="14" fill="currentColor" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/><path d="M6.271 5.055a.5.5 0 0 1 .52.038l3.5 2.5a.5.5 0 0 1 0 .814l-3.5 2.5A.5.5 0 0 1 6 10.5v-5a.5.5 0 0 1 .271-.445z"/></svg>
             10:00 - Flash İşlemi
           </a>
         </div>

         <div class="video-container" style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; border-radius: 8px; background: #000;">
            <iframe style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" src="https://www.youtube.com/embed/nI8o6yQRxpY?start=270" title="Klipper Installation Guide" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
         </div>
         <p style="color: #64748b; font-size: 0.8rem; margin-top: 10px;">Video: Rolohaun 3D - How to Install Klipper</p>
      </div>

      <h2 style="font-size: 1.6rem;">Adım 3: Yazılımların Yüklenmesi</h2>
      <p>Karşınıza mavi bir menü gelecek. Burada sırasıyla şu numaraları tuşlayın:</p>

      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px;margin:15px 0;">
   <div style="padding:20px;background:linear-gradient(135deg,#ecfdf5,#d1fae5);border:2px solid #10b981;border-radius:12px;">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">
        <div style="width:36px;height:36px;background:#10b981;border-radius:8px;display:flex;align-items:center;justify-content:center;color:white;font-weight:bold;">1</div>
        <strong style="color:#065f46;">Install Menusu</strong>
      </div>
      <p style="margin:0;color:#047857;font-size:0.85rem;">Ana menude <code style="background:#065f46;color:white;padding:2px 6px;border-radius:4px;">[1]</code> tusuna basin</p>
   </div>
   <div style="padding:20px;background:linear-gradient(135deg,#fef3c7,#fde68a);border:2px solid #f59e0b;border-radius:12px;">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">
        <div style="width:36px;height:36px;background:#f59e0b;border-radius:8px;display:flex;align-items:center;justify-content:center;color:white;font-weight:bold;">2</div>
        <strong style="color:#92400e;">Klipper Kur</strong>
      </div>
      <p style="margin:0;color:#b45309;font-size:0.85rem;"><code style="background:#92400e;color:white;padding:2px 6px;border-radius:4px;">[1]</code> Klipper sec, Python 3.x onayla</p>
   </div>
   <div style="padding:20px;background:linear-gradient(135deg,#ede9fe,#ddd6fe);border:2px solid #8b5cf6;border-radius:12px;">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">
        <div style="width:36px;height:36px;background:#8b5cf6;border-radius:8px;display:flex;align-items:center;justify-content:center;color:white;font-weight:bold;">3</div>
        <strong style="color:#5b21b6;">Moonraker Kur</strong>
      </div>
      <p style="margin:0;color:#6d28d9;font-size:0.85rem;"><code style="background:#5b21b6;color:white;padding:2px 6px;border-radius:4px;">[2]</code> API sunucusu kurulumu</p>
   </div>
   <div style="padding:20px;background:linear-gradient(135deg,#dbeafe,#bfdbfe);border:2px solid #3b82f6;border-radius:12px;">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">
        <div style="width:36px;height:36px;background:#3b82f6;border-radius:8px;display:flex;align-items:center;justify-content:center;color:white;font-weight:bold;">4</div>
        <strong style="color:#1e40af;">Mainsail Kur</strong>
      </div>
      <p style="margin:0;color:#1d4ed8;font-size:0.85rem;"><code style="background:#1e40af;color:white;padding:2px 6px;border-radius:4px;">[3]</code> Web arayuzu kurulumu</p>
   </div>
</div>
      <p>Kurulumlar bitince <code>B</code> ile geri dönün ve <code>Q</code> ile çıkın.</p>

      <hr style="margin: 30px 0; border: 0; border-top: 1px solid var(--border-soft);" />

      <h2 style="font-size: 1.6rem;">Adım 4: Firmware Oluşturma</h2>
      <p>Şimdi yazıcınızın anakartına özel ".bin" dosyasını oluşturacağız. (Örnek: Ender 3 v2 / STM32F103 için).</p>

      <div style="background: #1e293b; color: #e2e8f0; padding: 15px; border-radius: 8px; font-family: monospace; margin-bottom: 15px; border: 1px solid #334155;">
        cd ~/klipper<br>
        make menuconfig
      </div>

      <figure class="bento-card mt-3 mb-4" style="padding:0; overflow:hidden; border-radius: 12px; border: 1px solid var(--border-soft);">
         <img src="https://res.cloudinary.com/dtwco1l6i/image/upload/v1653611735/JamesLiangCA/2022/05/kiauh11_tviait.png" alt="Klipper Menuconfig Ekranı" style="width:100%; height: auto; object-fit: cover;">
         <figcaption style="padding: 12px; background: var(--bg-hover); font-size: 0.85rem; color: var(--text-muted);">
           <strong>Klipper Firmware Configuration:</strong> Anakartınıza göre "Micro-controller Architecture" ve "Processor model" seçeneklerini ayarlayın.
         </figcaption>
      </figure>

      <!-- Popüler Anakart Ayarları -->
      <div style="background: linear-gradient(135deg, #faf5ff, #f3e8ff); border: 1px solid #d8b4fe; padding: 16px 20px; border-radius: 12px; margin-bottom: 20px;">
        <strong style="color: #7c3aed;">🔧 Popüler Anakart Ayarları:</strong>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px; margin-top: 12px;">
          <div style="background: white; padding: 12px; border-radius: 8px; border: 1px solid #e9d5ff;">
            <strong style="color: #6b21a8; font-size: 0.9rem;">Creality v4.2.x</strong>
            <ul style="margin: 6px 0 0 0; padding-left: 16px; font-size: 0.8rem; color: #7e22ce;">
              <li>STM32F103</li>
              <li>28KiB bootloader</li>
              <li>Serial (PA10/PA9)</li>
            </ul>
          </div>
          <div style="background: white; padding: 12px; border-radius: 8px; border: 1px solid #e9d5ff;">
            <strong style="color: #6b21a8; font-size: 0.9rem;">BTT SKR Mini E3</strong>
            <ul style="margin: 6px 0 0 0; padding-left: 16px; font-size: 0.8rem; color: #7e22ce;">
              <li>STM32G0B1</li>
              <li>8KiB bootloader</li>
              <li>USB (PA11/PA12)</li>
            </ul>
          </div>
        </div>
        <p style="margin: 12px 0 0 0; font-size: 0.85rem; color: #7c3aed;">
          <a href="https://www.klipper3d.org/Config_Reference.html" target="_blank" rel="noopener" style="color: #7c3aed;">Klipper Config Reference</a> sayfasından tüm anakart ayarlarına ulaşabilirsiniz.
        </p>
      </div>

      <p>Ayarları yaptıktan sonra (Anakartınızın işlemcisine göre değişir), <code>Q</code> ile çıkıp <code>Y</code> ile kaydedin. Son olarak derleyin:</p>

      <div style="background: #1e293b; color: #e2e8f0; padding: 15px; border-radius: 8px; font-family: monospace; margin-bottom: 15px; border: 1px solid #334155;">
        make
      </div>

      <hr style="margin: 30px 0; border: 0; border-top: 1px solid var(--border-soft);" />

      <h2 style="font-size: 1.6rem;">Adım 5: Yazıcıya Yükleme (Flashlama)</h2>
      <ol style="padding-left: 20px;">
         <li>Bilgisayarınızda <a href="https://winscp.net/eng/download.php" target="_blank" rel="noopener" style="color: var(--accent);"><strong>WinSCP</strong></a> programını açın ve Pi''ye bağlanın (<code>sftp://klipper.local</code>).</li>
         <li>Sağ tarafta şu yola gidin: <code>/home/pi/klipper/out/</code></li>
         <li>Buradaki <code>klipper.bin</code> dosyasını bilgisayarınıza indirin.</li>
         <li>Dosya adını <strong>firmware.bin</strong> olarak değiştirin.</li>
         <li>Bu dosyayı boş bir SD karta atın, yazıcı kapalıyken takın ve yazıcıyı açın. 10-15 saniye bekleyin.</li>
      </ol>

      <!-- Önemli Uyarı -->
      <div style="background: #fef2f2; border: 1px solid #fecaca; border-left: 4px solid #ef4444; padding: 14px 16px; border-radius: 0 8px 8px 0; margin: 20px 0;">
        <strong style="color: #b91c1c;">⚠️ Dikkat!</strong>
        <p style="margin: 8px 0 0 0; color: #991b1b; font-size: 0.9rem;">
          SD kart FAT32 formatında olmalı. Dosya adını <strong>firmware.bin</strong> yerine <strong>firmware1.bin</strong>, <strong>firmware2.bin</strong> gibi farklı isimlerle deneyin - bazı anakartlar aynı ismi tekrar yüklemez.
        </p>
      </div>

      <hr style="margin: 30px 0; border: 0; border-top: 1px solid var(--border-soft);" />

      <h2 style="font-size: 1.6rem;">Adım 6: Bağlantı ve Son Dokunuş</h2>
      <p>Yazıcıyı USB kablosu ile Raspberry Pi''ye bağlayın. Terminale dönüp şu kodu yazarak USB kimliğini öğrenin:</p>

      <div style="background: #1e293b; color: #e2e8f0; padding: 15px; border-radius: 8px; font-family: monospace; margin-bottom: 15px; border: 1px solid #334155;">
        ls /dev/serial/by-id/*
      </div>

      <p>Çıkan uzun kodu kopyalayın. Şimdi tarayıcınızdan <strong>http://klipper.local</strong> adresine gidin.</p>

      <figure class="bento-card mt-3 mb-4" style="padding:0; overflow:hidden; border-radius: 12px; border: 1px solid var(--border-soft);">
         <img src="https://img.youtube.com/vi/nI8o6yQRxpY/maxresdefault.jpg" alt="Mainsail Arayüzü" style="width:100%; height: auto; object-fit: cover;">
         <figcaption style="padding: 12px; background: var(--bg-hover); font-size: 0.85rem; color: var(--text-muted);">
           <strong>Mainsail Dashboard:</strong> Web arayüzü üzerinden yazıcınızı kontrol edebilir, baskı başlatabilir ve ayarları yapabilirsiniz.
         </figcaption>
      </figure>

      <div class="bento-card" style="background: var(--bg-card); padding: 20px; border-radius: 12px; border: 1px solid var(--border-soft);">
        <strong>🔧 Config Ayarı:</strong>
        <ol style="margin-top: 10px; padding-left: 20px;">
           <li>Mainsail arayüzünde soldaki <strong>"Machine"</strong> sekmesine tıklayın.</li>
           <li><code>printer.cfg</code> dosyasını açın (Boşsa <a href="https://github.com/Klipper3d/klipper/tree/master/config" target="_blank" rel="noopener" style="color: var(--accent);">örnek config dosyalarından</a> birini yapıştırın).</li>
           <li><code>[mcu]</code> bölümünü bulup <code>serial:</code> kısmına kopyaladığınız kodu yapıştırın.</li>
        </ol>
      </div>

      <div style="background: #1e293b; color: #e2e8f0; padding: 15px; border-radius: 8px; font-family: monospace; margin-top: 15px; border: 1px solid #334155;">
        [mcu]<br>
        serial: /dev/serial/by-id/usb-1a86_USB_Serial-if00-port0
      </div>

      <p class="mt-4">Sağ üstten <strong>"Save & Restart"</strong> dediğinizde sıcaklıklar geliyorsa tebrikler! Klipper dünyasına hoş geldiniz.</p>

      <!-- Başarı Kutlaması -->
      <div style="background: linear-gradient(135deg, #ecfdf5, #d1fae5); border: 2px solid #10b981; padding: 24px; border-radius: 16px; text-align: center; margin: 24px 0;">
        <div style="font-size: 3rem; margin-bottom: 12px;">🎉</div>
        <h3 style="color: #065f46; margin: 0 0 8px 0;">Tebrikler!</h3>
        <p style="color: #047857; margin: 0;">Klipper kurulumunu başarıyla tamamladınız. Artık yazıcınız çok daha hızlı ve hassas baskılar yapabilir!</p>
      </div>

      <!-- Sonraki Adımlar CTA -->
      <div class="bento-card mt-4" style="background: linear-gradient(135deg, rgba(59, 130, 246, 0.05), rgba(147, 51, 234, 0.05)); border: 1px solid var(--primary); padding: 30px; border-radius: 16px;">
        <div class="flex flex-col items-center text-center" style="display:flex; flex-direction:column; align-items:center;">
          <h3 style="font-size: 1.3rem; margin-bottom: 10px; color: #4f46e5;">Sırada Ne Var?</h3>
          <p style="margin-bottom: 20px; color: var(--text-muted);">Kurulum tamam ama işin eğlenceli kısmı yeni başlıyor. Input Shaping ile hız rekorları kırmak ister misiniz?</p>

          <a href="/rehberler/hiz-canavari-klipper-input-shaping-ve-pressure-advance-ayarlari-nasil-yapilir-ml0y1c07" class="btn btn-primary mt-2" style="background: #4f46e5; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-flex; align-items: center;">
            Input Shaping Rehberine Git
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-left: 6px;"><path d="m9 18 6-6-6-6"></path></svg>
          </a>
        </div>
      </div>

      <!-- Ek Kaynaklar -->
      <div style="background: var(--bg-card); border: 1px solid var(--border-soft); padding: 20px; border-radius: 12px; margin-top: 24px;">
        <h4 style="margin: 0 0 12px 0; color: var(--text-main);">📖 Ek Kaynaklar</h4>
        <ul style="margin: 0; padding-left: 20px; color: var(--text-muted);">
          <li><a href="https://www.klipper3d.org/FAQ.html" target="_blank" rel="noopener" style="color: var(--accent);">Klipper SSS (Sıkça Sorulan Sorular)</a></li>
          <li><a href="https://www.klipper3d.org/Config_checks.html" target="_blank" rel="noopener" style="color: var(--accent);">Klipper Yapılandırma Kontrolleri</a></li>
          <li><a href="https://github.com/Klipper3d/klipper/tree/master/config" target="_blank" rel="noopener" style="color: var(--accent);">Örnek Printer.cfg Dosyaları</a></li>
          <li><a href="https://discord.klipper3d.org/" target="_blank" rel="noopener" style="color: var(--accent);">Klipper Discord Topluluğu</a></li>
        </ul>
      </div>

    </div>
  </div>
</article>'
WHERE slug = 'sifirdan-zirveye-klipper-kurulum-rehberi-kiauh-yontemi-mkzk8u26';
