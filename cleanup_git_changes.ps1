# This script is used to cleanup git changes in a repository
# It will discard changes in files that have no real changes
# This is useful when running prettier or other formatters on a large codebase

# Get list of all changed files and store in array
$changedFiles = @(git status --porcelain | ForEach-Object { $_.Substring(3) })
Write-Host "Found $($changedFiles.Count) changed files"
foreach ($file in $changedFiles) {
    $hasRealChanges = git diff $file | Select-String '^-[^-]'
    if (!$hasRealChanges) {
        git restore --staged $file
        git checkout -- $file
    }
}
Write-Host "Cleanup complete."
