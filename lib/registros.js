// Utilidades compartidas por los paneles "Peticiones" (infoRequests) y
// "Solicitudes de Informes" (consult).
//
// Los registros llegan desde el sitio web y de versiones anteriores del formulario,
// así que aquí se leen de forma defensiva: un campo faltante nunca debe romper el panel.

export const texto = (valor) => (typeof valor === 'string' ? valor : valor == null ? '' : String(valor))

/** Acepta createdAtMs (número), Timestamp de Firestore, número o cadena ISO. */
export function fechaDe(datos) {
    if (typeof datos.createdAtMs === 'number') return new Date(datos.createdAtMs)

    const valor = datos.createdAt
    if (valor && typeof valor.toDate === 'function') return valor.toDate()
    if (typeof valor === 'number') return new Date(valor)

    const fecha = new Date(texto(valor))
    return Number.isNaN(fecha.getTime()) ? null : fecha
}

export const fechaLarga = (fecha) =>
    fecha
        ? fecha.toLocaleDateString('es-MX', {year: 'numeric', month: 'long', day: 'numeric'}) +
          ' · ' +
          fecha.toLocaleTimeString('es-MX', {hour: '2-digit', minute: '2-digit'})
        : 'Sin fecha'

/** Día local (no UTC) en formato YYYY-MM-DD, igual que devuelve <input type="date">. */
export function diaLocal(fecha) {
    if (!fecha) return ''
    const mes = String(fecha.getMonth() + 1).padStart(2, '0')
    const dia = String(fecha.getDate()).padStart(2, '0')
    return `${fecha.getFullYear()}-${mes}-${dia}`
}

const sinAcentos = (valor) =>
    texto(valor)
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .toLowerCase()

/** Convierte un documento de Firestore en un registro seguro de renderizar. */
export function normalizar(doc) {
    const datos = doc.data() || {}
    const fecha = fechaDe(datos)
    return {
        ...datos,
        id: doc.id,
        fullName: texto(datos.fullName) || 'Sin nombre',
        helpWith: texto(datos.helpWith),
        prayerReason: texto(datos.prayerReason),
        query: texto(datos.query),
        whatsapp: texto(datos.whatsapp),
        churchMember: texto(datos.churchMember),
        locality: texto(datos.locality),
        residence: texto(datos.residence),
        source: texto(datos.source),
        served: datos.served === true,
        fecha,
        dia: diaLocal(fecha),
        etiquetaFecha: fechaLarga(fecha),
        busqueda: sinAcentos(
            [datos.fullName, datos.whatsapp, datos.query, datos.locality, datos.residence, datos.helpWith].join(' '),
        ),
    }
}

/** Ordena del más reciente al más antiguo; los que no tienen fecha quedan al final. */
export const porFechaDesc = (a, b) => (b.fecha ? b.fecha.getTime() : -Infinity) - (a.fecha ? a.fecha.getTime() : -Infinity)

/** Todos los filtros se aplican en memoria: se combinan entre sí y nunca esconden registros incompletos. */
export function filtrar(registros, {categoria = '', busqueda = '', dia = '', soloPendientes = false} = {}) {
    const termino = sinAcentos(busqueda).trim()
    return registros.filter((registro) => {
        if (categoria && registro.helpWith !== categoria) return false
        if (dia && registro.dia !== dia) return false
        if (soloPendientes && registro.served) return false
        if (termino && !registro.busqueda.includes(termino)) return false
        return true
    })
}

export const ORIGENES = {
    peticiones: 'Página de peticiones',
    contacto: 'Página de contacto',
    inicio: 'Formulario del inicio',
    rifas: 'Página de rifas',
}
