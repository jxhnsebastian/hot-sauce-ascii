import { NextApiRequest, NextApiResponse } from 'next';
import { Pool } from 'pg';
import { v4 as uuidv4 } from 'uuid';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { id, student_id, name, course_id, grade, links, email_id } = req.body;

      const client = await pool.connect();

      const checkEmailExistsQuery = `
        SELECT role
        FROM user_details
        WHERE email_id = $1
      `;

      const checkEmailExistsResult = await client.query(checkEmailExistsQuery, [email_id]);
      let isUnauthorized = false;

      if (checkEmailExistsResult.rows.length > 0) {
        if (checkEmailExistsResult.rows[0].role !== 'STUDENT') {
          isUnauthorized = true;
        }
      }

      if (isUnauthorized) {
        client.release();
        return res.status(403).json({ message: 'Unauthorized submission' });
      }

      let query;
      let values;

      if (id) {
        query = `
          UPDATE form_details
          SET student_id = $2, name = $3, course_id = $4, grade = $5, links = $6, email_id = $7
          WHERE id = $1;
        `;
        values = [id, student_id, name, course_id, grade, links, email_id];
      } else {
        const newId = uuidv4();

        query = `
          INSERT INTO form_details (id, student_id, name, course_id, grade, links, email_id)
          VALUES ($1, $2, $3, $4, $5, $6, $7);
        `;
        values = [newId, student_id, name, course_id, grade, links, email_id];
      }

      await client.query(query, values);
      client.release();

      res.status(200).json({ message: 'Form details updated successfully' });
    } catch (error) {
      console.error('Error updating form details:', error);
      res.status(500).json({ message: 'Error updating form details' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}