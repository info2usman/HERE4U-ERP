# Complete Step-by-Step Guide: Deploying HERE4U ERP on Hostinger using a Subdomain

This guide walks you through deploying this React (Vite) application onto a **Hostinger Subdomain** (e.g., `erp.yourdomain.com`, `billing.yourdomain.com`, or `ops.yourdomain.com`).

---

## 📋 Overview of Deployment Steps
1. **Create Subdomain** in Hostinger hPanel.
2. **Build the Application** (`npm run build`).
3. **Upload the `dist/` contents** to the subdomain's folder.
4. **Verify the `.htaccess` configuration** (already provided in `/public/.htaccess`).
5. **Issue Free SSL Certificate** in Hostinger.

---

## Step 1: Create the Subdomain in Hostinger hPanel

1. Log into your [Hostinger hPanel](https://hpanel.hostinger.com/).
2. Under **Websites**, find your main domain and click **Manage**.
3. In the left sidebar, navigate to **Domains** ➔ **Subdomains**.
4. In the **Create a New Subdomain** section:
   - **Subdomain Name**: Enter your desired prefix (e.g., `erp` for `erp.yourdomain.com`).
   - **Custom folder for subdomain**: Check this box!
   - Recommended folder name: `public_html/erp` (or leave the default folder it specifies, e.g. `public_html/erp`).
5. Click **Create**.
   - Hostinger will automatically create the directory (e.g., `public_html/erp`) and setup the DNS A-record pointing to your Hostinger server IP.

> 💡 **Note on DNS**: If your domain uses Hostinger Nameservers, DNS propagates within 5-15 minutes. If your domain's DNS is managed elsewhere (e.g. Cloudflare, GoDaddy), add an `A` record for `erp` pointing to your Hostinger VPS/Hosting IP address.

---

## Step 2: Build the Application Locally or in your Terminal

Run the build command in the project directory:

```bash
npm install
npm run build
```

This creates a production-optimized `dist/` directory with:
- `index.html`
- `assets/` (bundled JS & CSS)
- `.htaccess` (automatically copied from `public/.htaccess`)

---

## Step 3: Upload to Hostinger

There are **two easy ways** to upload:

### Method A: Hostinger File Manager (Quickest & Recommended)
1. On your computer, open the `dist` folder.
2. Select **all files and folders inside `dist/`** (`index.html`, `assets/`, `.htaccess`, etc.) and compress them into a `.zip` archive (e.g., `deploy.zip`).
   *(Important: Zip the files inside `dist/`, not the `dist` folder itself).*
3. In Hostinger hPanel, go to **Files** ➔ **File Manager**.
4. Navigate to your subdomain directory (usually `domains/yourdomain.com/public_html/erp` or `public_html/erp`).
5. Delete any placeholder `default.php` or `index.php` file created by Hostinger.
6. Click the **Upload** icon at the top right, select `deploy.zip`.
7. Right-click `deploy.zip` in File Manager and click **Extract**. Extract directly into the current folder.
8. Delete `deploy.zip`.

### Method B: Git Automatic Deployment (Advanced / CI/CD)
1. Push your repository to GitHub or GitLab.
2. In Hostinger hPanel, search for **Advanced** ➔ **Git**.
3. Select your repository and branch (`main`).
4. Set the **Install Directory** to your subdomain folder (`/public_html/erp`).
5. Set Build Command:
   ```bash
   npm install && npm run build && cp -r dist/* .
   ```
6. Click **Create** or **Deploy**.

---

## Step 4: Verify Single-Page-App (SPA) Routing (`.htaccess`)

Because this is a Single Page Application (SPA), when users refresh pages or navigate directly to routes, Apache/LiteSpeed needs to route the request to `index.html`.

This project already includes `/public/.htaccess`, which is automatically placed into `dist/` when building:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /

  # Force HTTPS
  RewriteCond %{HTTPS} off
  RewriteCond %{HTTP_HOST} ^(.+)$ [NC]
  RewriteRule ^ https://%1%{REQUEST_URI} [L,R=301]

  # Existing files and directories served directly
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]

  # Route everything else to index.html
  RewriteRule ^ index.html [L]
</IfModule>
```

> ⚠️ **File Manager Tip**: If you don't see `.htaccess` in Hostinger File Manager, click **Settings (Gear Icon)** in the File Manager top bar and enable **"Show Hidden Files (dotfiles)"**.

---

## Step 5: Activate Free SSL for the Subdomain

1. In Hostinger hPanel, navigate to **Security** ➔ **SSL**.
2. Find your new subdomain (e.g., `erp.yourdomain.com`).
3. Click **Install SSL** (Let's Encrypt lifetime SSL included with Hostinger).
4. Wait 1–2 minutes until status shows **Active**.
5. Enable **Force HTTPS**.

---

## Step 6: Testing & Confirmation

Open your browser and visit:
`https://erp.yourdomain.com`

- Verify that the dashboard loads.
- Click across different modules (Estimates, Invoicing, Closure, Staff, Procurement).
- Press Refresh (F5) on any page to ensure `.htaccess` correctly rewrites to `index.html` without a 404 error.

---

## Troubleshooting Common Issues

| Issue | Cause | Fix |
|---|---|---|
| **404 Not Found on Page Refresh** | Missing or misconfigured `.htaccess` file | Ensure `.htaccess` exists in the subdomain's document root folder. Enable "Show Hidden Files" in File Manager to verify. |
| **Blank White Screen** | Assets path mismatch or JavaScript error | Check browser Console (F12). Vite defaults to absolute `/assets/...` which is correct for subdomain root. |
| **SSL / "Not Secure" Warning** | SSL not yet activated for the subdomain | Go to hPanel ➔ SSL ➔ Install SSL for the subdomain. |
| **Old Version Still Appears** | Browser caching or LiteSpeed Cache | In hPanel, purge LiteSpeed Cache, or hard refresh your browser (`Ctrl + Shift + R` or `Cmd + Shift + R`). |
