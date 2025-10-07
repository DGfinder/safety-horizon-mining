import PDFDocument from 'pdfkit'
import QRCode from 'qrcode'

interface CertificateData {
  userName: string
  courseName: string
  serialNumber: string
  issuedAt: Date
  expiresAt: Date
  verificationCode: string
  verificationUrl: string
}

export async function generateCertificatePDF(data: CertificateData): Promise<Buffer> {
  return new Promise(async (resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'A4',
        layout: 'landscape',
        margins: { top: 50, bottom: 50, left: 50, right: 50 },
      })

      const chunks: Buffer[] = []
      doc.on('data', (chunk) => chunks.push(chunk))
      doc.on('end', () => resolve(Buffer.concat(chunks)))
      doc.on('error', reject)

      // Background gradient effect
      doc
        .rect(0, 0, doc.page.width, doc.page.height)
        .fillColor('#f9fafb')
        .fill()

      // Header border
      doc
        .rect(30, 30, doc.page.width - 60, 100)
        .fillAndStroke('#192135', '#EC5C29')
        .lineWidth(3)

      // Title
      doc
        .fontSize(36)
        .fillColor('#FFFFFF')
        .font('Helvetica-Bold')
        .text('CERTIFICATE OF COMPLETION', 50, 60, {
          align: 'center',
          width: doc.page.width - 100,
        })

      // Subtitle
      doc
        .fontSize(14)
        .fillColor('#CCCCCC')
        .font('Helvetica')
        .text('Crew Resource Management for Mining Operations', 50, 100, {
          align: 'center',
          width: doc.page.width - 100,
        })

      // "This certifies that" text
      doc
        .fontSize(14)
        .fillColor('#475569')
        .font('Helvetica')
        .text('This certifies that', 0, 180, {
          align: 'center',
        })

      // Recipient name (large)
      doc
        .fontSize(32)
        .fillColor('#192135')
        .font('Helvetica-Bold')
        .text(data.userName, 0, 210, {
          align: 'center',
        })

      // Completion text
      doc
        .fontSize(14)
        .fillColor('#475569')
        .font('Helvetica')
        .text('has successfully completed', 0, 260, {
          align: 'center',
        })

      // Course name
      doc
        .fontSize(20)
        .fillColor('#EC5C29')
        .font('Helvetica-Bold')
        .text(data.courseName, 0, 290, {
          align: 'center',
        })

      // Description box
      const descY = 340
      doc
        .rect(100, descY, doc.page.width - 200, 80)
        .fillAndStroke('#EFF6FF', '#3B82F6')
        .lineWidth(1)

      doc
        .fontSize(11)
        .fillColor('#1E40AF')
        .font('Helvetica')
        .text(
          'This certification demonstrates proficiency in aviation-derived human factors principles applied to mining safety, including communication, situational awareness, decision-making, leadership, and crew coordination.',
          110,
          descY + 15,
          {
            width: doc.page.width - 220,
            align: 'center',
          }
        )

      // Date section
      const dateY = 450
      doc
        .fontSize(11)
        .fillColor('#64748B')
        .font('Helvetica-Bold')
        .text('Issued:', 150, dateY)
        .text('Expires:', doc.page.width - 250, dateY)

      doc
        .fontSize(12)
        .fillColor('#192135')
        .font('Helvetica')
        .text(
          data.issuedAt.toLocaleDateString('en-AU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          }),
          150,
          dateY + 20
        )
        .text(
          data.expiresAt.toLocaleDateString('en-AU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          }),
          doc.page.width - 250,
          dateY + 20
        )

      // Certificate number
      doc
        .fontSize(10)
        .fillColor('#64748B')
        .font('Helvetica')
        .text(`Certificate No: ${data.serialNumber}`, 0, dateY + 60, {
          align: 'center',
        })

      // Generate QR code
      const qrCodeDataURL = await QRCode.toDataURL(data.verificationUrl, {
        width: 120,
        margin: 1,
        color: {
          dark: '#192135',
          light: '#FFFFFF',
        },
      })

      // Add QR code to PDF
      const qrX = doc.page.width - 170
      const qrY = dateY - 20
      doc.image(qrCodeDataURL, qrX, qrY, {
        width: 100,
        height: 100,
      })

      // QR code label
      doc
        .fontSize(9)
        .fillColor('#64748B')
        .font('Helvetica')
        .text('Scan to verify', qrX - 5, qrY + 105, {
          width: 110,
          align: 'center',
        })

      // Footer
      const footerY = doc.page.height - 60
      doc
        .rect(50, footerY - 10, doc.page.width - 100, 1)
        .fillColor('#E2E8F0')
        .fill()

      doc
        .fontSize(9)
        .fillColor('#94A3B8')
        .font('Helvetica')
        .text(
          'This certificate is digitally signed and may be verified at safetyhorizon.training/verify',
          50,
          footerY,
          {
            width: doc.page.width - 100,
            align: 'center',
          }
        )

      doc
        .fontSize(8)
        .fillColor('#CBD5E1')
        .text(
          'Safety Horizon Mining | Applying Aviation CRM to Mining Operations',
          50,
          footerY + 20,
          {
            width: doc.page.width - 100,
            align: 'center',
          }
        )

      // Finalize PDF
      doc.end()
    } catch (error) {
      reject(error)
    }
  })
}
