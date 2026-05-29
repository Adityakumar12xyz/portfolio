$pbPath = "C:\Users\HP\.gemini\antigravity\conversations\58635466-0659-48b3-b813-d495e2991be3.pb"
if (!(Test-Path $pbPath)) {
    Write-Output "File not found: $pbPath"
    Exit
}

$bytes = [System.IO.File]::ReadAllBytes($pbPath)
$enc = [System.Text.Encoding]::UTF8
$text = $enc.GetString($bytes)

# Count alphanumeric vs other characters
$alnum = 0
$other = 0
for ($i = 0; $i -lt $text.Length; $i++) {
    if ([char]::IsLetterOrDigit($text[$i])) {
        $alnum++
    } else {
        $other++
    }
}

Write-Output "File length: $($bytes.Length) bytes"
Write-Output "Alphanumeric characters: $alnum"
Write-Output "Other characters: $other"

# Print first 200 chars with replacements for non-printable chars
$cleanText = ""
for ($i = 0; $i -lt [Math]::Min(500, $text.Length); $i++) {
    $c = $text[$i]
    if ([char]::IsControl($c) -and $c -ne "`n" -and $c -ne "`r" -and $c -ne "`t") {
        $cleanText += "."
    } else {
        $cleanText += $c
    }
}
Write-Output "First 500 characters snippet:"
Write-Output $cleanText
