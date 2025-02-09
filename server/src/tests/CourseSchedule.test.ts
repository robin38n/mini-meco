import sqlite3 from "sqlite3";
import { open } from "sqlite";
import { describe, it, expect } from "vitest";
import { ObjectHandler } from "../ObjectHandler";
import { initializeCourseSchedule } from "../databaseInitializer";
import { CourseSchedule, DeliveryDate } from "../Models/CourseSchedule";
import { DatabaseSerializableFactory } from "../Serializer/DatabaseSerializableFactory";
import { DatabaseWriter } from "../Serializer/DatabaseWriter";

async function openInMem() {
    const db = await open({
        filename: ":memory:",
        driver: sqlite3.Database,
    });
    await initializeCourseSchedule(db);
    
    return db;
}

describe("CourseSchedule", () => {
    // stateless, can be shared
    const oh = new ObjectHandler();
    
    it("should be empty on startup", async () => {
        const db = await openInMem();
        expect(await oh.getCourseSchedule(0, db)).toBeNull();
    });
    
    it("should automatically create id on insertion", async () => {
        const db = await openInMem();
        const dbsf = new DatabaseSerializableFactory(db);

        const expected = await dbsf.create("CourseSchedule") as CourseSchedule;
        const delivery1 = await dbsf.create("DeliveryDate") as DeliveryDate;
        
        expected.setStartDate(new Date(2022, 0, 1));
        expected.setEndDate(new Date(2022, 1, 1));
        delivery1.setDeliveryDate(new Date(2022, 0, 1));
        expected.setDeliveryDates([delivery1]);
        
        (new DatabaseWriter(db)).writeRoot(expected);

        const actual = await oh.getCourseSchedule(1, db);
        expect(actual).toEqual(expected);
    });
    
    it("should not allow duplicate delivery dates", async () => {
        const db = await openInMem();
        const dbsf = new DatabaseSerializableFactory(db);

        const expected = await dbsf.create("CourseSchedule") as CourseSchedule;
        const delivery1 = await dbsf.create("DeliveryDate") as DeliveryDate;
        const delivery2 = await dbsf.create("DeliveryDate") as DeliveryDate;

        expected.setStartDate(new Date(2022, 0, 1));
        expected.setEndDate(new Date(2022, 1, 1));
        delivery1.setDeliveryDate(new Date(2022, 0, 1));
        delivery2.setDeliveryDate(new Date(2022, 0, 1));
        expected.setDeliveryDates([delivery1, delivery2]);

        await expect((new DatabaseWriter(db)).writeRoot(expected)).rejects.toThrow();
    });
    
    it("should not allow deliveries before schedule", async () => {
        const db = await openInMem();
        const dbsf = new DatabaseSerializableFactory(db);

        const expected = await dbsf.create("CourseSchedule") as CourseSchedule;
        const delivery1 = await dbsf.create("DeliveryDate") as DeliveryDate;

        expected.setStartDate(new Date(2022, 0, 2));
        expected.setEndDate(new Date(2022, 0, 3));
        delivery1.setDeliveryDate(new Date(2022, 0, 1));
        expected.setDeliveryDates([delivery1]);

        await expect((new DatabaseWriter(db)).writeRoot(expected)).rejects.toThrow();
    });

    it("should not allow deliveries after schedule", async () => {
        const db = await openInMem();
        const dbsf = new DatabaseSerializableFactory(db);

        const expected = await dbsf.create("CourseSchedule") as CourseSchedule;
        const delivery1 = await dbsf.create("DeliveryDate") as DeliveryDate;

        expected.setStartDate(new Date(2022, 0, 1));
        expected.setEndDate(new Date(2022, 0, 2));
        delivery1.setDeliveryDate(new Date(2022, 0, 3));
        expected.setDeliveryDates([delivery1]);

        await expect((new DatabaseWriter(db)).writeRoot(expected)).rejects.toThrow();
    });
    
    it("should allow updating schedules", async () => {
        const db = await openInMem();
        const dbfs = new DatabaseSerializableFactory(db);

        const scheduleBefore = await dbfs.create("CourseSchedule") as CourseSchedule;
        const delivery1 = await dbfs.create("DeliveryDate") as DeliveryDate;

        scheduleBefore.setStartDate(new Date(2022, 0, 1));
        scheduleBefore.setEndDate(new Date(2022, 1, 1));
        delivery1.setDeliveryDate(new Date(2022, 0, 1));
        scheduleBefore.setDeliveryDates([delivery1]);

        await (new DatabaseWriter(db)).writeRoot(scheduleBefore);
        
        const expected = await oh.getCourseSchedule(1, db);
        if (!expected) { throw new Error("expected not null"); }
        expect(expected).toEqual(scheduleBefore);
        expected.setEndDate(new Date(2022, 2, 1));
        expected.getDeliveryDates()[0].setDeliveryDate(new Date(2022, 2, 1));

        await (new DatabaseWriter(db)).writeRoot(expected);
        
        // still id 1
        expect(await oh.getCourseSchedule(1, db)).toEqual(expected);
    });

    it("should return sorted delivery dates", async () => {
        const db = await openInMem();
        const dbfs = new DatabaseSerializableFactory(db);

        const schedule = await dbfs.create("CourseSchedule") as CourseSchedule;
        const delivery1 = await dbfs.create("DeliveryDate") as DeliveryDate;
        const delivery2 = await dbfs.create("DeliveryDate") as DeliveryDate;
        const delivery3 = await dbfs.create("DeliveryDate") as DeliveryDate;

        schedule.setStartDate(new Date(2022, 0, 1));
        schedule.setEndDate(new Date(2022, 1, 1));
        delivery1.setDeliveryDate(new Date(2022, 0, 3));
        delivery2.setDeliveryDate(new Date(2022, 0, 2));
        delivery3.setDeliveryDate(new Date(2022, 0, 1));
        schedule.setDeliveryDates([delivery1, delivery2, delivery3]);

        await (new DatabaseWriter(db)).writeRoot(schedule);
        // sorted manually after insertion
        schedule.getDeliveryDates().sort((a, b) => a.getDeliveryDate().getTime() - b.getDeliveryDate().getTime());
        expect(await oh.getCourseSchedule(1, db)).toEqual(schedule);
    });
});
