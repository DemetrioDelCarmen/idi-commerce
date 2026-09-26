import Statistics from "./components/Statistics"
import { ChartUpwardIcon } from '@sanity/icons'
import { CommentIcon } from '@sanity/icons'
import { BarChartIcon } from '@sanity/icons'
import { OlistIcon } from '@sanity/icons'
import { BookIcon } from '@sanity/icons'
import Requests from "./components/Requests"
import { EarthAmericasIcon } from '@sanity/icons'
import { HomeIcon } from '@sanity/icons'
import { PinIcon } from '@sanity/icons'
import { AsteriskIcon } from '@sanity/icons'
import { ImagesIcon } from '@sanity/icons'
import InfoRequests from "./components/InfoRequests"
import SolicitudesPanel from "./components/SolicitudesPanel"
import { ASUNTOS_INFORME, MOTIVOS_PETICION } from "./schemaTypes/solicitudes"
import LiveStreamControl from "./components/LiveStreamControl"
// src/structure.js
export const structure = (S) =>
    S.list()
        .title('Panel de administración eCommerce y Sitio Web')
        .items([
            S.listItem()
                .title('Control de Transmisión En Vivo')
                .icon(AsteriskIcon)
                .child(
                    S.component()
                        .id("liveStream")
                        .component(LiveStreamControl)
                ),
            S.divider(),
            S.listItem()
                .title('Hero promocional del inicio')
                .icon(ImagesIcon)
                .schemaType('heroPromo')
                .child(
                    S.documentTypeList('heroPromo')
                        .title('Heros del inicio')
                        .defaultOrdering([{ field: 'order', direction: 'asc' }])
                ),
            S.divider(),
            S.listItem()
                .title('Literatura')
                .child(
                    S.list()
                        .title("Cuadernos digitales")
                        .items([
                            S.listItem()
                                .title('Cuadernos en venta')
                                .schemaType('book')
                                .child(S.documentTypeList('book').title('Cuadernos')),
                            S.listItem()
                                .title('Cuadernos y contenido')
                                .schemaType('book')
                                .child(
                                    S.documentTypeList('book')
                                        .title('Cuadernos')
                                        .child(bookId =>
                                            S.documentList()
                                                .title('Temas y Contenido')
                                                .schemaType('contentThemesBook')
                                                .filter('_type == "contentThemesBook" && associatedBook == $bookId')
                                                .params({ bookId })
                                        )
                                ),
                            S.listItem()
                                .title('Categorías de cuadernos')
                                .schemaType('studyCategory')
                                .child(S.documentTypeList('studyCategory').title('Categorías de estudios')),
                        ])
                ),
            S.divider(),
            S.listItem()
                .title('Cultura')
                .schemaType('culturaPost')
                .child(S.documentTypeList('culturaPost').title('Sección de cultura')),
            S.divider(),
            S.listItem()
                .title('Sociedades')
                .icon(EarthAmericasIcon)
                .child(
                    S.list()
                        .title('Administración')
                        .items([
                            S.listItem()
                                .title('Varonil')
                                .icon(AsteriskIcon)
                                .child(S.documentTypeList('varonilPost').title('Sociedad Varonil')),
                            S.listItem()
                                .title('Juvenil')
                                .icon(AsteriskIcon)
                                .child(S.documentTypeList('juvenilPost').title('Sociedad Juvenil')),
                            S.listItem()
                                .title('Adolescentes')
                                .icon(AsteriskIcon)
                                .child(S.documentTypeList('adolescentesPost').title('Sociedad Adolescentes')),
                            S.listItem()
                                .title('Femenil')
                                .icon(AsteriskIcon)
                                .child(S.documentTypeList('femenilPost').title('Sociedad Femenil')),
                            S.listItem()
                                .title('Infantil')
                                .icon(AsteriskIcon)
                                .child(S.documentTypeList('infantilPost').title('Sociedad Infantil')),
                        ])
                ),
            S.divider(),


            S.listItem()
                .title('Varonil')
                .schemaType('varonilPost')
                .child(S.documentTypeList('varonilPost').title('Sección varonil')),
            S.divider(),
            S.listItem()
                .title('Blog de Estudios Bíblicos')
                .schemaType('blog')
                .child(S.documentTypeList('blog').title('Blog de Estudios Bíblicos')),
            S.divider(),
            S.listItem()
                .title('Eventos')
                .schemaType('event')
                .child(S.documentTypeList('event').title('Eventos')),
            S.divider(),
            S.listItem()
                .title('Actividades Locales')
                .schemaType('localEvents')
                .child(S.documentTypeList('localEvents').title('Actividades Locales')),
            S.divider(),
            S.listItem()
                .title('Localidades y Países')
                .icon(EarthAmericasIcon)
                .child(
                    S.list()
                        .title('Administración')
                        .items([
                            S.listItem()
                                .title('Localidades')
                                .icon(PinIcon)
                                .child(S.documentTypeList('localities').title('Localidades')),
                            S.listItem()
                                .title('Países')
                                .icon(EarthAmericasIcon)
                                .schemaType('country')
                                .child(S.documentTypeList('country').title('Países')),
                        ])
                ),
            S.divider(),
            S.listItem()
                .title('Notificaciones Generales')
                .schemaType('notifications')
                .child(S.documentTypeList('notifications').title('Notificaciones Generales')),
            S.divider(),
            S.listItem()
                .title('Departamentos Internacionales')
                .schemaType('globalDepartment')
                .child(S.documentTypeList('globalDepartment').title('Departamentos internacionales')),
            S.divider(),
            S.listItem()
                .title('Estudios Bíblicos')
                .child(
                    S.list()
                        .title('Estudios Bíblicos')
                        .items([
                            S.listItem()
                                .title('Estudios')
                                .icon(BookIcon)
                                .schemaType('biblicalStudy')
                                .child(S.documentTypeList('biblicalStudy').title('Estudios Bíblicos')),
                            S.listItem()
                                .title('Puntos de Fe')
                                .icon(OlistIcon)
                                .schemaType('faitPoints')
                                .child(S.documentTypeList('faitPoints').title('Puntos de Fe')),
                            S.listItem()
                                .title('Categorías')
                                .schemaType('studyCategory')
                                .child(S.documentTypeList('studyCategory').title('Categorías de estudios')),
                        ])
                ),
            S.divider(),
            S.listItem()
                .title('Informes y estadísticas')
                .icon(ChartUpwardIcon)
                .child(
                    S.list()
                        .title('Administración')
                        .items([
                            S.listItem()
                                .title('Informe de ventas')
                                .icon(BarChartIcon)
                                .child(
                                    S.component()
                                        .id('salesDashboard')
                                        .title('Sales Dashboard')
                                        .component(Statistics)
                                ),
                            S.listItem()
                                .title('Registrar venta')
                                .schemaType('sales')
                                .child(S.documentTypeList('sales').title('Sales')),
                        ])
                ),
            S.divider(),
            S.listItem()
                .title('Peticiones')
                .icon(CommentIcon)
                .child(
                    S.component()
                        .id("peticiones")
                        .title('Peticiones')
                        .options({
                            tipo: 'peticion',
                            titulo: 'Peticiones',
                            descripcion: 'Enviadas desde la página de peticiones',
                            categorias: MOTIVOS_PETICION,
                            etiquetaCategoria: 'Motivo',
                            mostrarMotivoOracion: true,
                        })
                        .component(SolicitudesPanel)
                ),
            S.divider(),
            S.listItem()
                .title('Solicitudes de Informes')
                .icon(CommentIcon)
                .child(
                    S.component()
                        .id("solicitudesInformes")
                        .title('Solicitudes de Informes')
                        .options({
                            tipo: 'solicitudInforme',
                            titulo: 'Solicitudes de Informes',
                            descripcion: 'Enviadas desde contacto y el formulario del inicio',
                            categorias: ASUNTOS_INFORME,
                            etiquetaCategoria: 'Asunto',
                        })
                        .component(SolicitudesPanel)
                ),
            S.divider(),
            // Registros anteriores a la migración a Sanity; siguen en Firebase, solo consulta
            S.listItem()
                .title('Histórico en Firebase')
                .icon(CommentIcon)
                .child(
                    S.list()
                        .title('Registros anteriores')
                        .items([
                            S.listItem()
                                .title('Peticiones (histórico)')
                                .icon(CommentIcon)
                                .child(S.component().id("requests").component(Requests)),
                            S.listItem()
                                .title('Solicitudes de Informes (histórico)')
                                .icon(CommentIcon)
                                .child(S.component().id("infoRequests").component(InfoRequests)),
                        ])
                )
        ])
