# Run this from the project root after starting express-api on http://localhost:5000.
# It captures real cURL command lines and responses into evidence files.
$ErrorActionPreference = 'Stop'
$evidence = Join-Path (Get-Location) 'evidence'
New-Item -ItemType Directory -Force -Path $evidence | Out-Null
function Save-CurlEvidence([string]$name, [string]$command, [string]$url, [string[]]$extraArgs = @()) {
    $path = Join-Path $evidence $name
    "COMMAND:`ncurl.exe $command $url`n`nOUTPUT:" | Set-Content -Encoding utf8 $path
    & curl.exe -sS -i @extraArgs $url 2>&1 | Add-Content -Encoding utf8 $path
    Write-Host "Saved $path"
}
Save-CurlEvidence 'getalldealers' '-X GET' 'http://localhost:5000/api/dealers'
Save-CurlEvidence 'getdealerbyid' '-X GET' 'http://localhost:5000/api/dealers/1'
Save-CurlEvidence 'getdealerreviews' '-X GET' 'http://localhost:5000/api/dealers/1/reviews'
Save-CurlEvidence 'getdealersbyState' '-X GET' 'http://localhost:5000/api/dealers/state/Kansas'
Save-CurlEvidence 'getallcarmakes' '-X GET' 'http://localhost:5000/api/car-makes'
Add-Content -Encoding utf8 (Join-Path $evidence 'getallcarmakes') "`n`nCOMMAND:`ncurl.exe -X GET http://localhost:5000/api/car-models`n`nOUTPUT:"
& curl.exe -sS -i http://localhost:5000/api/car-models 2>&1 | Add-Content -Encoding utf8 (Join-Path $evidence 'getallcarmakes')
Add-Content -Encoding utf8 (Join-Path $evidence 'loginuser') "COMMAND:`ncurl.exe -X POST http://localhost:5000/api/login -H 'Content-Type: application/json' -d '{`"username`":`"root`",`"password`":`"root123`"}'`n`nOUTPUT:"
& curl.exe -sS -i -X POST 'http://localhost:5000/api/login' -H 'Content-Type: application/json' -d '{"username":"root","password":"root123"}' 2>&1 | Add-Content -Encoding utf8 (Join-Path $evidence 'loginuser')
Add-Content -Encoding utf8 (Join-Path $evidence 'logoutuser') "COMMAND:`ncurl.exe -X POST http://localhost:5000/api/logout -H 'Content-Type: application/json' -d '{`"username`":`"root`"}'`n`nOUTPUT:"
& curl.exe -sS -i -X POST 'http://localhost:5000/api/logout' -H 'Content-Type: application/json' -d '{"username":"root"}' 2>&1 | Add-Content -Encoding utf8 (Join-Path $evidence 'logoutuser')
Add-Content -Encoding utf8 (Join-Path $evidence 'analyzereview') "COMMAND:`ncurl.exe -X POST http://localhost:5000/api/analyze-review -H 'Content-Type: application/json' -d '{`"review`":`"Fantastic services`"}'`n`nOUTPUT:"
& curl.exe -sS -i -X POST 'http://localhost:5000/api/analyze-review' -H 'Content-Type: application/json' -d '{"review":"Fantastic services"}' 2>&1 | Add-Content -Encoding utf8 (Join-Path $evidence 'analyzereview')
Write-Host 'Evidence captured. Review each file before submitting.' -ForegroundColor Green
