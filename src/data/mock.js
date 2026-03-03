export const formatCurrency = (num) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(num);
};

export const MEDICINES = [
    { id: 1, name: "Amoxicillin", dose: "500mg", stock: 150, price: 120, category: "Antibiotic" },
    { id: 2, name: "Paracetamol", dose: "650mg", stock: 15, price: 45, category: "Analgesic" },
    { id: 3, name: "Metformin", dose: "500mg", stock: 80, price: 85, category: "Antidiabetic" },
    { id: 4, name: "Amlodipine", dose: "5mg", stock: 45, price: 110, category: "Antihypertensive" },
    { id: 5, name: "Azithromycin", dose: "250mg", stock: 10, price: 150, category: "Antibiotic" },
    { id: 6, name: "Ibuprofen", dose: "400mg", stock: 100, price: 60, category: "Analgesic" }
];

export const PATIENTS = [
    { id: "P-44321", name: "Jane Doe", age: 28, gender: "Female", bloodType: "O+", phone: "9876543210", email: "jane@example.com" },
    { id: "P-44322", name: "John Smith", age: 45, gender: "Male", bloodType: "A-", phone: "9876543211", email: "john@example.com" }
];

export const RENTAL_EQUIPMENT = [
    { id: 1, name: "Wheelchair", category: "Mobility", price: 150, security: 2000, status: "Available" },
    { id: 2, name: "Oxygen Cylinder", category: "Respiratory", price: 500, security: 5000, status: "Available" },
    { id: 3, name: "Hospital Bed", category: "Furniture", price: 800, security: 10000, status: "Available" },
    { id: 4, name: "Stretcher", category: "Emergency", price: 300, security: 4000, status: "Rented" }
];

export const LAB_TESTS = [
    { id: 1, name: "Complete Blood Count (CBC)", price: 450, category: "Hematology", TAT: "24 Hours" },
    { id: 2, name: "Fast Blood Sugar", price: 150, category: "Biochemistry", TAT: "12 Hours" },
    { id: 3, name: "Lipid Profile", price: 800, category: "Biochemistry", TAT: "24 Hours" },
    { id: 4, name: "Liver Function Test (LFT)", price: 600, category: "Biochemistry", TAT: "24 Hours" },
    { id: 5, name: "Thyroid Profile (T3, T4, TSH)", price: 550, category: "Endocrinology", TAT: "48 Hours" }
];

export const TEST_SAMPLES = [
    { id: "S-99101", patientName: "Jane Doe", testName: "Lipid Profile", status: "In Progress", collectedAt: "2026-02-17 09:30 AM", type: "Blood" },
    { id: "S-99102", patientName: "John Smith", testName: "CBC", status: "Collected", collectedAt: "2026-02-17 10:45 AM", type: "Blood" },
    { id: "S-99103", patientName: "Rahul Sharma", testName: "Fast Blood Sugar", status: "Completed", collectedAt: "2026-02-16 08:00 AM", type: "Blood" }
];
