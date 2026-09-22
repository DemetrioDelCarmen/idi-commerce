import { ImagesIcon } from '@sanity/icons'

// Acepta rutas internas ("/tienda", "/rifas/fe-sin-limites", "#contacto") o URLs completas.
const validateHref = (Rule) =>
    Rule.custom((value) => {
        if (!value) return true
        if (/^(\/|#|https?:\/\/|mailto:|tel:)/.test(value)) return true
        return 'Usa una ruta interna que empiece con "/" (ej. /tienda) o una URL completa (https://...)'
    })

const cta = (name, title, description) => ({
    name,
    title,
    type: 'object',
    description,
    options: { collapsible: true, collapsed: false },
    fields: [
        {
            name: 'label',
            title: 'Texto del botón',
            type: 'string',
            validation: (Rule) => Rule.max(32),
        },
        {
            name: 'href',
            title: 'Página de destino',
            type: 'string',
            description: 'Ruta interna (ej. /estudios-biblicos) o URL externa (https://...)',
            validation: validateHref,
        },
        {
            name: 'newTab',
            title: 'Abrir en una pestaña nueva',
            type: 'boolean',
            initialValue: false,
        },
    ],
})

const heroPromo = {
    name: 'heroPromo',
    title: 'Hero promocional',
    type: 'document',
    icon: ImagesIcon,
    groups: [
        { name: 'contenido', title: 'Contenido', default: true },
        { name: 'botones', title: 'Botones' },
        { name: 'cuenta', title: 'Cuenta regresiva' },
        { name: 'publicacion', title: 'Publicación' },
    ],
    fields: [
        {
            name: 'title',
            title: 'Título',
            type: 'string',
            group: 'contenido',
            validation: (Rule) => Rule.required().max(90),
        },
        {
            name: 'eyebrow',
            title: 'Antetítulo',
            type: 'string',
            group: 'contenido',
            description: 'Texto pequeño sobre el título (ej. "Concilio Internacional 2026")',
            validation: (Rule) => Rule.max(48),
        },
        {
            name: 'subtitle',
            title: 'Descripción',
            type: 'text',
            rows: 3,
            group: 'contenido',
            validation: (Rule) => Rule.max(220),
        },
        {
            name: 'verse',
            title: 'Cita bíblica (opcional)',
            type: 'string',
            group: 'contenido',
            description: 'Ej. Isaías 55:6',
        },
        {
            name: 'image',
            title: 'Imagen de fondo',
            type: 'image',
            group: 'contenido',
            description: 'Horizontal, mínimo 2400 × 1350 px. Usa el punto de enfoque para elegir qué parte se conserva en celular.',
            options: { hotspot: true },
            fields: [{ name: 'alt', title: 'Texto alternativo', type: 'string' }],
            validation: (Rule) => Rule.required(),
        },
        {
            name: 'overlay',
            title: 'Intensidad del oscurecido',
            type: 'string',
            group: 'contenido',
            description: 'Sube la intensidad si el texto no se lee bien sobre la imagen.',
            options: {
                list: [
                    { title: 'Suave', value: 'soft' },
                    { title: 'Medio', value: 'medium' },
                    { title: 'Intenso', value: 'strong' },
                ],
                layout: 'radio',
                direction: 'horizontal',
            },
            initialValue: 'medium',
        },
        {
            name: 'align',
            title: 'Alineación del texto',
            type: 'string',
            group: 'contenido',
            options: {
                list: [
                    { title: 'Izquierda', value: 'left' },
                    { title: 'Centro', value: 'center' },
                ],
                layout: 'radio',
                direction: 'horizontal',
            },
            initialValue: 'left',
        },
        cta('primaryCta', 'Botón principal', 'Déjalo vacío si no necesitas botón.'),
        cta('secondaryCta', 'Botón secundario', 'Opcional.'),
        {
            name: 'showCountdown',
            title: 'Mostrar cuenta regresiva',
            type: 'boolean',
            group: 'cuenta',
            description: 'Activa un contador en el hero hasta la fecha y hora de inicio.',
            initialValue: false,
        },
        {
            name: 'countdownDate',
            title: 'Fecha y hora de inicio',
            type: 'datetime',
            group: 'cuenta',
            options: { dateFormat: 'DD/MM/YYYY', timeFormat: 'HH:mm', timeStep: 15 },
            hidden: ({ parent }) => !parent?.showCountdown,
            validation: (Rule) =>
                Rule.custom((value, context) => {
                    if (context.parent?.showCountdown && !value) {
                        return 'Indica la fecha y hora para la cuenta regresiva'
                    }
                    return true
                }),
        },
        {
            name: 'countdownLabel',
            title: 'Texto del contador',
            type: 'string',
            group: 'cuenta',
            initialValue: 'Comienza en',
            hidden: ({ parent }) => !parent?.showCountdown,
        },
        {
            name: 'countdownEndedLabel',
            title: 'Texto cuando la fecha llegue',
            type: 'string',
            group: 'cuenta',
            initialValue: 'Está sucediendo ahora',
            hidden: ({ parent }) => !parent?.showCountdown,
        },
        {
            name: 'isActive',
            title: 'Publicado',
            type: 'boolean',
            group: 'publicacion',
            description: 'Desactívalo para ocultar este hero sin borrarlo.',
            initialValue: true,
        },
        {
            name: 'order',
            title: 'Orden en el carrusel',
            type: 'number',
            group: 'publicacion',
            description: 'Los números menores aparecen primero.',
            initialValue: 1,
        },
        {
            name: 'publishUntil',
            title: 'Ocultar automáticamente después de',
            type: 'datetime',
            group: 'publicacion',
            description: 'Opcional. Útil para retirar el banner cuando termine el evento.',
            options: { dateFormat: 'DD/MM/YYYY', timeFormat: 'HH:mm', timeStep: 15 },
        },
    ],
    orderings: [
        {
            title: 'Orden del carrusel',
            name: 'orderAsc',
            by: [{ field: 'order', direction: 'asc' }],
        },
    ],
    preview: {
        select: {
            title: 'title',
            eyebrow: 'eyebrow',
            media: 'image',
            isActive: 'isActive',
            showCountdown: 'showCountdown',
            order: 'order',
        },
        prepare({ title, eyebrow, media, isActive, showCountdown, order }) {
            const flags = [
                isActive === false ? 'Oculto' : 'Publicado',
                showCountdown ? 'Con cuenta regresiva' : null,
            ].filter(Boolean)
            return {
                title: `${order ?? '–'} · ${title || 'Sin título'}`,
                subtitle: [eyebrow, ...flags].filter(Boolean).join(' · '),
                media,
            }
        },
    },
}

export default heroPromo
