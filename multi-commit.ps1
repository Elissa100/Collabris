# multi-commit.ps1
# Automate committing each changed file individually

# Step 1: Get all modified and untracked files
$files = git status --porcelain | ForEach-Object {
    $parts = $_.Trim().Split(" ", 2)
    if ($parts.Count -eq 2) { $parts[1] }
}

# Step 2: Loop through each file and commit separately
foreach ($file in $files) {
    Write-Host "Committing: $file"
    git add "$file"

    # Smart auto message depending on file type
    if ($file -match "frontend") {
        $msg = "feat(frontend): update $([System.IO.Path]::GetFileNameWithoutExtension($file))"
    } elseif ($file -match "backend") {
        $msg = "refactor(backend): update $([System.IO.Path]::GetFileNameWithoutExtension($file))"
    } else {
        $msg = "chore: update $([System.IO.Path]::GetFileNameWithoutExtension($file))"
    }

    git commit -m $msg
}

# Step 3: Push all commits at once
git push origin main
Write-Host "All changes committed and pushed successfully!"
