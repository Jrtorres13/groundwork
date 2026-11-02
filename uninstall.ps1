# Removes Groundwork shortcuts and (optionally) your saved tasks.
$places = @(
  [Environment]::GetFolderPath('Desktop'),
  (Join-Path ([Environment]::GetFolderPath('StartMenu')) 'Programs'),
  [Environment]::GetFolderPath('Startup')
)
foreach ($dir in $places) { Remove-Item (Join-Path $dir 'Groundwork.lnk') -ErrorAction SilentlyContinue }
$dest = Join-Path $env:LOCALAPPDATA 'Groundwork'
$ans = Read-Host 'Also delete your saved workouts and settings? (y/N)'
if ($ans -match '^[yY]') {
  Remove-Item -LiteralPath $dest -Recurse -Force -ErrorAction SilentlyContinue
  if (Test-Path -LiteralPath $dest) { Write-Host 'Close the Groundwork window first, then run Uninstall.bat again.' -ForegroundColor Yellow }
  else { Write-Host 'Data deleted.' }
}
Write-Host 'Groundwork removed.' -ForegroundColor Green
