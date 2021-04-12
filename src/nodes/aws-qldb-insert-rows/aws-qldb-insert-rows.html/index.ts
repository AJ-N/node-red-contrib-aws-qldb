import { EditorRED } from "node-red";
import { AwsQldbInsertRowsCredentials, AwsQldbInsertRowsEditorNodeProperties } from "./modules/types";

declare const RED: EditorRED;

RED.nodes.registerType<AwsQldbInsertRowsEditorNodeProperties, AwsQldbInsertRowsCredentials>("aws-qldb-insert-rows", {
  category: "function",
  color: "#a6bbcf",
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
  icon: "file.png",
  paletteLabel: "AWS QLDB (insert)",
  label: function () {
    return this.name || "AWS QLDB";
  },
});
