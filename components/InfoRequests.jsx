'use client';
import './components.css';
import { useEffect, useState } from 'react';
import { collection, onSnapshot, doc, updateDoc, query, where, orderBy, deleteDoc } from 'firebase/firestore';
import { db } from '../lib/firebaseClient';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function InfoRequest() {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [category, setCategory] = useState('');
    const [searchText, setSearchText] = useState('');
    const [searchDate, setSearchDate] = useState('');
    const [expandedCard, setExpandedCard] = useState(null);

    useEffect(() => {
        const collectionRef = collection(db, 'consult');

        const unsubscribe = onSnapshot(collectionRef, (snapshot) => {
            const data = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }));

            setRecords(data);
            setLoading(false);
        }, (error) => {
            console.error('Error fetching records:', error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []); // Dependencias vacías para que solo se ejecute una vez al montar el componente

    const markAsServed = async (id) => {
        try {
            const recordRef = doc(db, 'consult', id);
            await updateDoc(recordRef, { served: true });
            toast.success('Marcado como atendido');
        } catch (error) {
            console.error('Error updating document:', error);
            toast.error('Error al marcar como atendido');
        }
    };

    const deleteRecord = async (id) => {
        try {
            const confirmed = window.confirm('¿Estás seguro de eliminar este registro?');
            if (confirmed) {
                const recordRef = doc(db, 'consult', id);
                await deleteDoc(recordRef);
                toast.success('Registro eliminado');
            }
        } catch (error) {
            console.error('Error deleting document:', error);
            toast.error('Error al eliminar el registro');
        }
    };

    const toggleExpandCard = (id) => {
        setExpandedCard(expandedCard === id ? null : id);
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loader"></div>
                <p>Cargando registros...</p>
            </div>
        );
    }

    return (
        <div className="info-request-container">
            <ToastContainer position="top-right" autoClose={3000} />

            {/* Header */}
            <div className="header">
                <h1>Solicitudes de Información</h1>
                <p className="subtitle">Administra las consultas recibidas</p>
            </div>

            {/* Results Info */}
            <div className="results-info">
                <p>{records.length} {records.length === 1 ? 'registro encontrado' : 'registros encontrados'}</p>
            </div>

            {/* Records List */}
            <div className="records-grid">
                {records.length > 0 ? (
                    records.map((record) => (
                        <div
                            key={record.id}
                            className={`record-card ${record.served ? 'served' : ''} ${expandedCard === record.id ? 'expanded' : ''}`}
                            onClick={() => toggleExpandCard(record.id)}
                        >
                            <div className="card-header">
                                <div className="user-info">
                                    <h2 className="record-title">{record.fullName}</h2>
                                    <p className="record-date">
                                        {new Date(record.createdAt).toLocaleDateString('es-MX', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                </div>
                                {record.served && (
                                    <span className="served-badge">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                            <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                                        </svg>
                                        Atendido
                                    </span>
                                )}
                            </div>

                            <div className="card-content">
                                <div className="info-row">
                                    <span className="info-label">Motivo:</span>
                                    <span className="info-value">{record.helpWith}</span>
                                </div>

                                <div className="info-row">
                                    <span className="info-label">Consulta:</span>
                                    <span className="info-value">{record.query}</span>
                                </div>

                                {(expandedCard === record.id || window.innerWidth > 768) && (
                                    <>
                                        <div className="info-row">
                                            <span className="info-label">WhatsApp:</span>
                                            <span className="info-value">
                                                <a href={`https://wa.me/${record.whatsapp}`} target="_blank" rel="noopener noreferrer">
                                                    {record.whatsapp}
                                                </a>
                                            </span>
                                        </div>

                                        <div className="info-row">
                                            <span className="info-label">Miembro:</span>
                                            <span className="info-value">{record.churchMember}</span>
                                        </div>

                                        {record.locality && (
                                            <div className="info-row">
                                                <span className="info-label">Localidad:</span>
                                                <span className="info-value">{record.locality}</span>
                                            </div>
                                        )}

                                        {record.residence && (
                                            <div className="info-row">
                                                <span className="info-label">Residencia:</span>
                                                <span className="info-value">{record.residence}</span>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>

                            <div className="card-actions">
                                {!record.served && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            markAsServed(record.id);
                                        }}
                                        className="action-btn serve-btn"
                                    >
                                        Marcar como atendido
                                    </button>
                                )}
                                {record.served && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            deleteRecord(record.id);
                                        }}
                                        className="action-btn delete-btn"
                                    >
                                        Eliminar registro
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="no-results">
                        <img src="/no-results.svg" alt="Sin resultados" className="no-results-img" />
                        <h3>No se encontraron registros</h3>
                        <p>Intenta ajustar tus filtros de búsqueda</p>
                    </div>
                )}
            </div>
        </div>
    );
}

