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
        id: "qldb-insert-node",
        type: "aws-qldb-insert-rows",
        name: "aws-qldb-insert-rows",
        ledger: process.env.AWS_LEDGER,
        table: process.env.AWS_TABLE,
        region: process.env.AWS_REGION || 'us-east-1',
        wires: [["output-node"]],
      },
      {
        id: "output-node",
        type: "helper"
      }
    ];

    const credentials = {
      "qldb-insert-node": {
        awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
        awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      }
    };

    testHelper.load(AwsQldbInsertRowsNode, flows, credentials, () => {
      const qldbInsertNode = testHelper.getNode("qldb-insert-node");
      const outputNode = testHelper.getNode("output-node");
      outputNode.on("input", (msg: unknown) => {
        console.log(msg);
        done();
      })
      qldbInsertNode.receive({ payload: [{
        Id: '1',
        Stamp: new Date(),
      },{
        Id: '2',
        Stamp: new Date(),
      }] });
    });

  });
});

