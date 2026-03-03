import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [medicines, setMedicines] = useState([]);
    const [patients, setPatients] = useState([]);
    const [rentals, setRentals] = useState([]);
    const [labSamples, setLabSamples] = useState([]);
    const [prescriptions, setPrescriptions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Handle Session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            if (session?.user) fetchProfile(session.user.id);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            if (session?.user) fetchProfile(session.user.id);
            else {
                setProfile(null);
                setLoading(false);
            }
        });

        const fetchProfile = async (userId) => {
            const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
            if (data) setProfile(data);
        };

        const fetchData = async () => {
            setLoading(true);
            try {
                const [
                    { data: meds },
                    { data: pats },
                    { data: rents },
                    { data: labs },
                    { data: prevPres }
                ] = await Promise.all([
                    supabase.from('medicines').select('*'),
                    supabase.from('patients').select('*'),
                    supabase.from('rentals').select('*'),
                    supabase.from('lab_samples').select('*'),
                    supabase.from('prescriptions').select('*')
                ]);

                if (meds) setMedicines(meds);
                if (pats) setPatients(pats);
                if (rents) setRentals(rents);
                if (labs) setLabSamples(labs);
                if (prevPres) setPrescriptions(prevPres);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        // Real-time subscriptions for all pertinent tables
        const tables = ['medicines', 'patients', 'rentals', 'lab_samples', 'prescriptions'];
        const channels = tables.map(table =>
            supabase.channel(`${table}-changes`)
                .on('postgres_changes', { event: '*', schema: 'public', table }, () => {
                    fetchData();
                }).subscribe()
        );

        return () => {
            subscription.unsubscribe();
            channels.forEach(ch => supabase.removeChannel(ch));
        };
    }, []);

    // Function to save a new prescription
    const savePrescription = async (newPres) => {
        try {
            const { data, error } = await supabase
                .from('prescriptions')
                .insert([{
                    ...newPres,
                    doctor: profile?.full_name || "Dr. Smith",
                    date: new Date().toISOString().split('T')[0]
                }])
                .select();

            // Deduct stock logic
            for (const item of newPres.medicines) {
                const med = medicines.find(m => m.name === item.name);
                if (med) {
                    await supabase
                        .from('medicines')
                        .update({ stock: Math.max(0, med.stock - 1) })
                        .eq('id', med.id);
                }
            }
        } catch (error) {
            console.error("Prescription error:", error);
        }
    };

    const updateStock = async (medId, field, value) => {
        const { error } = await supabase
            .from('medicines')
            .update({ [field]: value })
            .eq('id', medId);

        if (error) console.error("Update stock error:", error);
    };

    const updateProfile = async (updates) => {
        try {
            const { error } = await supabase
                .from('profiles')
                .update(updates)
                .eq('id', user.id);

            if (error) throw error;
            setProfile(prev => ({ ...prev, ...updates }));
        } catch (error) {
            console.error("Update profile error:", error);
        }
    };

    const addPatient = async (patientData) => {
        const { error } = await supabase.from('patients').insert([patientData]);
        if (error) console.error("Add patient error:", error);
    };

    const addMedicine = async (medicineData) => {
        const { error } = await supabase.from('medicines').insert([medicineData]);
        if (error) console.error("Add medicine error:", error);
    };

    const addLabSample = async (sampleData) => {
        const { error } = await supabase.from('lab_samples').insert([sampleData]);
        if (error) console.error("Add lab sample error:", error);
    };

    const addRental = async (rentalData) => {
        const { error } = await supabase.from('rentals').insert([rentalData]);
        if (error) console.error("Add rental error:", error);
    };

    const bookRental = async (rentalId, userId) => {
        const { error } = await supabase.from('rentals').update({ renter_id: userId }).eq('id', rentalId);
        if (error) console.error("Book rental error:", error);
    };

    const uploadLabReport = async (sampleId, reportUrl) => {
        const { error } = await supabase.from('lab_samples').update({ report_url: reportUrl, status: 'Completed' }).eq('id', sampleId);
        if (error) console.error("Upload lab report error:", error);
    };

    const updatePatient = async (patientId, updates) => {
        const { error } = await supabase.from('patients').update(updates).eq('id', patientId);
        if (error) console.error("Update patient error:", error);
    };

    const value = {
        user,
        profile,
        medicines,
        patients,
        rentals,
        labSamples,
        prescriptions,
        loading,
        savePrescription,
        updateStock,
        updateProfile,
        bookRental,
        uploadLabReport,
        addPatient,
        addMedicine,
        addLabSample,
        addRental,
        updatePatient
    };

    return (
        <GlobalContext.Provider value={value}>
            {children}
        </GlobalContext.Provider>
    );
};

export const useGlobal = () => {
    const context = useContext(GlobalContext);
    if (!context) throw new Error("useGlobal must be used within GlobalProvider");
    return context;
};
