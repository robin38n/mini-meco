import { Reader } from "../Serializer/Reader";
import { Serializable } from "../Serializer/Serializable";
import { Writer } from "../Serializer/Writer";

export class DeliveryDate implements Serializable {
  protected id: number;
  protected deliveryDate: Date = new Date();

  constructor(id: number) {
    this.id = id;
  }

  public getId(): number {
    return this.id;
  }

  public getDeliveryDate(): Date {
    return this.deliveryDate;
  }

  public setId(id: number) {
    this.id = id;
  }

  public setDeliveryDate(deliveryDate: Date) {
    this.deliveryDate = deliveryDate;
  }
  
  readFrom(reader: Reader): void {
    this.deliveryDate = reader.readDateTime("deliveryDate") ?? this.deliveryDate;
  }
  
  writeTo(writer: Writer): void {
    writer.writeNumber("id", this.id);
    writer.writeDateTime("deliveryDate", this.deliveryDate);
  }
}

export class CourseSchedule implements Serializable {
  protected id: number;
  protected startDate: Date = new Date();
  protected endDate: Date = new Date();
  protected deliveryDates: DeliveryDate[] = [];
  
  constructor(id: number) {
    this.id = id;
  }

  public getId(): number {
    return this.id;
  }

  public getStartDate(): Date {
    return this.startDate;
  }

  public getEndDate(): Date {
    return this.endDate;
  }

  public getDeliveryDates(): DeliveryDate[] {
    return this.deliveryDates;
  }

  public setId(id: number) {
    this.id = id;
  }

  public setStartDate(startDate: Date) {
    this.startDate = startDate;
  }

  public setEndDate(endDate: Date) {
    this.endDate = endDate;
  }

  public setDeliveryDates(deliveryDates: DeliveryDate[]) {
    this.deliveryDates = deliveryDates;
  }
  
  async readFrom(reader: Reader): Promise<void> {
    this.startDate = reader.readDateTime("startDate") ?? this.startDate;
    this.endDate = reader.readDateTime("endDate") ?? this.endDate;
    this.deliveryDates = await reader.readObjects("scheduleId", "DeliveryDate") as DeliveryDate[];
  }
  
  writeTo(writer: Writer): void {
    writer.writeNumber("id", this.id);
    writer.writeDateTime("startDate", this.startDate);
    writer.writeDateTime("endDate", this.endDate);
    writer.writeObjects("scheduleId", this.deliveryDates);
  }

}