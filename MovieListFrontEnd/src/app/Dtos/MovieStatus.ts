export class MovieStatus {
  constructor(
    public Id: number,
    public Watched: boolean = false,
    public Rating: number | null = null,
    public Comment: string | null = null
  ) {}
}