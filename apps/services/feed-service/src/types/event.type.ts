export interface Event {
    eventId: string;
    createdAt: Date;

    // autor do evento
    authorId: string;
    authorUsername: string;
    authorProfilePicture?: string;
    authorVerified: boolean;

    // estabelecimento relacionado (opcional)
    establishmentId?: string;
    establishmentName?: string;
    establishmentLogo?: string;
    establishmentCategory?: string;

    // dados do evento
    title: string;
    banner: string;
    lineup?: string[];
    date: Date;
    location: string;
    organizerName: string;
    organizerLogo?: string;

    // estatísticas
    totalConfirmed: number;

    // controle
    isDeleted: boolean;
    updatedAt?: Date;
}