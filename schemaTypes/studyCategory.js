export const studyCategory = {
    name: 'studyCategory',
    title: 'Categorías de estudios',
    type: 'document',
    fields: [
        {
            name: 'title',
            type: 'string',
        },
        {
            name: "link",
            title: "Enlace web",
            type: "slug",
            options: {
                source: "title",
                maxLenght: 96
            }
        },
        {
            name: 'description',
            type: 'text',
        },
    ],
}
