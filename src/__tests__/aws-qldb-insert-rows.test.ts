import testHelper, { TestFlowsItem } from "node-red-node-test-helper";
import AwsQldbInsertRowsNode from "../nodes/aws-qldb-insert-rows/aws-qldb-insert-rows";
import { AwsQldbInsertRowsNodeDef } from "../nodes/aws-qldb-insert-rows/modules/types";

type FlowsItem = TestFlowsItem<AwsQldbInsertRowsNodeDef>;
type Flows = Array<FlowsItem>;

describe("upload-to-place", () => {
  beforeEach((done) => {
    testHelper.startServer(done);
  });

  afterEach((done) => {
    testHelper.unload().then(() => {
      testHelper.stopServer(done);
    });
  });

  it("should be loaded", (done) => {
    const flows: Flows = [
      { id: "n1", type: "aws-qldb-insert-rows", name: "aws-qldb-insert-rows" },
    ];
    testHelper.load(AwsQldbInsertRowsNode, flows, () => {
      const n1 = testHelper.getNode("n1");
      expect(n1).toBeTruthy();
      expect(n1.name).toEqual("aws-qldb-insert-rows");
      done();
    });
  });

  it("should insert a row", (done) => {
    const flows: Flows = [
      {
        id: "n1",
        type: "aws-qldb-insert-rows",
        name: "aws-qldb-insert-rows",
        ledger: process.env.AWS_LEDGER,
        table: process.env.AWS_TABLE,
        awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
        awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        awsRegion: process.env.AWS_REGION || 'us-east-1',
        wires: [["n2"]],
      },
      {
        id: "n2",
        type: "helper"
      }
    ];
    testHelper.load(AwsQldbInsertRowsNode, flows, () => {
      const n1 = testHelper.getNode("n1");
      const n2 = testHelper.getNode("n2");
      n2.on("input", (msg: unknown) => {
        console.log(msg);
        done();
      })
      n1.receive({ payload: [{
        Id: '1',
        Stamp: new Date(),
      },{
        Id: '2',
        Stamp: new Date(),
      }] });
    });
  });
});

