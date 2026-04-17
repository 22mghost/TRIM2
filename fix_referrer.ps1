$content = Get-Content 'index.html' -Raw
$content = [regex]::Replace($content, '(<img\s)(?!.*?referrerpolicy)', '$1referrerpolicy="no-referrer" ')
Set-Content 'index.html' $content -NoNewline
Write-Host "Done"
