import "styled-components";

import type { AppTheme } from "./theme";

declare module "styled-components" {
  // styled-components requires an interface merge for theme typing.
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface DefaultTheme extends AppTheme {}
}
