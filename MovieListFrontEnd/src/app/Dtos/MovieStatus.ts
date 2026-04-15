export class MovieStatus {
  constructor(
    public id: number,
    public watched: boolean = false,
    public rating: number | null = null,
    public comment: string | null = null
  ) {}
}