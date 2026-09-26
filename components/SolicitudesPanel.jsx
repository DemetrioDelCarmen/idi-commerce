'use client'
import {useCallback, useEffect, useMemo, useState} from 'react'
import {useClient} from 'sanity'
import {
    Badge,
    Box,
    Button,
    Card,
    Checkbox,
    Flex,
    Grid,
    Heading,
    Inline,
    Label,
    Select,
    Spinner,
    Stack,
    Text,
    TextInput,
} from '@sanity/ui'
import {ORIGENES} from '../schemaTypes/solicitudes'

const API_VERSION = '2024-07-23'

const ORIGEN_TITULO = Object.fromEntries(ORIGENES.map((o) => [o.value, o.title]))

const sinAcentos = (valor) =>
    String(valor ?? '')
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .toLowerCase()

/** Día local (no UTC) en formato YYYY-MM-DD, igual que devuelve <input type="date">. */
function diaLocal(fecha) {
    if (!fecha) return ''
    const mes = String(fecha.getMonth() + 1).padStart(2, '0')
    const dia = String(fecha.getDate()).padStart(2, '0')
    return `${fecha.getFullYear()}-${mes}-${dia}`
}

function normalizar(doc) {
    const valor = doc.createdAt || doc._createdAt
    const fecha = valor ? new Date(valor) : null
    const valida = fecha && !Number.isNaN(fecha.getTime()) ? fecha : null
    return {
        ...doc,
        fecha: valida,
        dia: diaLocal(valida),
        etiquetaFecha: valida
            ? `${valida.toLocaleDateString('es-MX', {year: 'numeric', month: 'long', day: 'numeric'})} · ${valida.toLocaleTimeString('es-MX', {hour: '2-digit', minute: '2-digit'})}`
            : 'Sin fecha',
        busqueda: sinAcentos(
            [doc.fullName, doc.whatsapp, doc.query, doc.locality, doc.residence, doc.helpWith, doc.prayerReason].join(
                ' ',
            ),
        ),
    }
}

function Dato({etiqueta, children}) {
    if (!children) return null
    return (
        <Flex gap={2} align="flex-start">
            <Box style={{minWidth: 110}}>
                <Text size={1} weight="semibold" muted>
                    {etiqueta}
                </Text>
            </Box>
            <Box flex={1}>
                <Text size={1} style={{whiteSpace: 'pre-wrap', wordBreak: 'break-word'}}>
                    {children}
                </Text>
            </Box>
        </Flex>
    )
}

/**
 * Panel de consulta de los registros que llegan de los formularios del sitio.
 * Se configura desde structure.js con options: {tipo, titulo, descripcion, categorias, etiquetaCategoria}.
 */
export default function SolicitudesPanel(props) {
    const {
        tipo,
        titulo = 'Registros',
        descripcion = '',
        categorias = [],
        etiquetaCategoria = 'Categoría',
        mostrarMotivoOracion = false,
    } = props.options || {}

    const client = useClient({apiVersion: API_VERSION})
    const [registros, setRegistros] = useState([])
    const [cargando, setCargando] = useState(true)
    const [error, setError] = useState('')
    const [categoria, setCategoria] = useState('')
    const [busqueda, setBusqueda] = useState('')
    const [desde, setDesde] = useState('')
    const [hasta, setHasta] = useState('')
    const [soloPendientes, setSoloPendientes] = useState(false)
    const [ocupado, setOcupado] = useState('')

    const consulta = useMemo(
        () => `*[_type == $tipo] | order(coalesce(createdAt, _createdAt) desc)`,
        [],
    )

    const cargar = useCallback(async () => {
        try {
            const datos = await client.fetch(consulta, {tipo})
            setRegistros(datos.map(normalizar))
            setError('')
        } catch (e) {
            console.error('Error cargando los registros:', e)
            setError('No se pudieron cargar los registros: ' + e.message)
        } finally {
            setCargando(false)
        }
    }, [client, consulta, tipo])

    // Carga inicial y actualización en vivo cuando llega un registro nuevo
    useEffect(() => {
        cargar()
        const suscripcion = client
            .listen(consulta, {tipo}, {visibility: 'query'})
            .subscribe({next: () => cargar(), error: (e) => console.error('Error en la escucha:', e)})
        return () => suscripcion.unsubscribe()
    }, [client, consulta, tipo, cargar])

    const visibles = useMemo(() => {
        const termino = sinAcentos(busqueda).trim()
        return registros.filter((registro) => {
            if (categoria && registro.helpWith !== categoria) return false
            if (soloPendientes && registro.served) return false
            if (desde && (!registro.dia || registro.dia < desde)) return false
            if (hasta && (!registro.dia || registro.dia > hasta)) return false
            if (termino && !registro.busqueda.includes(termino)) return false
            return true
        })
    }, [registros, categoria, busqueda, desde, hasta, soloPendientes])

    const pendientes = useMemo(() => registros.filter((r) => !r.served).length, [registros])
    const hayFiltros = Boolean(categoria || busqueda || desde || hasta || soloPendientes)

    const limpiarFiltros = () => {
        setCategoria('')
        setBusqueda('')
        setDesde('')
        setHasta('')
        setSoloPendientes(false)
    }

    const rangoRapido = (dias) => {
        const hoy = new Date()
        const inicio = new Date()
        inicio.setDate(hoy.getDate() - dias)
        setDesde(diaLocal(dias === 0 ? hoy : inicio))
        setHasta(diaLocal(hoy))
    }

    const cambiarAtendida = async (registro) => {
        setOcupado(registro._id)
        try {
            await client.patch(registro._id).set({served: !registro.served}).commit()
            await cargar()
        } catch (e) {
            console.error('Error actualizando el registro:', e)
            setError('No se pudo actualizar: ' + e.message)
        } finally {
            setOcupado('')
        }
    }

    const eliminar = async (registro) => {
        if (!window.confirm(`¿Eliminar el registro de ${registro.fullName || 'sin nombre'}? No se puede deshacer.`))
            return
        setOcupado(registro._id)
        try {
            await client.delete(registro._id)
            await cargar()
        } catch (e) {
            console.error('Error eliminando el registro:', e)
            setError('No se pudo eliminar: ' + e.message)
        } finally {
            setOcupado('')
        }
    }

    if (cargando) {
        return (
            <Flex align="center" justify="center" padding={6} gap={3}>
                <Spinner muted />
                <Text muted>Cargando registros…</Text>
            </Flex>
        )
    }

    return (
        <Box padding={4} style={{maxWidth: 1200, margin: '0 auto'}}>
            <Stack space={4}>
                <Stack space={2}>
                    <Heading size={3}>{titulo}</Heading>
                    <Text size={1} muted>
                        {descripcion ? `${descripcion} · ` : ''}
                        {registros.length} en total · {pendientes} sin atender
                    </Text>
                </Stack>

                {error && (
                    <Card padding={3} radius={2} tone="critical" border>
                        <Text size={1}>{error}</Text>
                    </Card>
                )}

                {/* Filtros */}
                <Card padding={3} radius={3} tone="transparent" border>
                    <Stack space={3}>
                        <Grid columns={[1, 1, 3]} gap={3}>
                            {categorias.length > 0 && (
                                <Stack space={2}>
                                    <Label size={1} muted>
                                        {etiquetaCategoria}
                                    </Label>
                                    <Select value={categoria} onChange={(e) => setCategoria(e.currentTarget.value)}>
                                        <option value="">Todas</option>
                                        {categorias.map((valor) => (
                                            <option key={valor} value={valor}>
                                                {valor}
                                            </option>
                                        ))}
                                    </Select>
                                </Stack>
                            )}

                            <Stack space={2}>
                                <Label size={1} muted>
                                    Desde
                                </Label>
                                <TextInput
                                    type="date"
                                    value={desde}
                                    max={hasta || undefined}
                                    onChange={(e) => setDesde(e.currentTarget.value)}
                                />
                            </Stack>

                            <Stack space={2}>
                                <Label size={1} muted>
                                    Hasta
                                </Label>
                                <TextInput
                                    type="date"
                                    value={hasta}
                                    min={desde || undefined}
                                    onChange={(e) => setHasta(e.currentTarget.value)}
                                />
                            </Stack>
                        </Grid>

                        <Stack space={2}>
                            <Label size={1} muted>
                                Buscar
                            </Label>
                            <TextInput
                                placeholder="Nombre, WhatsApp, localidad o texto del mensaje"
                                value={busqueda}
                                onChange={(e) => setBusqueda(e.currentTarget.value)}
                            />
                        </Stack>

                        <Flex align="center" gap={2} wrap="wrap">
                            <Button mode="ghost" text="Hoy" fontSize={1} padding={2} onClick={() => rangoRapido(0)} />
                            <Button
                                mode="ghost"
                                text="Últimos 7 días"
                                fontSize={1}
                                padding={2}
                                onClick={() => rangoRapido(7)}
                            />
                            <Button
                                mode="ghost"
                                text="Últimos 30 días"
                                fontSize={1}
                                padding={2}
                                onClick={() => rangoRapido(30)}
                            />
                            <Flex align="center" gap={2} paddingLeft={3}>
                                <Checkbox
                                    id="solo-pendientes"
                                    checked={soloPendientes}
                                    onChange={(e) => setSoloPendientes(e.currentTarget.checked)}
                                />
                                <Label htmlFor="solo-pendientes" size={1}>
                                    Solo sin atender
                                </Label>
                            </Flex>
                            <Box flex={1} />
                            {hayFiltros && (
                                <Button
                                    mode="bleed"
                                    tone="critical"
                                    text="Limpiar filtros"
                                    fontSize={1}
                                    padding={2}
                                    onClick={limpiarFiltros}
                                />
                            )}
                        </Flex>
                    </Stack>
                </Card>

                <Text size={1} muted>
                    {visibles.length} {visibles.length === 1 ? 'registro encontrado' : 'registros encontrados'}
                </Text>

                {/* Registros */}
                {visibles.length > 0 ? (
                    <Grid columns={[1, 1, 2]} gap={3}>
                        {visibles.map((registro) => (
                            <Card
                                key={registro._id}
                                padding={4}
                                radius={3}
                                border
                                tone={registro.served ? 'transparent' : 'default'}
                            >
                                <Stack space={4}>
                                    <Flex align="flex-start" gap={3}>
                                        <Stack space={2} flex={1}>
                                            <Heading size={1}>{registro.fullName || 'Sin nombre'}</Heading>
                                            <Text size={1} muted>
                                                {registro.etiquetaFecha}
                                            </Text>
                                        </Stack>
                                        <Inline space={2}>
                                            {registro.served ? (
                                                <Badge tone="positive">Atendida</Badge>
                                            ) : (
                                                <Badge tone="caution">Pendiente</Badge>
                                            )}
                                        </Inline>
                                    </Flex>

                                    <Stack space={3}>
                                        <Dato etiqueta={etiquetaCategoria}>{registro.helpWith}</Dato>
                                        {mostrarMotivoOracion && (
                                            <Dato etiqueta="Motivo de oración">{registro.prayerReason}</Dato>
                                        )}
                                        <Dato etiqueta="Mensaje">{registro.query}</Dato>
                                        <Dato etiqueta="WhatsApp">
                                            {registro.whatsapp ? (
                                                <a
                                                    href={`https://wa.me/${String(registro.whatsapp).replace(/\D/g, '')}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    {registro.whatsapp}
                                                </a>
                                            ) : null}
                                        </Dato>
                                        <Dato etiqueta="Miembro">{registro.churchMember}</Dato>
                                        <Dato etiqueta="Localidad">{registro.locality}</Dato>
                                        <Dato etiqueta="Residencia">{registro.residence}</Dato>
                                        <Dato etiqueta="Origen">
                                            {ORIGEN_TITULO[registro.source] || registro.source}
                                        </Dato>
                                        <Dato etiqueta="Notas">{registro.notes}</Dato>
                                    </Stack>

                                    <Flex gap={2}>
                                        <Button
                                            mode="ghost"
                                            tone={registro.served ? 'default' : 'positive'}
                                            fontSize={1}
                                            padding={3}
                                            disabled={ocupado === registro._id}
                                            text={registro.served ? 'Marcar como pendiente' : 'Marcar como atendida'}
                                            onClick={() => cambiarAtendida(registro)}
                                        />
                                        <Box flex={1} />
                                        <Button
                                            mode="bleed"
                                            tone="critical"
                                            fontSize={1}
                                            padding={3}
                                            disabled={ocupado === registro._id}
                                            text="Eliminar"
                                            onClick={() => eliminar(registro)}
                                        />
                                    </Flex>
                                </Stack>
                            </Card>
                        ))}
                    </Grid>
                ) : (
                    <Card padding={5} radius={3} tone="transparent" border>
                        <Stack space={3}>
                            <Text align="center" weight="semibold">
                                No se encontraron registros
                            </Text>
                            <Text align="center" size={1} muted>
                                {hayFiltros
                                    ? 'Pruebe a limpiar los filtros o a ampliar el rango de fechas.'
                                    : 'Todavía no se ha recibido ninguno.'}
                            </Text>
                        </Stack>
                    </Card>
                )}
            </Stack>
        </Box>
    )
}
