import { snap } from '../config/midtrans.js';
import db from '../config/database.js';
import { generateOrderId } from '../utils/helpers.js';

export const createPayment = async (req, res, next) => {
  try {
    const { name, email, phone, category = '5K' } = req.body;
    
    const prices = {
      '5K': 275_000,
      '10K': 375_000,
      'Early 5k': 150_000,
      'Early 10k': 345_000
    };
    
    const amount = prices[category] || "Tidak ada pada category";
    console.log(amount);
    
    const orderId = generateOrderId();

    // Save to database first
    const [result] = await db.execute(
      'INSERT INTO participants (order_id, name, email, phone, category, amount, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())',
      [orderId, name, email, phone, category, amount, 'pending']
    );
      console.log(result);
      
    // Create Midtrans transaction
    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: amount
      },
      credit_card: { secure: true },
      customer_details: {
        first_name: name,
        email: email,
        phone: phone
      },
      enabled_payments: [
        'credit_card',
        'gopay',
        'shopeepay',
        'qris',
        'bca_va',
        'bni_va',
        'bri_va'
      ],
      item_details: [{
        id: category,
        price: amount,
        quantity: 1,
        name: `Fun Run UWP 2026 - ${category}`
      }]
    };

    const transaction = await snap.createTransaction(parameter);

    res.status(201).json({
      success: true,
      message: 'Payment created successfully',
      data: {
        order_id: orderId,
        token: transaction.token,
        redirect_url: transaction.redirect_url,
        amount: amount,
        category: category
      }
    });

  } catch (error) {
    next(error);
  }
};

export const handleWebhook = async (req, res, next) => {
  try {
    const notification = req.body;
    
    // Verify signature key (security check)
    const { order_id, status_code, gross_amount, signature_key } = notification;
    const serverKey = process.env.MIDTRANS_SERVER_KEY;
    
    const crypto = await import('crypto');
    const hash = crypto.createHash('sha512')
      .update(`${order_id}${status_code}${gross_amount}${serverKey}`)
      .digest('hex');
    
    if (hash !== signature_key) {
      return res.status(403).json({ message: 'Invalid signature' });
    }

    const transactionStatus = notification.transaction_status;
    const fraudStatus = notification.fraud_status;

    if (transactionStatus === 'capture' || transactionStatus === 'settlement') {
      if (fraudStatus === 'challenge') {
        // TODO: Handle challenge
        await db.execute(
          'UPDATE participants SET status = ? WHERE order_id = ?',
          ['challenge', order_id]
        );
      } else if (fraudStatus === 'accept' || !fraudStatus) {
        await db.execute(
          'UPDATE participants SET status = ?, payment_time = ?, transaction_id = ? WHERE order_id = ?',
          ['paid', new Date(), notification.transaction_id, order_id]
        );
        
        // TODO: Send email notification
        console.log(`✅ Payment success for order: ${order_id}`);
      }
    } else if (transactionStatus === 'cancel' || transactionStatus === 'deny' || transactionStatus === 'expire') {
      await db.execute(
        'UPDATE participants SET status = ? WHERE order_id = ?',
        ['failed', order_id]
      );
    } else if (transactionStatus === 'pending') {
      await db.execute(
        'UPDATE participants SET status = ? WHERE order_id = ?',
        ['pending', order_id]
      );
    }

    res.status(200).json({ 
      success: true,
      message: 'Webhook received' 
    });

  } catch (error) {
    next(error);
  }
};

export const checkPaymentStatus = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    
    const [rows] = await db.execute(
      'SELECT * FROM participants WHERE order_id = ?',
      [orderId]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check with Midtrans for latest status
    try {
      const statusResponse = await coreApi.transaction.status(orderId);
      
      // Update if status different
      if (statusResponse.transaction_status !== rows[0].status) {
        await db.execute(
          'UPDATE participants SET status = ? WHERE order_id = ?',
          [statusResponse.transaction_status, orderId]
        );
        rows[0].status = statusResponse.transaction_status;
      }
    } catch (midtransErr) {
      console.log('Midtrans check failed, using local status');
    }

    res.json({
      success: true,
      data: rows[0]
    });

  } catch (error) {
    next(error);
  }
};