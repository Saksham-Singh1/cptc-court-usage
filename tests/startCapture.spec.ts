import { test, expect,  type Page } from '@playwright/test';
import { CourtSlot } from '../model/courtSlot';
import { Legends } from '../model/legends';
import { Database } from '../model/database';
import dotenv from 'dotenv';


function getCurrentPSTDateId(dayOffset: number): string {
  const now = new Date();
  
  // Apply the dayOffset to the current date
  now.setDate(now.getDate() + dayOffset);
  
  const pstOffset = -8; // PST is UTC-8
  const pstDate = new Date(now.getTime() + pstOffset * 60 * 60 * 1000);

  const day = String(pstDate.getDate()).padStart(2, '0');
  const month = String(pstDate.getMonth() + 1).padStart(2, '0');
  const year = pstDate.getFullYear();

  return `${day}/${month}/${year}`;
}

function getCurrentPSTDateIdNum(dayOffset: number): string {
  const now = new Date();
  
  // Apply the dayOffset to the current date
  now.setDate(now.getDate() + dayOffset);
  
  const pstOffset = -8; // PST is UTC-8
  const pstDate = new Date(now.getTime() + pstOffset * 60 * 60 * 1000);

  const day = String(pstDate.getDate()).padStart(2, '0');
  const month = String(pstDate.getMonth() + 1).padStart(2, '0');
  const year = pstDate.getFullYear();

  return `${day}${month}${year}`;
}

function getCurrentPSTDateTime(): string {
  const pstDateId = getCurrentPSTDateIdNum(0);
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

function getPSTDaysOfWeek(): string[] {
  // Define the array to hold the days of the week
  const daysOfWeek: string[] = [];
  
  // Array to map day index to weekday name
  const weekdayNames: string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  // Get current date and adjust to PST (UTC-8)
  const now: Date = new Date();
  const pstOffset = now.getTimezoneOffset() + (8 * 60); // PST is UTC-8
  const pstDate: Date = new Date(now.getTime() - pstOffset * 60000);

  // Get current day of the week (0 = Sunday, 1 = Monday, etc.)
  const todayIndex: number = pstDate.getDay();

  // Fill the daysOfWeek array starting from today
  for (let i = 0; i < 7; i++) {      
        const dayIndex = (todayIndex + i) % 7;
        daysOfWeek.push(weekdayNames[dayIndex]);
      
  }

  return daysOfWeek;
}

function getRandomUser(): string | undefined {
  // Collect users from environment variables
  const users = [
      process.env.CPTC_USER_1,
      process.env.CPTC_USER_2,
      process.env.CPTC_USER_3,
      process.env.CPTC_USER_4,
  ];

  // Filter out undefined values (in case some environment variables are not set)
  const filteredUsers = users.filter(user => user !== undefined);

  // If there are no users available, return undefined
  if (filteredUsers.length === 0) {
      return undefined;
  }

  // Get a random index
  const randomIndex = Math.floor(Math.random() * filteredUsers.length);

  // Return a random user
  return filteredUsers[randomIndex];
}

function getDistinctCourtSlots(courtSlots: CourtSlot[]): CourtSlot[] {
  return courtSlots.filter((slot, index, self) =>
    index === self.findIndex((t) =>
      t.courtNumber === slot.courtNumber &&
      t.dateId === slot.dateId &&
      t.timeId === slot.timeId &&
      t.courtType === slot.courtType &&
      t.p1 === slot.p1 &&
      t.p2 === slot.p2 &&
      t.p3 === slot.p3 &&
      t.p4 === slot.p4 &&
      t.runId === slot.runId
    )
  );
}

const daysOfWeek = getPSTDaysOfWeek();
dotenv.config();
const runId =  getCurrentPSTDateTime();
const legends = new Legends();
const courtSlots: CourtSlot[] = [];
const csvBlocks = [
  "Reed - Courts 1 -",
  "Wright - Courts 5 -",
  "Roberts - Courts 9 -",
  "Outdoor - Stadium & Courts 14 -"
];

async function parseAndSave(page: Page, day) {
  
  const dateId =  getCurrentPSTDateId(day);
    await page.getByRole('link', { name: daysOfWeek[day]}).first().click();    
    await page.waitForTimeout(1000);

    var courtOffset = 0;
    for (let b = 0; b < csvBlocks.length; b++) { 
        // Split the entry into parts
      if(courtOffset > 0) // fist blocks of ourt need not to be clicked 
      {
        await page.getByRole('link', { name: csvBlocks[b]}).first().click(); 
        await page.waitForTimeout(1000);  
      }
        
      const rows = await page.locator('table').getByRole('row').all();
      // Get all cells in the for second row, first row is header
      const cells = await rows[1].getByRole('cell').all();  
        
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
                courtSlotItem.courtNumber = j + 1 + courtOffset;
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

      courtOffset = courtOffset + 4;
        
    }
    
  await Database.batchInsert(getDistinctCourtSlots(courtSlots));

// Loop through the array and print the details of each CourtSlot object
  for (const courtSlot of courtSlots) {
    courtSlot.printDetails();  
    console.log('------------------------');
  }
}
test.beforeEach(async ({ page }) => {
  await page.goto('https://cptc.gametime.net./auth');
  await page.getByLabel('User Name:').click();
  await page.getByLabel('User Name:').fill('sks17');
  await page.getByLabel('User Name:').press('Tab');
  await page.getByLabel('Password:').click();
  await page.getByLabel('Password:').fill(process.env.CPTC_PASSWORD);
  await page.getByRole('button', { name: 'Sign In' }).click();  
  await page.getByRole('link', { name: 'TENNIS' }).click();  
  
});

// command to run test 
// npx playwright test --grep "day-6"
test('day-0', async ({ page }) => {    
  await parseAndSave(page , 0)
});

test('day-1', async ({ page }) => {
  await parseAndSave(page, 1)

});

test('day-2', async ({ page }) => {
  await parseAndSave(page, 2)

});

test('day-3', async ({ page }) => {
  await parseAndSave(page, 3)

});


test('day-4', async ({ page }) => {
  await parseAndSave(page, 4)

});


test('day-5', async ({ page }) => {
  await parseAndSave(page, 5)

});

test('day-6', async ({ page }) => {
  await parseAndSave(page, 6)
});


