import db from '../config/database.js';
import { exportParticipantsToExcel } from '../utils/exportExcel.js';

export const getAllParticipants = async (req, res, next) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    let query = 'SELECT * FROM participants WHERE 1=1';
    const params = [];

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    if (search) {
      query += ' AND (name LIKE ? OR email LIKE ? OR order_id LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const [rows] = await db.execute(query, params);
    
    // Get total count
    const [countResult] = await db.execute(
      'SELECT COUNT(*) as total FROM participants',
      []
    );

    res.json({
      success: true,
      data: rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: countResult[0].total,
        totalPages: Math.ceil(countResult[0].total / limit)
      }
    });

  } catch (error) {
    next(error);
  }
};

export const getParticipantById = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    
    const [rows] = await db.execute(
      'SELECT * FROM participants WHERE order_id = ?',
      [orderId]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Participant not found'
      });
    }

    res.json({
      success: true,
      data: rows[0]
    });

  } catch (error) {
    next(error);
  }
};

export const exportToExcel = async (req, res, next) => {
  try {
    const { status } = req.query;
    
    let query = 'SELECT * FROM participants';
    const params = [];
    
    if (status) {
      query += ' WHERE status = ?';
      params.push(status);
    }
    
    query += ' ORDER BY created_at DESC';
    
    const [rows] = await db.execute(query, params);
    
    const buffer = await exportParticipantsToExcel(rows);
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=participants.xlsx');
    res.send(buffer);

  } catch (error) {
    next(error);
  }
};

export const getStatistics = async (req, res, next) => {
  try {
    const [[total]] = await db.execute('SELECT COUNT(*) as count FROM participants');
    const [[paid]] = await db.execute('SELECT COUNT(*) as count FROM participants WHERE status = ?', ['paid']);
    const [[pending]] = await db.execute('SELECT COUNT(*) as count FROM participants WHERE status = ?', ['pending']);
    const [[revenue]] = await db.execute('SELECT SUM(amount) as total FROM participants WHERE status = ?', ['paid']);
    
    const [byCategory] = await db.execute(`
      SELECT category, COUNT(*) as count, SUM(amount) as revenue 
      FROM participants 
      WHERE status = 'paid' 
      GROUP BY category
    `);

    res.json({
      success: true,
      data: {
        total: total.count,
        paid: paid.count,
        pending: pending.count,
        revenue: revenue.total || 0,
        byCategory
      }
    });

  } catch (error) {
    next(error);
  }
};