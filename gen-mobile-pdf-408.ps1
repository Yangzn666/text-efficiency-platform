$ErrorActionPreference = 'Stop'
$edge = 'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
if (-not (Test-Path $edge)) { $edge = 'C:\Program Files\Microsoft\Edge\Application\msedge.exe' }

$noteDir = 'D:\学习\效率\04-408专业课\03-个人笔记'
$jobs = @(
  @{ src = "$noteDir\计网背诵手册-打印版.html";     tmp = 'D:\handbook_net'; final = "$noteDir\计网背诵手册-手机版.pdf" },
  @{ src = "$noteDir\操作系统背诵手册-打印版.html"; tmp = 'D:\handbook_os';  final = "$noteDir\操作系统背诵手册-手机版.pdf" }
)

foreach ($j in $jobs) {
  # 中文路径在无头 Edge + PowerShell 5.1 下易出编码问题，先落到纯 ASCII 临时文件
  Copy-Item -LiteralPath $j.src -Destination "$($j.tmp).html" -Force
  $uri = "file:///D:/$([System.IO.Path]::GetFileName($j.tmp)).html#mobile"
  $out = "$($j.tmp).pdf"
  if (Test-Path $out) { Remove-Item $out -Force }

  $p = Start-Process -FilePath $edge -ArgumentList `
    "--headless=new","--disable-gpu","--no-sandbox","--no-pdf-header-footer", `
    "--virtual-time-budget=4000","--print-to-pdf=$out",$uri -Wait -PassThru

  if (Test-Path $out) {
    Move-Item -LiteralPath $out -Destination $j.final -Force
    $f = Get-Item -LiteralPath $j.final
    Write-Output ("OK  {0}  ->  {1} KB" -f $f.Name, [math]::Round($f.Length/1KB,1))
  } else {
    Write-Output ("FAIL {0} (exit={1}, uri={2})" -f $j.src, $p.ExitCode, $uri)
  }
  Remove-Item -LiteralPath "$($j.tmp).html" -Force -ErrorAction SilentlyContinue
}
