'use client'
import './components.css'
import {useEffect, useMemo, useState} from 'react'
import {collection, onSnapshot, doc, updateDoc, deleteDoc} from 'firebase/firestore'
import {db} from '../lib/firebaseClient'
import {filtrar, normalizar, porFechaDesc, ORIGENES} from '../lib/registros'

// Deben coincidir exactamente con los valores que envía el formulario de /peticiones
const CATEGORIAS = [
    'Solicitar una oración',
    'Solicitar un canto, Himno o Salmo',
    'Enviar saludos',
    'Informar una bienvenida',
    'Hacer una pregunta referente a la escuela sabática o predicación',
    'Enviar un comentario de la escuela sabática o predicación',
]

export default function Requests() {
    const [registros, setRegistros] = useState([])
    const [cargando, setCargando] = useState(true)
    const [error, setError] = useState('')
    const [categoria, setCategoria] = useState('')
    const [busqueda, setBusqueda] = useState('')
    const [dia, setDia] = useState('')
    const [soloPendientes, setSoloPendientes] = useState(false)

    // Se escucha la colección completa y se filtra en memoria: así ningún registro
    // queda fuera por venir sin fecha o sin categoría, y no hacen falta índices.
    useEffect(() => {
        const unsubscribe = onSnapshot(
            collection(db, 'infoRequests'),
            (snapshot) => {
                try {
                    setRegistros(snapshot.docs.map(normalizar).sort(porFechaDesc))
                    setError('')
                } catch (e) {
                    console.error('Error leyendo las peticiones:', e)
                    setError('Algunos registros no se pudieron leer: ' + e.message)
                }
                setCargando(false)
            },
            (e) => {
                console.error('Error fetching records:', e)
                setError('No se pudieron cargar las peticiones: ' + e.message)
                setCargando(false)
            },
        )
        return () => unsubscribe()
    }, [])

    const visibles = useMemo(
        () => filtrar(registros, {categoria, busqueda, dia, soloPendientes}),
        [registros, categoria, busqueda, dia, soloPendientes],
    )
    const pendientes = useMemo(() => registros.filter((r) => !r.served).length, [registros])
    const hayFiltros = Boolean(categoria || busqueda || dia || soloPendientes)

    const marcarAtendido = async (id) => {
        try {
            await updateDoc(doc(db, 'infoRequests', id), {served: true})
        } catch (e) {
            console.error('Error updating document:', e)
            alert('No se pudo marcar como atendido: ' + e.message)
        }
    }

    const eliminar = async (id) => {
        if (!window.confirm('¿Eliminar esta petición? No se puede deshacer.')) return
        try {
            await deleteDoc(doc(db, 'infoRequests', id))
        } catch (e) {
            console.error('Error deleting document:', e)
            alert('No se pudo eliminar: ' + e.message)
        }
    }

    const limpiarFiltros = () => {
        setCategoria('')
        setBusqueda('')
        setDia('')
        setSoloPendientes(false)
    }

    if (cargando) {
        return (
            <div className="loading-container">
                <div className="loader"></div>
                <p>Cargando peticiones...</p>
            </div>
        )
    }

    return (
        <div className="info-request-container">
            <div className="header">
                <h1>Peticiones</h1>
                <p className="subtitle">
                    {registros.length} en total · {pendientes} sin atender
                </p>
            </div>

            {error && <div className="error-banner">{error}</div>}

            <div className="filter-section">
                <div className="filter-group">
                    <label htmlFor="peticiones-categoria">Categoría</label>
                    <select
                        id="peticiones-categoria"
                        className="filter-select"
                        value={categoria}
                        onChange={(e) => setCategoria(e.target.value)}
                    >
                        <option value="">Todas las categorías</option>
                        {CATEGORIAS.map((valor) => (
                            <option key={valor} value={valor}>
                                {valor}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="filter-group">
                    <label htmlFor="peticiones-busqueda">Buscar</label>
                    <input
                        id="peticiones-busqueda"
                        type="text"
                        className="search-input"
                        placeholder="Nombre, WhatsApp, localidad o texto"
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                    />
                </div>

                <div className="filter-group">
                    <label htmlFor="peticiones-fecha">Fecha</label>
                    <input
                        id="peticiones-fecha"
                        type="date"
                        className="date-input"
                        value={dia}
                        onChange={(e) => setDia(e.target.value)}
                    />
                </div>

                <label className="filter-check">
                    <input
                        type="checkbox"
                        checked={soloPendientes}
                        onChange={(e) => setSoloPendientes(e.target.checked)}
                    />
                    Solo sin atender
                </label>

                {hayFiltros && (
                    <button type="button" className="clear-filters" onClick={limpiarFiltros}>
                        Limpiar filtros
                    </button>
                )}
            </div>

            <div className="results-info">
                <p>
                    {visibles.length} {visibles.length === 1 ? 'registro encontrado' : 'registros encontrados'}
                </p>
            </div>

            <div className="records-grid">
                {visibles.length > 0 ? (
                    visibles.map((registro) => (
                        <div key={registro.id} className={`record-card ${registro.served ? 'served' : ''}`}>
                            <div className="card-header">
                                <div className="user-info">
                                    <h2 className="record-title">{registro.fullName}</h2>
                                    <p className="record-date">{registro.etiquetaFecha}</p>
                                </div>
                                {registro.served && <span className="served-badge">Atendido</span>}
                            </div>

                            <div className="card-content">
                                {registro.helpWith && (
                                    <div className="info-row">
                                        <span className="info-label">Motivo:</span>
                                        <span className="info-value">{registro.helpWith}</span>
                                    </div>
                                )}
                                {registro.prayerReason && (
                                    <div className="info-row">
                                        <span className="info-label">Motivo de oración:</span>
                                        <span className="info-value">{registro.prayerReason}</span>
                                    </div>
                                )}
                                <div className="info-row">
                                    <span className="info-label">Petición:</span>
                                    <span className="info-value">{registro.query || '—'}</span>
                                </div>
                                <div className="info-row">
                                    <span className="info-label">WhatsApp:</span>
                                    <span className="info-value">
                                        {registro.whatsapp ? (
                                            <a
                                                href={`https://wa.me/${registro.whatsapp.replace(/\D/g, '')}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                {registro.whatsapp}
                                            </a>
                                        ) : (
                                            '—'
                                        )}
                                    </span>
                                </div>
                                {registro.churchMember && (
                                    <div className="info-row">
                                        <span className="info-label">Miembro:</span>
                                        <span className="info-value">{registro.churchMember}</span>
                                    </div>
                                )}
                                {registro.locality && (
                                    <div className="info-row">
                                        <span className="info-label">Localidad:</span>
                                        <span className="info-value">{registro.locality}</span>
                                    </div>
                                )}
                                {registro.residence && (
                                    <div className="info-row">
                                        <span className="info-label">Residencia:</span>
                                        <span className="info-value">{registro.residence}</span>
                                    </div>
                                )}
                                {registro.source && (
                                    <div className="info-row">
                                        <span className="info-label">Origen:</span>
                                        <span className="info-value">
                                            {ORIGENES[registro.source] || registro.source}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className="card-actions">
                                {!registro.served ? (
                                    <button
                                        type="button"
                                        className="action-btn serve-btn"
                                        onClick={() => marcarAtendido(registro.id)}
                                    >
                                        Marcar como atendido
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        className="action-btn delete-btn"
                                        onClick={() => eliminar(registro.id)}
                                    >
                                        Eliminar registro
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="no-results">
                        <h3>No se encontraron registros</h3>
                        <p>
                            {hayFiltros ? 'Pruebe a limpiar los filtros.' : 'Todavía no se han recibido peticiones.'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}
