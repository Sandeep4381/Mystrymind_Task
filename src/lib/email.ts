
'use server';

import nodemailer from 'nodemailer';
import 'dotenv/config';

interface EmailPayload {
    to: string;
    assigneeName: string;
    taskTitle: string;
    projectName: string;
    assignedByName: string;
    taskId: string;
}

export async function sendTaskAssignmentEmail({
    to,
    assigneeName,
    taskTitle,
    projectName,
    assignedByName,
    taskId,
}: EmailPayload) {

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: Number(process.env.SMTP_PORT) === 465, // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    const subject = `New Task Assigned: ${taskTitle}`;
    const taskUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/dashboard/tasks/${taskId}`;

    const htmlBody = `
        <h1>Hi ${assigneeName},</h1>
        <p>You've been assigned a new task by <strong>${assignedByName}</strong>.</p>
        <h2>${taskTitle}</h2>
        <p><strong>Project:</strong> ${projectName}</p>
        <p>You can view the task details and get started by clicking the button below:</p>
        <a href="${taskUrl}" style="background-color: #4f46e5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
            View Task
        </a>
        <p>Thank you!</p>
    `;
     const textBody = `
        Hi ${assigneeName},\n
        You've been assigned a new task by ${assignedByName}.\n
        Task: ${taskTitle}\n
        Project: ${projectName}\n
        View the task here: ${taskUrl}\n
        Thank you!
    `;

    const mailOptions = {
        from: process.env.SMTP_FROM,
        to: to,
        subject: subject,
        text: textBody,
        html: htmlBody,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Task assignment email sent successfully to:', to);
    } catch (error) {
        console.error('Error sending task assignment email:', error);
        throw new Error('Could not send email. Please check your SMTP configuration.');
    }
}
