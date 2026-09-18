$edge = 'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
$src = 'file:///D:/%E5%AD%A6%E4%B9%A0/%E6%95%88%E7%8E%87/04-408%E4%B8%93%E4%B8%9A%E8%AF%BE/03-%E4%B8%AA%E4%BA%BA%E7%AC%94%E8%AE%B0/%E8%AE%A1%E7%BB%84%E8%83%8C%E8%AF%B5%E6%89%8B%E5%86%8C-%E6%89%93%E5%8D%B0%E7%89%88.html#mobile'
$out = 'D:\jizushouce-mobile.pdf'
$p = Start-Process -FilePath $edge -ArgumentList "--headless=new","--disable-gpu","--no-sandbox","--no-pdf-header-footer","--virtual-time-budget=3000","--print-to-pdf=$out",$src -Wait -PassThru
Write-Output "exit=$($p.ExitCode)"
if (Test-Path $out) {
  $f = Get-Item $out
  Write-Output ("PDF OK: {0} KB" -f [math]::Round($f.Length/1KB,1))
} else {
  Write-Output 'PDF NOT FOUND'
}
