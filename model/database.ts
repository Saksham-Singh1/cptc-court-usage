import sql from 'mssql';
import {CourtSlot} from './courtSlot';
import dotenv from 'dotenv';

dotenv.config();

const config = {
    user: process.env.AZURE_SQL_USER,
    password: process.env.AZURE_SQL_PASSWORD,
    server: process.env.AZURE_SQL_SERVER, 
    database: process.env.AZURE_SQL_DATABASE,
    options: {
      encrypt: true, // Use encryption for Azure SQL
      enableArithAbort: true,
    },
  };

export class Database {
public static async insert(courtSlot: CourtSlot): Promise<void> {
    try {
      let pool = await sql.connect(config);
      await pool.request()
        .input('courtNumber', sql.Int, courtSlot.courtNumber)
        .input('dateId', sql.NVarChar, courtSlot.dateId)
        .input('timeId', sql.NVarChar, courtSlot.timeId)
        .input('courtType', sql.NVarChar, courtSlot.courtType)
        .input('p1', sql.NVarChar, courtSlot.p1)
        .input('p2', sql.NVarChar, courtSlot.p2)
        .input('p3', sql.NVarChar, courtSlot.p3)
        .input('p4', sql.NVarChar, courtSlot.p4)
        .input('runId', sql.NVarChar, courtSlot.runId)
        .query(`
          INSERT INTO CourtBookingLog (courtNumber, dateId, timeId, courtType, p1, p2, p3, p4, runId)
          VALUES (@courtNumber, @dateId, @timeId, @courtType, @p1, @p2, @p3, @p4, @runId)
        `);
      console.log('Court slot created successfully.');
    } catch (err) {
      console.error('Error Inserting CourtBookingLog:', err);
    }
  }

  // Update an existing court slot in the database
  public static async update(courtSlot: CourtSlot): Promise<void> {
    try {
      let pool = await sql.connect(config);
      await pool.request()
        .input('courtNumber', sql.Int, courtSlot.courtNumber)
        .input('dateId', sql.Int, courtSlot.dateId)
        .input('timeId', sql.NVarChar, courtSlot.timeId)
        .input('courtType', sql.NVarChar, courtSlot.courtType)
        .input('p1', sql.NVarChar, courtSlot.p1)
        .input('p2', sql.NVarChar, courtSlot.p2)
        .input('p3', sql.NVarChar, courtSlot.p3)
        .input('p4', sql.NVarChar, courtSlot.p4)
        .input('runId', sql.NVarChar, courtSlot.runId)
        .query(`
          UPDATE CourtBookingLog
          SET dateId = @dateId, timeId = @timeId, courtType = @courtType, p1 = @p1, p2 = @p2, p3 = @p3, p4 = @p4, runId = @runId
          WHERE courtNumber = @courtNumber
        `);
      console.log('Court slot updated successfully.');
    } catch (err) {
      console.error('Error updating CourtBookingLog:', err);
    }
  }

  public static async batchInsert(courtSlots: CourtSlot[]): Promise<void> {
    try {
      let pool = await sql.connect(config);
      const table = new sql.Table('CourtBookingLog'); // Create a new table for bulk insert
      table.create = false; // Table already exists, so don't create it
      table.columns.add('courtNumber', sql.Int, { nullable: true });
      table.columns.add('dateId', sql.NVarChar(20), { nullable: true });
      table.columns.add('timeId', sql.NVarChar(100), { nullable: true });
      table.columns.add('courtType', sql.NVarChar(100), { nullable: true });
      table.columns.add('p1', sql.NVarChar(100), { nullable: true });
      table.columns.add('p2', sql.NVarChar(100), { nullable: true });
      table.columns.add('p3', sql.NVarChar(100), { nullable: true });
      table.columns.add('p4', sql.NVarChar(100), { nullable: true });
      table.columns.add('runId', sql.NVarChar(20), { nullable: true });

      // Add each courtSlot to the table
      courtSlots.forEach((slot) => {
        table.rows.add(
          slot.courtNumber,
          slot.dateId,
          slot.timeId,
          slot.courtType,
          slot.p1,
          slot.p2,
          slot.p3,
          slot.p4,
          slot.runId
        );
      });

      // Execute the bulk insert
      const request = pool.request();
      await request.bulk(table);
      console.log('Batch insert completed successfully.');
    } catch (err) {
      console.error('Error during batch insert:', err);
    } finally {
      sql.close();
    }
  }

}