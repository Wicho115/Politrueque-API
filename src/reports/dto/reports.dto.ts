export class CreateReportDTO {
    readonly title: string;
    readonly report_type: number;
    readonly author: string;
    readonly author_id: string;
    readonly content: string;
    readonly reported_user?: string;
    readonly reported_article?: string;
}