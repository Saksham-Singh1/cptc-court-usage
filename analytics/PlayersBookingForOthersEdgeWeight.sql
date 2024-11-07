-- Step 1: Create a temporary table to hold edges with initial weight
CREATE TABLE #PlayerEdges (
    player1 NVARCHAR(100),
    player2 NVARCHAR(100),
    weight INT
);

-- Step 2: Insert pairs where `p1` has changed, implying a potential relationship
WITH RankedBookings AS (
    SELECT 
        dateId, 
        courtNumber, 
        timeId, 
        p1 AS current_player,
        runId,
        ROW_NUMBER() OVER (PARTITION BY dateId, courtNumber, timeId ORDER BY runId) AS rn
    FROM 
        CourtBookingLog
    WHERE 
        p1 IS NOT NULL AND p1 <> ''
),
Changes AS (
    SELECT 
        prev.current_player AS player1,
        curr.current_player AS player2,
        COUNT(*) AS interaction_count
    FROM 
        RankedBookings curr
    JOIN 
        RankedBookings prev 
    ON 
        curr.dateId = prev.dateId AND 
        curr.courtNumber = prev.courtNumber AND 
        curr.timeId = prev.timeId AND 
        curr.rn = prev.rn + 1
    WHERE 
        curr.current_player <> prev.current_player
    GROUP BY 
        prev.current_player, curr.current_player
)
INSERT INTO #PlayerEdges (player1, player2, weight)
SELECT 
    player1, player2, interaction_count
FROM 
    Changes;

-- Optional: Check the edge list
SELECT * FROM #PlayerEdges order by weight desc;


