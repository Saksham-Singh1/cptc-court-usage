drop table CourtBookingLog
CREATE TABLE CourtBookingLog (
    runId NVARCHAR(20),       
    courtNumber INT NULL,               -- Nullable, indicates which court is being used
    dateId NVARCHAR(100) NULL,                 -- Nullable, indicates the date for the court slot
    timeId NVARCHAR(100) NULL,          -- Nullable, indicates the time for the court slot
    courtType NVARCHAR(100) NULL,       -- Nullable, type of court (e.g., Walk on, Advance)
    p1 NVARCHAR(100) NULL,              -- Nullable, player 1
    p2 NVARCHAR(100) NULL,              -- Nullable, player 2
    p3 NVARCHAR(100) NULL,              -- Nullable, player 3
    p4 NVARCHAR(100) NULL               -- Nullable, player 4
);