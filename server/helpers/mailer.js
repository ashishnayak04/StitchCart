const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const buildOrderInvoiceHtml = (order, userEmail) => {
  const rows = (order.cartItems || [])
    .map(
      (item) => `
      <tr>
        <td style="padding:8px;border-bottom:1px solid #eee;">${item.title} × ${item.quantity}</td>
        <td style="padding:8px;border-bottom:1px solid #eee;text-align:right;">₹{(
          Number(item.price) * item.quantity
        ).toLocaleString("en-IN", { maximumFractionDigits: 2 })}</td>
      </tr>`
    )
    .join("");

  return `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#1a1a1a;">
      <h2 style="margin-bottom:4px;">StitchCart</h2>
      <p style="color:#666;margin-top:0;">Invoice for Order #${order._id}</p>
      <hr style="border:none;border-top:1px solid #eee;" />
      <p>Hi there,</p>
      <p>Thank you for your order. Your payment of <strong>₹{order.totalAmount.toLocaleString(
        "en-IN",
        { maximumFractionDigits: 2 }
      )}</strong> has been received. Here is your receipt:</p>
      <table style="width:100%;border-collapse:collapse;">
        <thead>
          <tr>
            <th style="text-align:left;padding:8px;border-bottom:2px solid #ddd;">Item</th>
            <th style="text-align:right;padding:8px;border-bottom:2px solid #ddd;">Amount</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
      <table style="width:100%;margin-top:16px;">
        <tr><td>Subtotal</td><td style="text-align:right;">₹{order.subtotalAmount.toLocaleString(
          "en-IN",
          { maximumFractionDigits: 2 }
        )}</td></tr>
        ${
          order.discountAmount
            ? `<tr><td>Discount${order.couponCode ? ` (${order.couponCode})` : ""}</td><td style="text-align:right;">-₹${order.discountAmount.toLocaleString(
                "en-IN",
                { maximumFractionDigits: 2 }
              )}</td></tr>`
            : ""
        }
        <tr><td>Shipping</td><td style="text-align:right;">₹{order.shippingAmount.toLocaleString(
          "en-IN",
          { maximumFractionDigits: 2 }
        )}</td></tr>
        <tr><td>GST</td><td style="text-align:right;">₹{order.taxAmount.toLocaleString(
          "en-IN",
          { maximumFractionDigits: 2 }
        )}</td></tr>
        <tr style="font-weight:bold;font-size:16px;">
          <td style="padding-top:8px;border-top:2px solid #ddd;">Total</td>
          <td style="text-align:right;padding-top:8px;border-top:2px solid #ddd;">₹{order.totalAmount.toLocaleString(
            "en-IN",
            { maximumFractionDigits: 2 }
          )}</td>
        </tr>
      </table>
      <p style="margin-top:24px;color:#666;font-size:13px;">
        Shipping to: ${order.addressInfo.address}, ${order.addressInfo.city} ${
    order.addressInfo.pincode
  } — ${order.addressInfo.phone}
      </p>
      <hr style="border:none;border-top:1px solid #eee;margin-top:24px;" />
      <p style="color:#999;font-size:12px;">Questions? Reply to this email and we'll help.</p>
    </div>`;
};

const sendOrderInvoiceEmail = async (order, userEmail) => {
  if (!process.env.SMTP_HOST) return;

  await transporter.sendMail({
    from: `"StitchCart" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
    to: userEmail,
    subject: `Invoice for your StitchCart order #${order._id}`,
    html: buildOrderInvoiceHtml(order, userEmail),
  });
};

module.exports = { transporter, sendOrderInvoiceEmail, buildOrderInvoiceHtml };
