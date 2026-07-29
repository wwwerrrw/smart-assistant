param(
    [Parameter(Mandatory = $true)]
    [string]$InputPath,

    [Parameter(Mandatory = $true)]
    [string]$OutputDir,

    [int]$Dpi = 120
)

$ErrorActionPreference = 'Stop'
$resolvedInput = (Resolve-Path -LiteralPath $InputPath).Path
New-Item -ItemType Directory -Path $OutputDir -Force | Out-Null
$resolvedOutput = (Resolve-Path -LiteralPath $OutputDir).Path
$pdfPath = Join-Path $resolvedOutput 'document.pdf'

if (-not ('WordPdfExporter' -as [type])) {
    Add-Type -Language CSharp -ReferencedAssemblies Microsoft.CSharp -TypeDefinition @'
using System;
using System.Runtime.InteropServices;

public static class WordPdfExporter {
    public static void Export(string source, string target) {
        Type type = Type.GetTypeFromProgID("Word.Application");
        if (type == null) throw new InvalidOperationException("Microsoft Word is unavailable.");
        dynamic word = Activator.CreateInstance(type);
        try {
            word.Visible = false;
            word.DisplayAlerts = 0;
            dynamic document = null;
            try {
                document = word.Documents.Open(source, false, true);
                document.ExportAsFixedFormat(target, 17);
            } finally {
                if (document != null) {
                    try { document.Close(0); } catch {}
                    try { Marshal.FinalReleaseComObject(document); } catch {}
                }
            }
        } finally {
            try { word.Quit(); } catch {}
            try { Marshal.FinalReleaseComObject(word); } catch {}
            GC.Collect();
            GC.WaitForPendingFinalizers();
        }
    }
}
'@
}

[WordPdfExporter]::Export($resolvedInput, $pdfPath)

$pdftoppm = 'C:\Users\LENOVO\.cache\codex-runtimes\codex-primary-runtime\dependencies\bin\override\pdftoppm.cmd'
if (-not (Test-Path -LiteralPath $pdftoppm)) {
    throw "pdftoppm is unavailable at the workspace dependency path."
}

& $pdftoppm -png -r $Dpi $pdfPath (Join-Path $resolvedOutput 'page')
if ($LASTEXITCODE -ne 0) {
    throw "pdftoppm failed with exit code $LASTEXITCODE"
}

$pages = Get-ChildItem -LiteralPath $resolvedOutput -Filter 'page-*.png' -File
if (-not $pages) {
    throw 'No page images were produced.'
}

[pscustomobject]@{
    Input = $resolvedInput
    Pdf = $pdfPath
    Pages = $pages.Count
    OutputDir = $resolvedOutput
}
