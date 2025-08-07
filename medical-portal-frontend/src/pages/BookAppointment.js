// src/pages/BookAppointment.js
import React, { useEffect, useState } from 'react';
import API from '../services/api';
import './BookAppointment.css';
import { motion, AnimatePresence } from 'framer-motion';

function BookAppointment() {
    const [appointments, setAppointments] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedSlot, setSelectedSlot] = useState('');
    const [mode, setMode] = useState('video');
    const [message, setMessage] = useState('');
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Fetch existing appointments when the component mounts
    const fetchAppointments = async () => {
        setIsLoading(true);
        try {
            const res = await API.get('/appointments/my-appointments/');
            // The specialization is a number in the API, we need to map it to a string.
            // For now, we'll just show the number or 'N/A' as there's no lookup table provided.
            setAppointments(res.data);
        } catch (error) {
            console.error("Error fetching appointments:", error);
            setMessage('Failed to load appointments.');
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch list of doctors for the booking modal
    const fetchDoctors = async () => {
        setIsLoading(true);
        try {
            const res = await API.get('/appointments/doctors/');
            setDoctors(res.data);
        } catch (error) {
            console.error("Error fetching doctors:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    const handleDoctorSelect = (doctor) => {
        setSelectedDoctor(doctor);
        setStep(2);
    };

    const handleDateSelect = (date) => {
        setSelectedDate(date);
        setStep(3);
    };

    const handleBookingSubmit = async (e) => {
        e.preventDefault();
        if (!selectedDoctor || !selectedDate || !selectedSlot) {
            setMessage('Please fill all the details.');
            return;
        }

        setIsLoading(true);
        try {
            await API.post('/appointments/book/', {
                doctor: selectedDoctor.id,
                date: selectedDate,
                time_slot: selectedSlot,
                mode
            });
            setMessage('Appointment booked successfully! 🎉');
            setStep(4);
            fetchAppointments(); // Refresh the main list
        } catch (error) {
            console.error("Error booking appointment:", error);
            setMessage('Error booking appointment. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const openModal = () => {
        setIsModalOpen(true);
        fetchDoctors(); // Fetch doctors every time the modal opens
        // Reset modal state
        setSelectedDoctor(null);
        setSelectedDate('');
        setSelectedSlot('');
        setMode('video');
        setMessage('');
        setStep(1);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const getAvailableDates = (availability) => {
        if (!availability || availability.length === 0) return [];
        const dates = [];
        const today = new Date();
        for (let i = 0; i < 7; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
            const dayAvailability = availability.find(item => item.weekday === dayName);
            if (dayAvailability) {
                dates.push(date);
            }
        }
        return dates;
    };

    const getSlotsForSelectedDate = () => {
        if (!selectedDoctor || !selectedDate) return [];
        const date = new Date(selectedDate);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
        const dayAvailability = selectedDoctor.availability.find(item => item.weekday === dayName);
        return dayAvailability ? dayAvailability.slots : [];
    };

    // Animation variants for modal steps
    const stepVariants = {
        hidden: { opacity: 0, x: -50 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
        exit: { opacity: 0, x: 50, transition: { duration: 0.5 } }
    };

    return (
        <div className="full-width-appointments-page">
            <main className="appointments-list-container">
                <motion.div
                    className="main-header"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="page-title">My Appointments</h1>
                    <motion.button
                        className="create-appointment-btn"
                        onClick={openModal}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        + Create New Appointment
                    </motion.button>
                </motion.div>

                <AnimatePresence mode="wait">
                    {isLoading ? (
                        <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="loading-spinner-container">
                            <div className="loading-spinner"></div>
                            <p>Loading appointments...</p>
                        </motion.div>
                    ) : (
                        appointments.length > 0 ? (
                            <motion.div key="list-container" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="appointments-grid">
                                {appointments.map((app, index) => (
                                    <motion.div
                                        key={app.id}
                                        className={`appointment-card ${app.mode === 'in_person' ? 'in-person' : 'video'}`}
                                        initial={{ y: 50, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ duration: 0.6, delay: index * 0.1 }}
                                        whileHover={{ scale: 1.02, boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
                                    >
                                        <div className="appointment-header">
                                            <h3 className="doctor-email">{app.doctor.email || 'N/A'}</h3>
                                            <span className="appointment-status">{app.status}</span>
                                        </div>
                                        <div className="appointment-body">
                                            <div className="detail-item">
                                                <strong>📅 Date:</strong>
                                                <span>{new Date(app.date).toLocaleDateString()}</span>
                                            </div>
                                            <div className="detail-item">
                                                <strong>⏰ Time:</strong>
                                                <span>{app.time_slot}</span>
                                            </div>
                                            <div className="detail-item">
                                                <strong>🩺 Specialization:</strong>
                                                <span>{app.doctor.specialization || 'N/A'}</span>
                                            </div>
                                        </div>
                                        <div className="appointment-footer">
                                            <span className={`mode-badge ${app.mode}`}>{app.mode === 'video' ? 'Video Call 🖥️' : 'In-person Visit 🏥'}</span>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        ) : (
                            <motion.div key="no-list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="no-appointments-msg-container">
                                <h2 className="no-appointments-title">No Appointments Found 😔</h2>
                                <p className="no-appointments-text">It looks like you don't have any upcoming appointments. Book one to get started!</p>
                                <motion.button
                                    className="create-appointment-btn large-btn"
                                    onClick={openModal}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Book Your First Appointment
                                </motion.button>
                            </motion.div>
                        )
                    )}
                </AnimatePresence>
            </main>

            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        className="modal-backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeModal}
                    >
                        <motion.div
                            className="modal-content"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            onClick={e => e.stopPropagation()}
                        >
                            <button className="modal-close-btn" onClick={closeModal}>&times;</button>
                            <AnimatePresence mode="wait">
                                {step === 1 && (
                                    <motion.div key="step1-modal" variants={stepVariants} initial="hidden" animate="visible" exit="exit">
                                        <h2 className="modal-title">Select a Doctor</h2>
                                        <div className="doctors-grid-modal">
                                            {isLoading ? <div className="loading-spinner-small"></div> : (
                                                doctors.length > 0 ? doctors.map(doc => (
                                                    <motion.div key={doc.id} className="doctor-card-modal" whileHover={{ scale: 1.03 }} onClick={() => handleDoctorSelect(doc)}>
                                                        <div className="doctor-info-modal">
                                                            <h3 className="doctor-name-modal">{doc.email || 'N/A'}</h3>
                                                            <p className="specialization-modal">Specialization: {doc.specialization || 'N/A'}</p>
                                                        </div>
                                                    </motion.div>
                                                )) : <p className="no-data-msg-modal">No doctors available.</p>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                                {step === 2 && (
                                    <motion.div key="step2-modal" variants={stepVariants} initial="hidden" animate="visible" exit="exit">
                                        <button className="back-btn-modal" onClick={() => setStep(1)}>← Back</button>
                                        <h2 className="modal-title">Select Date</h2>
                                        <div className="date-picker-grid-modal">
                                            {getAvailableDates(selectedDoctor.availability).map((date, index) => (
                                                <motion.div key={index} className="date-card-modal" whileHover={{ scale: 1.05 }} onClick={() => handleDateSelect(date.toISOString().split('T')[0])}>
                                                    <span className="day-modal">{date.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                                                    <span className="date-number-modal">{date.getDate()}</span>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                                {step === 3 && (
                                    <motion.div key="step3-modal" variants={stepVariants} initial="hidden" animate="visible" exit="exit">
                                        <button className="back-btn-modal" onClick={() => setStep(2)}>← Back</button>
                                        <h2 className="modal-title">Choose Time & Mode</h2>
                                        <form onSubmit={handleBookingSubmit} className="booking-form-modal">
                                            <label className="form-label-modal">Time Slot</label>
                                            <div className="time-slots-grid-modal">
                                                {getSlotsForSelectedDate().length > 0 ? getSlotsForSelectedDate().map((slot, idx) => (
                                                    <motion.button key={idx} type="button" className={`time-slot-btn-modal ${selectedSlot === `${slot.start_time}-${slot.end_time}` ? 'selected' : ''}`} onClick={() => setSelectedSlot(`${slot.start_time}-${slot.end_time}`)} whileHover={{ scale: 1.02 }}>
                                                        {slot.start_time} - {slot.end_time}
                                                    </motion.button>
                                                )) : <p className="no-slots-msg-modal">No slots available.</p>}
                                            </div>
                                            <label className="form-label-modal">Consultation Mode</label>
                                            <div className="mode-selector-modal">
                                                <motion.button type="button" className={`mode-btn-modal ${mode === 'video' ? 'selected' : ''}`} onClick={() => setMode('video')} whileHover={{ scale: 1.02 }}>Video Call</motion.button>
                                                <motion.button type="button" className={`mode-btn-modal ${mode === 'in_person' ? 'selected' : ''}`} onClick={() => setMode('in_person')} whileHover={{ scale: 1.02 }}>In-person Visit</motion.button>
                                            </div>
                                            <motion.button type="submit" className="submit-btn-modal" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} disabled={isLoading || !selectedSlot}>{isLoading ? 'Booking...' : 'Confirm Appointment'}</motion.button>
                                        </form>
                                    </motion.div>
                                )}
                                {step === 4 && (
                                    <motion.div key="step4-modal" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="success-screen-modal">
                                        <h2 className="modal-title success-title-modal">Appointment Confirmed! 🎉</h2>
                                        <p className="success-message-modal">Your appointment with <strong>{selectedDoctor.email || 'N/A'}</strong> is successfully booked.</p>
                                        <motion.button onClick={closeModal} className="submit-btn-modal" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>Close</motion.button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default BookAppointment;