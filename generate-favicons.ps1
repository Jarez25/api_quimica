Add-Type -AssemblyName System.Drawing

function Create-Favicon($outputPath, $size) {
    $bmp = New-Object System.Drawing.Bitmap($size, $size, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

    # Background squircle
    $bgBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 3, 7, 18))
    $rect = New-Object System.Drawing.Rectangle(0, 0, $size, $size)
    
    # Path for rounded rectangle
    $path = New-Object System.Drawing.Drawing2D.GraphicsPath
    $radius = [int]($size * 0.22)
    $dia = $radius * 2
    $path.AddArc(0, 0, $dia, $dia, 180, 90)
    $path.AddArc($size - $dia - 1, 0, $dia, $dia, 270, 90)
    $path.AddArc($size - $dia - 1, $size - $dia - 1, $dia, $dia, 0, 90)
    $path.AddArc(0, $size - $dia - 1, $dia, $dia, 90, 90)
    $path.CloseFigure()

    $g.FillPath($bgBrush, $path)

    # Border cyan
    $borderPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(200, 56, 189, 248), [Math]::Max(1.5, $size * 0.03))
    $g.DrawPath($borderPen, $path)

    # Scale helper
    $s = $size / 100.0

    # Draw Orbital Ring 1 (tilted)
    $g.TranslateTransform($size / 2, $size * 0.52)
    $g.RotateTransform(-30)
    $orbitPen1 = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(180, 56, 189, 248), [Math]::Max(1.0, 2.5 * $s))
    $g.DrawEllipse($orbitPen1, [float](-36 * $s), [float](-14 * $s), [float](72 * $s), [float](28 * $s))
    $g.ResetTransform()

    # Draw Orbital Ring 2 (tilted other way)
    $g.TranslateTransform($size / 2, $size * 0.52)
    $g.RotateTransform(30)
    $orbitPen2 = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(180, 168, 85, 247), [Math]::Max(1.0, 2.5 * $s))
    $g.DrawEllipse($orbitPen2, [float](-36 * $s), [float](-14 * $s), [float](72 * $s), [float](28 * $s))
    $g.ResetTransform()

    # Liquid path inside flask
    $liquidPath = New-Object System.Drawing.Drawing2D.GraphicsPath
    $p1 = New-Object System.Drawing.PointF([float](33 * $s), [float](76 * $s))
    $p2 = New-Object System.Drawing.PointF([float](67 * $s), [float](76 * $s))
    $p3 = New-Object System.Drawing.PointF([float](73 * $s), [float](85 * $s))
    $p4 = New-Object System.Drawing.PointF([float](27 * $s), [float](85 * $s))
    $liquidPath.AddPolygon([System.Drawing.PointF[]]@($p1, $p2, $p3, $p4))
    
    $liquidBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
        (New-Object System.Drawing.PointF(0, [float](70 * $s))),
        (New-Object System.Drawing.PointF(0, [float](90 * $s))),
        [System.Drawing.Color]::FromArgb(255, 6, 182, 212),
        [System.Drawing.Color]::FromArgb(255, 139, 92, 246)
    )
    $g.FillPath($liquidBrush, $liquidPath)

    # Flask outline
    $flaskPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 224, 242, 254), [Math]::Max(1.5, 3.2 * $s))
    $flaskPen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
    $flaskPen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
    $flaskPen.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Round

    $fp1 = New-Object System.Drawing.PointF([float](44 * $s), [float](28 * $s))
    $fp2 = New-Object System.Drawing.PointF([float](44 * $s), [float](45 * $s))
    $fp3 = New-Object System.Drawing.PointF([float](25 * $s), [float](87 * $s))
    $fp4 = New-Object System.Drawing.PointF([float](75 * $s), [float](87 * $s))
    $fp5 = New-Object System.Drawing.PointF([float](56 * $s), [float](45 * $s))
    $fp6 = New-Object System.Drawing.PointF([float](56 * $s), [float](28 * $s))
    $g.DrawLines($flaskPen, [System.Drawing.PointF[]]@($fp1, $fp2, $fp3, $fp4, $fp5, $fp6))

    # Flask Lip
    $lipPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 224, 242, 254), [Math]::Max(1.5, 3.0 * $s))
    $g.DrawLine($lipPen, [float](41 * $s), [float](26 * $s), [float](59 * $s), [float](26 * $s))

    # Quantum core spark / photon (white glowing center)
    $sparkBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 255, 255, 255))
    $g.FillEllipse($sparkBrush, [float](47 * $s), [float](56 * $s), [float](6 * $s), [float](6 * $s))

    # Clean up
    $g.Dispose()
    
    # Save as PNG
    $bmp.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
}

# Create Apple touch icon (180x180)
Create-Favicon "C:\laragon\www\api_quimica\frontend\public\apple-touch-icon.png" 180

# Create standard 32x32 PNG
Create-Favicon "C:\laragon\www\api_quimica\frontend\public\favicon-32x32.png" 32

# Create standard 16x16 PNG
Create-Favicon "C:\laragon\www\api_quimica\frontend\public\favicon-16x16.png" 16

# Wrap 32x32 into standard favicon.ico
$pngBytes = [System.IO.File]::ReadAllBytes('C:\laragon\www\api_quimica\frontend\public\favicon-32x32.png')
$ms = New-Object System.IO.MemoryStream
$bw = New-Object System.IO.BinaryWriter($ms)

$bw.Write([UInt16]0)
$bw.Write([UInt16]1)
$bw.Write([UInt16]1)

$bw.Write([Byte]32)
$bw.Write([Byte]32)
$bw.Write([Byte]0)
$bw.Write([Byte]0)
$bw.Write([UInt16]1)
$bw.Write([UInt16]32)
$bw.Write([UInt32]$pngBytes.Length)
$bw.Write([UInt32]22)

$bw.Write($pngBytes)
$bw.Flush()

[System.IO.File]::WriteAllBytes('C:\laragon\www\api_quimica\frontend\public\favicon.ico', $ms.ToArray())
$bw.Dispose()
$ms.Dispose()

# Also copy favicon.svg to vite.svg to override any legacy references
Copy-Item "C:\laragon\www\api_quimica\frontend\public\favicon.svg" "C:\laragon\www\api_quimica\frontend\public\vite.svg" -Force

Write-Output "Favicons (SVG, ICO, PNGs) created and synchronized successfully!"
