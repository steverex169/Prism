import * as React from 'react';
import { colors } from '../../email/theme';
import { Header } from './Header';
import { Footer, type FooterProps } from './Footer';

export interface EmailLayoutProps extends Omit<FooterProps, 'reason'> {
  /** Inbox preview text shown after the subject line. */
  preview: string;
  /** Footer line explaining why this email was sent. */
  footerReason: string;
  /** <title> of the HTML document (usually the subject line). */
  title?: string;
  children: React.ReactNode;
}

const responsiveCss = `
  body, table, td, a { -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%; }
  table, td { mso-table-lspace:0pt; mso-table-rspace:0pt; border-collapse:collapse; }
  img { border:0; outline:none; text-decoration:none; -ms-interpolation-mode:bicubic; }
  a { text-decoration:none; }
  @media only screen and (max-width:620px) {
    .container { width:100% !important; }
    .px { padding-left:28px !important; padding-right:28px !important; }
    .h1 { font-size:32px !important; line-height:38px !important; }
    .stack { display:block !important; width:100% !important; padding:0 0 22px 0 !important; }
    .otp { font-size:38px !important; letter-spacing:10px !important; }
    .btn a { display:block !important; }
  }
`;

/** Wraps every email: <html>/<head>, preview text, outer canvas, 600px card, Header and Footer. */
export function EmailLayout({ preview, footerReason, title, accountUrl, supportEmail, year, children }: EmailLayoutProps) {
  return (
    <html lang="en">
      <head>
        {title ? <title>{title}</title> : null}
        <meta name="x-apple-disable-message-reformatting" />
        <meta name="format-detection" content="telephone=no, date=no, address=no, email=no" />
        <meta name="color-scheme" content="light" />
        <meta name="supported-color-schemes" content="light" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=Jost:wght@400;500&display=swap"
          rel="stylesheet"
        />
        <style>{responsiveCss}</style>
      </head>
      <body style={{ margin: 0, padding: 0, width: '100%', backgroundColor: colors.canvas }}>
        <div style={{ display: 'none', maxHeight: 0, overflow: 'hidden', opacity: 0, lineHeight: '1px' }}>{preview}</div>
        <table role="presentation" width="100%" cellPadding={0} cellSpacing={0} border={0} style={{ backgroundColor: colors.canvas }}>
          <tbody>
            <tr>
              <td align="center" style={{ padding: '40px 12px' }}>
                <table
                  role="presentation"
                  className="container"
                  width={600}
                  cellPadding={0}
                  cellSpacing={0}
                  border={0}
                  style={{ width: 600, maxWidth: 600, backgroundColor: colors.paper, margin: '0 auto' }}
                >
                  <tbody>
                    <Header />
                    {children}
                    <Footer reason={footerReason} accountUrl={accountUrl} supportEmail={supportEmail} year={year} />
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </body>
    </html>
  );
}
