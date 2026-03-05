import ExcelJS from 'exceljs';

export const exportParticipantsToExcel = async (participants) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Participants');

  worksheet.columns = [
    { header: 'No', key: 'no', width: 5 },
    { header: 'Order ID', key: 'order_id', width: 25 },
    { header: 'Name', key: 'name', width: 30 },
    { header: 'Email', key: 'email', width: 30 },
    { header: 'Phone', key: 'phone', width: 15 },
    { header: 'Category', key: 'category', width: 15 },
    { header: 'Amount', key: 'amount', width: 15 },
    { header: 'Status', key: 'status', width: 12 },
    { header: 'Payment Time', key: 'payment_time', width: 20 },
    { header: 'Registered At', key: 'created_at', width: 20 }
  ];

  participants.forEach((p, index) => {
    worksheet.addRow({
      no: index + 1,
      order_id: p.order_id,
      name: p.name,
      email: p.email,
      phone: p.phone,
      category: p.category || '5K',
      amount: p.amount,
      status: p.status,
      payment_time: p.payment_time,
      created_at: p.created_at
    });
  });

  worksheet.getRow(1).font = { bold: true };
  worksheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF00FF00' }
  };

  return await workbook.xlsx.writeBuffer();
};