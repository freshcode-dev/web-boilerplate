import { Attachment } from "nodemailer/lib/mailer";

export interface SendMailModel {
	to: string;
	subject: string;
	body: string;
	attachments?: Attachment[];
}
