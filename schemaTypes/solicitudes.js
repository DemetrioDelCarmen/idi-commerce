// Registros que llegan desde los formularios del sitio (peticiones, contacto e inicio).
// Se guardan como documentos de Sanity; el sitio los crea a través de /api/solicitudes.
// En el Studio solo se consultan: los campos del formulario son de solo lectura y
// lo único editable es el seguimiento interno (atendida y notas).

export const MOTIVOS_PETICION = [
    'Solicitar una oración',
    'Solicitar un canto, Himno o Salmo',
    'Enviar saludos',
    'Informar una bienvenida',
    'Hacer una pregunta referente a la escuela sabática o predicación',
    'Enviar un comentario de la escuela sabática o predicación',
]

export const MOTIVOS_ORACION = ['Petición de Salud', 'Petición General', 'Agradecimientos']

export const ASUNTOS_INFORME = [
    'Solicitar informes',
    'Visitar una localidad',
    'Tienda y compras',
    'Otro asunto',
]

export const ORIGENES = [
    {title: 'Página de peticiones', value: 'peticiones'},
    {title: 'Página de contacto', value: 'contacto'},
    {title: 'Formulario del inicio', value: 'inicio'},
    {title: 'Página de rifas', value: 'rifas'},
]

const soloLectura = (campo) => ({...campo, readOnly: true})

const camposComunes = [
    soloLectura({name: 'fullName', title: 'Nombre', type: 'string'}),
    soloLectura({name: 'whatsapp', title: 'WhatsApp', type: 'string'}),
    soloLectura({name: 'churchMember', title: '¿Pertenece a la iglesia?', type: 'string'}),
    soloLectura({name: 'locality', title: 'Localidad', type: 'string'}),
    soloLectura({name: 'residence', title: 'Residencia', type: 'string'}),
    soloLectura({name: 'query', title: 'Mensaje', type: 'text', rows: 5}),
    soloLectura({name: 'privacyAccepted', title: 'Aceptó el aviso de privacidad', type: 'boolean'}),
    soloLectura({
        name: 'source',
        title: 'Origen',
        type: 'string',
        options: {list: ORIGENES},
    }),
    soloLectura({name: 'createdAt', title: 'Fecha de envío', type: 'datetime'}),
    {name: 'served', title: 'Atendida', type: 'boolean', initialValue: false},
    {name: 'notes', title: 'Notas internas', type: 'text', rows: 3},
]

const ordenamientos = [
    {
        title: 'Más recientes primero',
        name: 'recientes',
        by: [{field: 'createdAt', direction: 'desc'}],
    },
    {
        title: 'Más antiguas primero',
        name: 'antiguas',
        by: [{field: 'createdAt', direction: 'asc'}],
    },
]

const vistaPrevia = (campoMotivo) => ({
    select: {title: 'fullName', motivo: campoMotivo, fecha: 'createdAt', served: 'served'},
    prepare({title, motivo, fecha, served}) {
        const dia = fecha
            ? new Date(fecha).toLocaleDateString('es-MX', {day: 'numeric', month: 'short', year: 'numeric'})
            : 'Sin fecha'
        return {
            title: `${served ? '✓ ' : ''}${title || 'Sin nombre'}`,
            subtitle: [dia, motivo].filter(Boolean).join(' · '),
        }
    },
})

export const peticion = {
    name: 'peticion',
    title: 'Petición',
    type: 'document',
    fields: [
        soloLectura({
            name: 'helpWith',
            title: 'Motivo',
            type: 'string',
            options: {list: MOTIVOS_PETICION},
        }),
        soloLectura({
            name: 'prayerReason',
            title: 'Motivo de oración',
            type: 'string',
            options: {list: MOTIVOS_ORACION},
        }),
        ...camposComunes,
    ],
    orderings: ordenamientos,
    preview: vistaPrevia('helpWith'),
}

export const solicitudInforme = {
    name: 'solicitudInforme',
    title: 'Solicitud de informes',
    type: 'document',
    fields: [
        soloLectura({
            name: 'helpWith',
            title: 'Asunto',
            type: 'string',
            options: {list: ASUNTOS_INFORME},
        }),
        ...camposComunes,
    ],
    orderings: ordenamientos,
    preview: vistaPrevia('helpWith'),
}
