'use client'
import './components.css'
import {useEffect, useMemo, useState} from 'react'
import {collection, onSnapshot, doc, updateDoc, deleteDoc} from 'firebase/firestore'
import {db} from '../lib/firebaseClient'
import {toast, ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import {filtrar, normalizar, porFechaDesc, ORIGENES} from '../lib/registros'

// Deben coincidir exactamente con los valores que envía el formulario de /contacto
const CATEGORIAS = [
    'Solicitar informes',
    'Visitar una localidad',
    'Tienda y compras',
    'Otro asunto',
]

export default function InfoRequests() {
    const [registros, setRegistros] = useState([])
    const [cargando, setCargando] = useState(true)
    const [error, setError] = useState('')
    const [categoria, setCategoria] = useState('')
    const [busqueda, setBusqueda] = useState('')
    const [dia, setDia] = useState('')
    const [soloPendientes, setSoloPendientes] = useState(false)

    // La colección se escucha completa y se filtra en memoria, para que ningún
    // registro quede oculto por venir de una versión anterior del formulario.
    useEffect(() => {
        const unsubscribe = onSnapshot(
            collection(db, 'consult'),
            (snapshot) => {
                try {
                    setRegistros(snapshot.docs.map(normalizar).sort(porFechaDesc))
                    setError('')
                } catch (e) {
                    console.error('Error leyendo las solicitudes:', e)
                    setError('Algunos registros no se pudieron leer: ' + e.message)
                }
                setCargando(false)
            },
            (e) => {
                console.error('Error fetching records:', e)
                setError('No se pudieron cargar las solicitudes: ' + e.message)
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
            await updateDoc(doc(db, 'consult', id), {served: true})
            toast.success('Marcado como atendido')
        } catch (e) {
            console.error('Error updating document:', e)
            toast.error('No se pudo marcar como atendido')
        }
    }

    const eliminar = async (id) => {
        if (!window.confirm('¿Eliminar este registro? No se puede deshacer.')) return
        try {
            await deleteDoc(doc(db, 'consult', id))
            toast.success('Registro eliminado')
        } catch (e) {
            console.error('Error deleting document:', e)
            toast.error('No se pudo eliminar el registro')
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
                <p>Cargando registros...</p>
            </div>
        )
    }

    return (
        <div className="info-request-container">
            <ToastContainer position="top-right" autoClose={3000} />

            <div className="header">
                <h1>Solicitudes de Información</h1>
                <p className="subtitle">
                    {registros.length} en total · {pendientes} sin atender
                </p>
            </div>

            {error && <div className="error-banner">{error}</div>}

            <div className="filter-section">
                <div className="filter-group">
                    <label htmlFor="informes-categoria">Asunto</label>
                    <select
                        id="informes-categoria"
                        className="filter-select"
                        value={categoria}
                        onChange={(e) => setCategoria(e.target.value)}
                    >
                        <option value="">Todos los asuntos</option>
                        {CATEGORIAS.map((valor) => (
                            <option key={valor} value={valor}>
                                {valor}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="filter-group">
                    <label htmlFor="informes-busqueda">Buscar</label>
                    <input
                        id="informes-busqueda"
                        type="text"
                        className="search-input"
                        placeholder="Nombre, WhatsApp, localidad o texto"
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                    />
                </div>

                <div className="filter-group">
                    <label htmlFor="informes-fecha">Fecha</label>
                    <input
                        id="informes-fecha"
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
                                <div className="info-row">
                                    <span className="info-label">Consulta:</span>
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
                        <p>{hayFiltros ? 'Pruebe a limpiar los filtros.' : 'Todavía no se han recibido solicitudes.'}</p>
                    </div>
                )}
            </div>
        </div>
    )
}
