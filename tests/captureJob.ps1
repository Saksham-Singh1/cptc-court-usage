# Set the command you want to run
$command = "npx playwright test .\startCapture.spec.ts --workers=1"

# Set start and end time
$startHour = 7
$endHour = 22

# Number of runs
$runs = 12

# Function to generate a random delay between 45 to 75 minutes
function Get-RandomDelay {
    return Get-Random -Minimum 45 -Maximum 76 # 76 because the maximum is exclusive
}

# Loop to run the command
for ($i = 1; $i -le $runs; $i++) {
    # Get the current time
    $currentTime = Get-Date
    $currentHour = $currentTime.Hour

    # Check if the current hour is less than the end hour
    if ($currentHour -ge $startHour -and $currentHour -lt $endHour) {
        # Run the command
        Write-Host "Running command at $($currentTime.ToString('HH:mm')) (run $i)"
        
        # Execute the command
        Invoke-Expression $command

        # Generate a random delay
        $delay = Get-RandomDelay
        Write-Host "Waiting for $delay minutes..."
        
        # Wait for the random delay (convert minutes to seconds)
        Start-Sleep -Seconds ($delay * 60)
    } else {
        Write-Host "Reached the end time. Stopping further execution."
        break
    }
}
