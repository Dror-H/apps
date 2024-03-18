import * as nodemailerMock from 'nodemailer-mock';

export const mockMailer = nodemailerMock;

export const mockMailerService = nodemailerMock.createTransport({
  host: '127.0.0.1',
  port: -100,
});
