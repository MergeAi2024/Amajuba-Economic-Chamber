import nodemailer from 'nodemailer';

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Allow': 'POST' },
      body: JSON.stringify({ message: 'Method not allowed.' }),
    };
  }

  const { name, email, subject, message } = JSON.parse(event.body || '{}');

  if (!name || !email || !subject || !message) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Please provide name, email, subject, and message.' }),
    };
  }

  const EMAIL_USER = process.env.EMAIL_USER;
  const EMAIL_PASS = process.env.EMAIL_PASS;
  const EMAIL_TO = process.env.EMAIL_TO || 'amajubaeconomicchamber.office@gmail.com';

  if (!EMAIL_USER || !EMAIL_PASS) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Email service is not configured.' }),
    };
  }

  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `Amajuba Economic Chamber Website <${EMAIL_USER}>`,
      replyTo: email,
      to: EMAIL_TO,
      subject: `Contact form message: ${subject}`,
      text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}`,
      html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Subject:</strong> ${subject}</p><p><strong>Message:</strong></p><p>${message.replace(/\n/g, '<br/>')}</p>`,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Message sent successfully.' }),
    };
  } catch (error) {
    console.error('Contact function error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Unable to send your message right now. Please try again later.' }),
    };
  }
