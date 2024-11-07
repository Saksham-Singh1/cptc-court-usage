# Set the command you want to run
$command = "npx playwright test .\startCapture.spec.ts --workers=1"

# Set start and end time (24-hour format)
$startHour = 7
$endHour = 22

# Limit the number of runs per day
$maxDailyRuns = 14

# Function to generate a random delay between 45 to 75 minutes
function Get-RandomDelay {
    return Get-Random -Minimum 45 -Maximum 76 # 76 because the maximum is exclusive
}

# Infinite loop to run the command every day within the time window
while ($true) {
    # Get the current date and initialize the run count for the day
    $currentDate = (Get-Date).Date
    $dailyRunCount = 0

    while ($dailyRunCount -lt $maxDailyRuns) {
        # Get the current time
        $currentTime = Get-Date
        $currentHour = $currentTime.Hour

        # Check if the current hour is within the allowed time window
        if ($currentHour -ge $startHour -and $currentHour -lt $endHour) {
            # Run the command
            Write-Host "Running command at $($currentTime.ToString('HH:mm')) (daily run $($dailyRunCount + 1))"
            
            # Execute the command
            Invoke-Expression $command

            # Increment the daily run counter
            $dailyRunCount++

            # Generate a random delay
            $delay = Get-RandomDelay
            Write-Host "Waiting for $delay minutes..."

            # Wait for the random delay (convert minutes to seconds)
            Start-Sleep -Seconds ($delay * 60)
        } else {
            Write-Host "Outside of execution window (07:00 - 22:00). Waiting for next cycle."

            # Sleep until the start of the next valid time window
            $timeUntilNextStart = [datetime]::Today.AddHours($startHour).AddDays(1) - $currentTime
            if ($currentHour -lt $startHour) {
                # If it's before the start hour, wait until the start time today
                $timeUntilNextStart = [datetime]::Today.AddHours($startHour) - $currentTime
            }
            $sleepSeconds = $timeUntilNextStart.TotalSeconds
            Start-Sleep -Seconds $sleepSeconds
        }
    }

    # Once the daily run limit is reached, wait until the start of the next day
    Write-Host "Reached the daily run limit ($maxDailyRuns). Waiting until tomorrow."

    # Sleep until 7 AM the next day
    $timeUntilNextDay = [datetime]::Today.AddHours($startHour).AddDays(1) - $currentTime
    Start-Sleep -Seconds $timeUntilNextDay.TotalSeconds
}
