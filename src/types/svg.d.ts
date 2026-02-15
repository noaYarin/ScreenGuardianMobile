declare module "*.svg" {
  import * as React from "react";
  const ReactComponent: React.FC<{ width?: number; height?: number }>;
  export default ReactComponent;
}
