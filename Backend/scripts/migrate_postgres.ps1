param()
if (-not $env:DATABASE_URL) {
    Write-Error "Please set the DATABASE_URL environment variable before running. Example: $env:DATABASE_URL='postgresql://user:pass@host:5432/dbname'"
    exit 2
}

Push-Location -Path (Join-Path $PSScriptRoot '..')
try {
    alembic upgrade head
    Write-Host "Migrations applied."
} finally {
    Pop-Location
}
