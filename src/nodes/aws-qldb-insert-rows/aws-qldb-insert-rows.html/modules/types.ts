import { EditorNodeProperties } from "node-red";
import { AwsQldbInsertRowsOptions } from "../../shared/types";

export interface AwsQldbInsertRowsEditorNodeProperties
  extends EditorNodeProperties,
    AwsQldbInsertRowsOptions {}
