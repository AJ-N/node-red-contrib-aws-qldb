import { EditorNodeProperties } from "node-red";
import { AwsQldbInsertRowsOptions, AwsQldbInsertRowsCredentials } from "../../shared/types";

export interface AwsQldbInsertRowsEditorNodeProperties
  extends EditorNodeProperties,
    AwsQldbInsertRowsOptions {}
export { AwsQldbInsertRowsCredentials }