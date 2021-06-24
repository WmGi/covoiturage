export class Trip {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public imageUrl: string,
    public price: number,
    public availableFrom: Date,
    public userId: string,
    public tel: number,
    public heure: Date,
    public nombreplace: number,
    public depart: string,
    public arrivee: string,
    public conduit: string,



  ) {}
}
