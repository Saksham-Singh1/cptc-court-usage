export class CourtSlot {
    public courtNumber?: number;
    public dateId?: string;
    public timeId?: number;
    public courtType?: string;
    public p1?: string;
    public p2?: string;
    public p3?: string;
    public p4?: string;
    public runId?: string;
  
    constructor(
      courtNumber?: number,
      dateId?: string,
      timeId?: number,
      backgroundColor?: string,
      p1?: string,
      p2?: string,
      p3?: string,
      p4?: string,
      runId?: string
    ) {
      this.courtNumber = courtNumber;
      this.dateId = dateId;
      this.timeId = timeId;
      this.courtType = backgroundColor;
      this.p1 = p1;
      this.p2 = p2;
      this.p3 = p3;
      this.p4 = p4;
      this.runId = runId;
    }
  
    // Method to print details of the court slot
    public printDetails(): void {
      console.log(
        `Court Number: ${this.courtNumber || 'N/A'}, Date ID: ${this.dateId || 'N/A'}, Time ID: ${this.timeId || 'N/A'}, Court Type: ${this.courtType || 'N/A'}`
      );
      console.log(
        `Players: ${this.p1 || 'N/A'}, ${this.p2 || 'N/A'}, ${this.p3 || 'N/A'}, ${this.p4 || 'N/A'}, Run ID: ${this.runId || 'N/A'}`
      );
    }
  }
  