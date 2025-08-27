
'use server';

import nodemailer from 'nodemailer';
import 'dotenv/config';

interface TaskEmailPayload {
    to: string;
    assigneeName: string;
    taskTitle: string;
    projectName: string;
    assignedByName: string;
    taskId: string;
}

interface WelcomeEmailPayload {
    to: string;
    newUserName: string;
    createdByName: string;
    password?: string;
}

function createTransporter() {
     return nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: Number(process.env.SMTP_PORT) === 465, // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });
}

export async function sendTaskAssignmentEmail({
    to,
    assigneeName,
    taskTitle,
    projectName,
    assignedByName,
    taskId,
}: TaskEmailPayload) {

    const transporter = createTransporter();
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


export async function sendWelcomeEmail({ to, newUserName, createdByName, password }: WelcomeEmailPayload) {
    const transporter = createTransporter();
    const subject = `Welcome to TaskZen!`;
    const loginUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/login`;
    const settingsUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/dashboard/settings`;


    const htmlBody = `
        <h1>Welcome to TaskZen, ${newUserName}!</h1>
        <p>Your account has been created by <strong>${createdByName}</strong>.</p>
        <p>You can now log in to your account and start managing your tasks.</p>
        <p><strong>Your login details:</strong></p>
        <ul>
            <li><strong>Email:</strong> ${to}</li>
            <li><strong>Password:</strong> ${password}</li>
        </ul>
        <p>For security reasons, we strongly recommend that you change your password after your first login.</p>
         <a href="${settingsUrl}" style="background-color: #4f46e5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Change Your Password
        </a>
        <p>You can log in here: <a href="${loginUrl}">${loginUrl}</a></p>
        <p>Thank you!</p>
    `;

    const textBody = `
        Welcome to TaskZen, ${newUserName}!\n
        Your account has been created by ${createdByName}.\n
        You can now log in to your account and start managing your tasks.\n
        Your login details:\n
        Email: ${to}\n
        Password: ${password}\n
        For security reasons, we strongly recommend that you change your password after your first login.\n
        You can change your password here: ${settingsUrl}\n
        You can log in here: ${loginUrl}\n
        Thank you!
    `;

    const mailOptions = {
        from: process.env.SMTP_FROM,
        to,
        subject,
        text: textBody,
        html: htmlBody,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Welcome email sent successfully to:', to);
    } catch (error) {
        console.error('Error sending welcome email:', error);
        throw new Error('Could not send email. Please check your SMTP configuration.');
    }
}
