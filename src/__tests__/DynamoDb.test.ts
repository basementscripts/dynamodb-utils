import { beforeEach, describe, expect, test } from "@jest/globals";
import { mockClient } from "aws-sdk-client-mock";
import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { DynamoDb } from "../DynamoDb";

// CONSTANTS
const TABLE = "test";
const EMAIL = "user@test.com";

describe("DynamoDb", () => {
  const ddbMock = mockClient(DynamoDBDocumentClient);

  const db = new DynamoDb({ region: "us-east-1" });

  beforeEach(() => {
    ddbMock.reset();
  });

  const items: any = [
    { id: "1ce7c08e-6c41-4a49-9a10-705c23748669", email: EMAIL },
    { id: "a61c255e-d004-4878-aba6-094c3d247d5c", email: EMAIL },
  ];

  describe("queryRecord", () => {
    test("should return a single item", async () => {
      ddbMock.on(QueryCommand).resolves({
        Items: items,
      });

      const record = await db.queryRecord({
        tableName: TABLE,
        params: {
          email: EMAIL,
        },
      });
      expect(record.id).toEqual(items[0].id);
    });
  });

  describe("query", () => {
    test("should return a list of items", async () => {
      ddbMock.on(QueryCommand).resolves({
        Items: items,
      });
      const results = await db.query({
        tableName: TABLE,
        params: {
          email: EMAIL,
        },
      });
      expect(results).toStrictEqual(items);
    });
  });

  describe("create", () => {
    test("should create a new item", async () => {
      const id = "caf9afcf-aeac-4ef2-afdc-cf5a30307c24";
      ddbMock.on(QueryCommand).resolves({
        Items: [],
      });
      ddbMock.on(PutCommand).resolves({
        ConsumedCapacity: {
          CapacityUnits: 1,
          TableName: TABLE,
        },
      });
      const record = await db.create({
        tableName: TABLE,
        key: {
          id,
        } as any,
        params: {
          id,
          email: EMAIL,
        },
      });
      expect(record.email).toEqual(EMAIL);
    });
  });

  describe("findRecord", () => {
    test("should return a single item", async () => {
      const id = "caf9afcf-aeac-4ef2-afdc-cf5a30307c24";
      ddbMock.on(GetCommand).resolves({
        Item: { id, email: EMAIL },
      });
      const record = await db.findRecord({
        tableName: TABLE,
        key: {
          id,
        } as any,
      });
      expect(record.email).toEqual(EMAIL);
    });
  });

  describe("update", () => {
    test("should update an item", async () => {
      const id = "caf9afcf-aeac-4ef2-afdc-cf5a30307c24";
      const email = "user1@test.com";
      ddbMock.on(GetCommand).resolves({
        Item: { id, email: EMAIL },
      });
      ddbMock.on(UpdateCommand).resolves({
        Attributes: {
          id,
          email,
        },
      });
      const record = await db.update({
        tableName: TABLE,
        key: {
          id,
        } as any,
        params: {
          email,
        },
      });
      expect(record.email).toEqual(email);
    });
  });

  describe("delete", () => {
    test("should delete an item", async () => {
      const id = "caf9afcf-aeac-4ef2-afdc-cf5a30307c24";
      ddbMock.on(DeleteCommand).resolves({
        ConsumedCapacity: {
          CapacityUnits: 1,
          TableName: "Music",
        },
      });

      const record = await db.delete({
        tableName: TABLE,
        key: {
          id,
        } as any,
      });
      expect(record.id).toEqual(id);
    });
  });
});
