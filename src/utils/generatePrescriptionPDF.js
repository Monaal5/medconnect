import jsPDF from 'jspdf';

export const generatePrescriptionPDF = (patient, clinicInfo, medicines, clinicalNotes = "") => {
    const doc = new jsPDF();

    // Header
    doc.setFillColor(16, 185, 129); // emerald-500
    doc.rect(0, 0, 210, 45, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.setFont('helvetica', 'bold');
    doc.text(clinicInfo.clinic_name || "MedConnect+", 20, 25);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(clinicInfo.clinic_address || "Healthcare Ecosystem Reimagined", 20, 35);

    // Doctor & Patient Info
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text("DOCTOR", 20, 60);
    doc.text("PATIENT", 110, 60);

    doc.setFont('helvetica', 'normal');
    const doctorDisplay = `Dr. ${clinicInfo.full_name}${clinicInfo.degree ? ', ' + clinicInfo.degree : ''}`;
    doc.text(doctorDisplay, 20, 67);
    doc.text(`${patient.name} (ID: ${patient.id})`, 110, 67);
    doc.text(`Age: ${patient.age} | Gender: ${patient.gender}`, 110, 73);

    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 80);

    doc.setDrawColor(203, 213, 225); // slate-300
    doc.line(20, 85, 190, 85);

    // Clinical Notes
    if (clinicalNotes) {
        doc.setFont('helvetica', 'bold');
        doc.text("Clinical Notes / Symptoms:", 20, 95);
        doc.setFont('helvetica', 'normal');
        const splitNotes = doc.splitTextToSize(clinicalNotes, 170);
        doc.text(splitNotes, 20, 102);
    }

    // Medications Table
    let yPos = clinicalNotes ? 120 : 95;
    doc.setFont('helvetica', 'bold');
    doc.text("Prescribed Medications:", 20, yPos);

    yPos += 10;
    doc.setFillColor(248, 250, 252); // slate-50
    doc.rect(20, yPos - 5, 170, 7, 'F');
    doc.setFontSize(10);
    doc.text("Medicine", 25, yPos);
    doc.text("Dosage", 80, yPos);
    doc.text("Frequency", 120, yPos);
    doc.text("Duration", 160, yPos);

    yPos += 10;
    doc.setFont('helvetica', 'normal');
    medicines.forEach((med, index) => {
        doc.text(med.name, 25, yPos);
        doc.text(med.dose || "-", 80, yPos);
        doc.text(med.frequency, 120, yPos);
        doc.text(med.duration, 160, yPos);
        yPos += 8;
    });

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text("This is an electronically generated prescription and does not require a physical signature.", 105, 280, { align: 'center' });
    doc.text("Verify QR code on the patient portal for authenticity.", 105, 285, { align: 'center' });

    doc.save(`Prescription_${patient.id}_${Date.now()}.pdf`);
};
