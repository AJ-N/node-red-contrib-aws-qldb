import { EditorRED } from "node-red";
import { AwsQldbInsertRowsCredentials, AwsQldbInsertRowsEditorNodeProperties } from "./modules/types";

declare const RED: EditorRED;

RED.nodes.registerType<AwsQldbInsertRowsEditorNodeProperties, AwsQldbInsertRowsCredentials>("aws-qldb-insert-rows", {
  category: "AWS QLDB",
  color: "#94cdd0",
  defaults: {
    name: { value: "" },
    ledger: { value: '', required: true },
    table: { value: '', required: true },
    returnDocumentIds: { value: false, required: true },
    region: { value: '', required: true },
  },
  credentials: {
    awsAccessKeyId: { type: 'text' },
    awsSecretAccessKey: { type: 'password' },
  },
  inputs: 1,
  outputs: 1,
  icon: "db.png",
  paletteLabel: "AWS QLDB (Insert)",
  label: function () {
    return this.name || "AWS QLDB (Insert)";
  },
});
