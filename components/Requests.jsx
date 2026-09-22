'use client';
import './components.css';
import { useEffect, useState } from 'react';
import { collection, onSnapshot, doc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { db } from '../lib/firebaseClient';

export default function FirestoreRecords() {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [category, setCategory] = useState('');
    const [searchText, setSearchText] = useState('');
    const [searchDate, setSearchDate] = useState('');

    // Fetch Firestore data in real-time with filters
    useEffect(() => {
        let collectionRef = collection(db, 'infoRequests');
        let q = collectionRef;

        if (category) {
            q = query(collectionRef, where('helpWith', '==', category));
        }
        if (searchDate) {
            const formattedDate = searchDate;

            q = query(collectionRef, where('createdAt', '>=', formattedDate + 'T00:00:00.000Z'), where('createdAt', '<=', formattedDate + 'T23:59:59.999Z'));
        }

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs
                .map((doc) => ({ id: doc.id, ...doc.data() }))
                .filter((record) => record.fullName.toLowerCase().includes(searchText.toLowerCase()));

            setRecords(data);
            setLoading(false);
        }, (error) => {
            console.error('Error fetching records:', error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [category, searchText, searchDate]);

    // Mark the record as "Atendido"
    const markAsServed = async (id) => {
        try {
            const recordRef = doc(db, 'infoRequests', id);
            await updateDoc(recordRef, { served: true });
            alert("Atendido");
        } catch (error) {
            console.error('Error updating document:', error);
        }
    };

    // Delete the record if marked as served
    const deleteRecord = async (id) => {
        try {
            const confirmed = confirm('¿Eliminar?');
            if (confirmed) {
                const recordRef = doc(db, 'infoRequests', id);  // Ensure 'infoRequests' is the correct collection
                await deleteDoc(recordRef);

                // Update UI by removing the deleted record from state
                setRecords((prevRecords) => prevRecords.filter(record => record.id !== id));

                alert("Registro eliminado");
            }
        } catch (error) {
            console.error('Error deleting document:', error);
        }
    };


    if (loading) {
        return <div className="loader"></div>;  // Loading spinner
    }

    return (
        <div>
            {/* Filter Inputs */}
            <div className="filter-container">
                <select className="category-select" value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="">Buscar por categoría</option>
                    <option value="Solicitar una oración">Solicitar una oración</option>
                    <option value="Enviar un comentario de la escuela sabática o predicación">Enviar un comentario</option>
                    <option value="Hacer una pregunta referente a la escuela sabática o predicación">Hacer una pregunta</option>
                    <option value="Enviar saludos">Enviar saludos</option>
                    <option value="Informar una bienvenida">Informar una bienvenida</option>
                    <option value="Solicitar un canto, Himno o Salmo">Solicitar un canto</option>
                </select>

                <input
                    type="text"
                    placeholder="Buscar"
                    className="search-input"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                />

                <input
                    type="date"
                    className="date-input"
                    value={searchDate}
                    onChange={(e) => setSearchDate(e.target.value)}
                />
            </div>

            {/* Records List */}
            <div className="container-requests">
                {records.map((record) => (
                    <div key={record.id} className="record-card">

                        {
                            record.served ?
                                <div className="flex-end">
                                    <button className="served-btn-check">Atendido
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="icon-served">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                        </svg>
                                    </button>
                                </div>
                                :
                                null
                        }
                        <p><strong className='strong'>Fecha:</strong> {new Date(record.createdAt).toLocaleDateString('es-MX', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}</p>
                        <h2 className="record-title">{record.fullName}</h2>
                        <p><strong className='strong'>Motivo:</strong> {record.helpWith}</p>
                        {record.prayerReason && <p><strong className='strong'>Motivo de oración:</strong> {record.prayerReason}</p>}
                        <p><strong className='strong'>Consulta:</strong> {record.query}</p>
                        <p><strong className='strong'>WhatsApp:</strong> {record.whatsapp}</p>
                        <p><strong className='strong'>Miembro de iglesia:</strong> {record.churchMember}</p>
                        {record.locality && <p><strong className='strong'>Localidad:</strong> {record.locality}</p>}
                        {record.residence && <p><strong className='strong'>Residencia:</strong> {record.residence}</p>}

                        <div className="container-flex">

                            {
                                record.served ?
                                    null
                                    :
                                    <button onClick={() => markAsServed(record.id)} className="served-btn">Atender</button>
                            }

                            {/* Show Delete button if "Atendido" */}
                            {record.served && (
                                <button onClick={() => deleteRecord(record.id)} className="delete-btn">
                                    Eliminar
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
