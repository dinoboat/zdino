# Local preview: serves this folder at http://localhost:8080/
# Run it from PowerShell:   .\serve.ps1        (stop with Ctrl+C)
# The site reads content/work.md, so it must be opened this way (not by double-clicking index.html).
param([int]$Port = 8080)

$root = (Resolve-Path $PSScriptRoot).Path
$mime = @{
  '.html' = 'text/html; charset=utf-8';  '.css' = 'text/css; charset=utf-8'
  '.js'   = 'text/javascript; charset=utf-8'; '.md' = 'text/markdown; charset=utf-8'
  '.json' = 'application/json';  '.pdf' = 'application/pdf'
  '.png'  = 'image/png'; '.jpg' = 'image/jpeg'; '.jpeg' = 'image/jpeg'; '.svg' = 'image/svg+xml'
  '.ico'  = 'image/x-icon'; '.woff2' = 'font/woff2'; '.txt' = 'text/plain; charset=utf-8'
}

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$Port/")
$listener.Start()
Write-Host "Serving $root"
Write-Host "Open http://localhost:$Port/   (Ctrl+C to stop)"

try {
  while ($listener.IsListening) {
    $ctx = $listener.GetContext()
    $res = $ctx.Response
    try {
      $path = [Uri]::UnescapeDataString($ctx.Request.Url.AbsolutePath)
      if ($path.EndsWith('/')) { $path += 'index.html' }
      $full = [System.IO.Path]::GetFullPath((Join-Path $root $path.TrimStart('/').Replace('/', '\')))
      if ($full.StartsWith($root) -and (Test-Path -LiteralPath $full -PathType Leaf)) {
        $ext = [System.IO.Path]::GetExtension($full).ToLower()
        $res.ContentType = if ($mime.ContainsKey($ext)) { $mime[$ext] } else { 'application/octet-stream' }
        $res.Headers.Add('Cache-Control', 'no-store')
        $bytes = [System.IO.File]::ReadAllBytes($full)
        $res.ContentLength64 = $bytes.Length
        $res.OutputStream.Write($bytes, 0, $bytes.Length)
      } else {
        # Like GitHub Pages: unknown addresses get your 404.html page (with a 404 status)
        $res.StatusCode = 404
        $nf = Join-Path $root '404.html'
        if (Test-Path -LiteralPath $nf -PathType Leaf) {
          $res.ContentType = 'text/html; charset=utf-8'
          $msg = [System.IO.File]::ReadAllBytes($nf)
        } else {
          $msg = [System.Text.Encoding]::UTF8.GetBytes('Not found')
        }
        $res.ContentLength64 = $msg.Length
        $res.OutputStream.Write($msg, 0, $msg.Length)
      }
    } catch {
      $res.StatusCode = 500
    } finally {
      $res.Close()
    }
  }
} finally {
  $listener.Stop()
}
