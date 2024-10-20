import { test, expect } from '@playwright/test';
import { CourtSlot } from '../model/courtSlot';
import { Legends } from '../model/legends';
import { Database } from '../model/database';


function getCurrentPSTDateId(): string {
  const now = new Date();
  const pstOffset = -8; // PST is UTC-8
  const pstDate = new Date(now.getTime() + pstOffset * 60 * 60 * 1000);

  const day = String(pstDate.getDate()).padStart(2, '0');
  const month = String(pstDate.getMonth() + 1).padStart(2, '0');
  const year = pstDate.getFullYear();

  return `${day}${month}${year}`;
}

function getCurrentPSTDateTime(): string {
  const pstDateId = getCurrentPSTDateId();
  const now = new Date();
  const pstOffset = -8; // PST is UTC-8
  const pstDate = new Date(now.getTime() + pstOffset * 60 * 60 * 1000);

  const hours = String(pstDate.getHours()).padStart(2, '0');
  const minutes = String(pstDate.getMinutes()).padStart(2, '0');
  const seconds = String(pstDate.getSeconds()).padStart(2, '0');

  return `${pstDateId}${hours}${minutes}${seconds}`;
}

function rgbToHex(rgb: string): string {
  // Use a regular expression to extract the RGB values
  const result = rgb.match(/rgb\(\s*(\d+),\s*(\d+),\s*(\d+)\s*\)/);

  if (!result) {
      throw new Error('Invalid RGB format');
  }

  // Convert each RGB component to a hexadecimal value
  const r = parseInt(result[1], 10);
  const g = parseInt(result[2], 10);
  const b = parseInt(result[3], 10);

  // Convert to hexadecimal and pad with zeros if necessary
  const toHex = (c: number) => {
      const hex = c.toString(16).padStart(2, '0');
      return hex;
  };

  // Combine and return the hex color code
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

test('test', async ({ page }) => {
  await page.goto('file:///C:/Users/rasingh.000/OneDrive/Shared%20favorites/CPTCCourtBooking/GameTime%20--%20Central%20Park%20Tennis%20Club1.html');
  
  // Get all rows in the table body
  const rows = await page.locator('table').getByRole('row').all();
  const courtSlots: CourtSlot[] = [];

  // Get all cells in the for second row, first row is header
  const cells = await rows[1].getByRole('cell').all();
  const runId =  getCurrentPSTDateTime();
  const dateId =  getCurrentPSTDateId();
  const legends = new Legends();

    
  // First row is header, j should start with 1    
    for (let j = 0; j < cells.length; j++) {
      // Use a CSS selector that matches both "timeslot" and "timeslot odd"
        const timeslotDivs = await cells[j].locator('div.timeslot, div.timeslot.odd').all();
        
       // console.log(`number of time slots ${await timeslotDivs.length}`)

        for(const timeslotDiv of timeslotDivs)
        {
          const courtSlotItem = new CourtSlot();        
          courtSlotItem.runId = runId;
          courtSlotItem.dateId = dateId;

          const nameDivs = await timeslotDiv.locator('div.names').locator('div.pname.table-pname').all();          

          courtSlotItem.courtType =  legends.get(rgbToHex(await timeslotDiv.evaluate(el => window.getComputedStyle(el).backgroundColor)));          
          
          if(await timeslotDiv.locator('div.time, div.timenotitle, span.time-booked').count() > 0) {
            courtSlotItem.courtNumber = j + 1;
            courtSlotItem.timeId = await timeslotDiv.locator('div.time, div.timenotitle, span.time-booked').first().textContent();
          }
          // console.log(`backgroundColor of time slots ${courtSlotItem.getBackgroundColor()}`)


          // if it does not contain name. Its not booked.
          if(await nameDivs.length == 0) {
            // console.log(`time0 ${await timeslotDiv.allInnerTexts()}`)                        
            // courtSlotItem.timeId = await timeslotDiv.allInnerTexts();
            courtSlots.push(courtSlotItem);
          }
          else {          
            // console.log(`time1 ${await timeslotDiv.allInnerTexts()}`)                        
            for (let k = 0; k < nameDivs.length; k++) {
              if(k == 0) courtSlotItem.p1 = await nameDivs[k].textContent()
              if(k == 1) courtSlotItem.p2 = await nameDivs[k].textContent()
              if(k == 2) courtSlotItem.p3 = await nameDivs[k].textContent()
              if(k == 3) courtSlotItem.p4 = await nameDivs[k].textContent()
            }

            courtSlots.push(courtSlotItem);
          }
               
    }
  } 

  await Database.batchInsert(courtSlots);

// Loop through the array and print the details of each CourtSlot object
for (const courtSlot of courtSlots) {
  courtSlot.printDetails();  
  console.log('------------------------');
}
});



//processEmptyCell()

