import jsPDF from 'jspdf';

export const generatePrescriptionPDF = (patient, clinicInfo, medicines, clinicalNotes = "") => {
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    let currentY = 0;

    // Header Color Strip
    doc.setFillColor(15, 23, 42); // Deep Slate from EHR theme
    doc.rect(0, 0, pageWidth, 40, 'F');

    // Clinic Info (Header)
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text(clinicInfo?.clinic_name || "MedConnect Regional Hospital", 20, 22);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(clinicInfo?.clinic_address || "Opp. Station Rd, Health City  •  Ph: +91 800-444-MEDIC", 20, 32);

    currentY = 55;

    // Doctor & Patient Layout (Grid style)
    doc.setTextColor(15, 23, 42);
    
    // --> Doctor Box (Left)
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(`Dr. ${clinicInfo?.full_name || "Primary Care Physician"}`, 20, currentY);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text(`${clinicInfo?.degree || "MBBS, MD - General Medicine"}`, 20, currentY + 6);
    doc.text(`Reg No: ${clinicInfo?.reg_no || "MCI-4829103"}`, 20, currentY + 12);
    
    // --> Prescribing Date (Top Right)
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(`Date: ${new Date().toLocaleDateString('en-IN')}`, pageWidth - 20, currentY, { align: 'right' });
    doc.setFont('helvetica', 'normal');
    doc.text(`Time: ${new Date().toLocaleTimeString('en-IN', {hour: '2-digit', minute:'2-digit'})}`, pageWidth - 20, currentY + 6, { align: 'right' });

    currentY += 25;

    // Horizontal Divider
    doc.setDrawColor(226, 232, 240); // slate-200
    doc.setLineWidth(0.5);
    doc.line(20, currentY, pageWidth - 20, currentY);
    currentY += 10;

    // Patient Information Block (Light Gray Background)
    doc.setFillColor(248, 250, 252);
    doc.rect(20, currentY, pageWidth - 40, 30, 'F');
    
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(10);
    
    // Row 1
    doc.setFont('helvetica', 'bold');
    doc.text("Patient Name:", 25, currentY + 8);
    doc.setFont('helvetica', 'normal');
    doc.text(`${patient.name}`, 55, currentY + 8);

    doc.setFont('helvetica', 'bold');
    doc.text("EHR ID:", 120, currentY + 8);
    doc.setFont('helvetica', 'normal');
    doc.text(`${patient.id.substring(0, 8)}`, 140, currentY + 8);

    // Row 2
    doc.setFont('helvetica', 'bold');
    doc.text("Age / Sex:", 25, currentY + 16);
    doc.setFont('helvetica', 'normal');
    doc.text(`${patient.age} Yrs / ${patient.gender}`, 55, currentY + 16);

    doc.setFont('helvetica', 'bold');
    doc.text("Weight:", 120, currentY + 16);
    doc.setFont('helvetica', 'normal');
    doc.text(`${patient.weight || '--'} kg`, 140, currentY + 16);

    // Row 3
    doc.setFont('helvetica', 'bold');
    doc.text("Blood Pressure:", 25, currentY + 24);
    doc.setFont('helvetica', 'normal');
    doc.text(`${patient.bp || '120/80'} mmHg`, 55, currentY + 24);

    doc.setFont('helvetica', 'bold');
    doc.text("Blood Group:", 120, currentY + 24);
    doc.setFont('helvetica', 'normal');
    doc.text(`${patient.blood_type || '--'}`, 140, currentY + 24);

    currentY += 40;

    // Clinical Notes Section
    if (clinicalNotes && clinicalNotes.trim() !== '') {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.text("Chief Complaints & Clinical Presentation", 20, currentY);
        
        currentY += 7;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(71, 85, 105); // slate-600
        
        const splitNotes = doc.splitTextToSize(clinicalNotes, pageWidth - 40);
        doc.text(splitNotes, 20, currentY);
        
        currentY += (splitNotes.length * 5) + 10;
    } else {
        currentY += 5;
    }

    // Rx Symbol
    doc.setFont('helvetica', 'bolditalic');
    doc.setFontSize(32);
    doc.setTextColor(15, 23, 42); // Slate 900
    doc.text("Rx", 20, currentY);
    currentY += 15;

    // Medications Table Header
    doc.setFillColor(241, 245, 249); // slate-100
    doc.rect(20, currentY - 6, pageWidth - 40, 10, 'F');
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text("Medicine Name", 25, currentY);
    doc.text("Frequency", 110, currentY);
    doc.text("Duration", 145, currentY);

    currentY += 12;

    // Medications List
    doc.setFont('helvetica', 'normal');
    medicines.forEach((med, index) => {
        // Line format
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(15, 23, 42);
        doc.text(`${index + 1}. ${med.name}`, 25, currentY);
        
        doc.setFont('helvetica', 'normal');
        doc.text(`${med.frequency || 'As Directed'}`, 110, currentY);
        doc.text(`${med.duration || '5 Days'}`, 145, currentY);
        
        // Instructions sub-line
        if (med.instructions) {
            currentY += 5;
            doc.setFontSize(9);
            doc.setTextColor(100, 116, 139);
            doc.text(`Note: ${med.instructions}`, 30, currentY);
            doc.setFontSize(10);
        }

        currentY += 10;
        
        // Page break if too long
        if (currentY > 250) {
            doc.addPage();
            currentY = 20;
        }
    });

    // Signatures and Footer
    let footerY = Math.max(currentY + 20, 240);

    doc.setDrawColor(203, 213, 225);
    doc.line(pageWidth - 70, footerY, pageWidth - 20, footerY); // Signature Line
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text("Doctor's Signature / E-Sign", pageWidth - 45, footerY + 6, { align: 'center' });

    // Tech Footer Note
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184); // slate-400
    doc.text("Document generated securely via MedConnect+ Electronic Health Record System.", pageWidth / 2, 280, { align: 'center' });
    doc.setTextColor(100, 116, 139);
    doc.text("Valid only with digital QR verification or stamped clinic seal.", pageWidth / 2, 284, { align: 'center' });

    // Save PDF
    doc.save(`Clinical_Order_${patient.name.replace(/\s+/g, '_')}_${Date.now()}.pdf`);
};
