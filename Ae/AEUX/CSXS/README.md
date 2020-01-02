## Important notes about manifest.xml:

```xml
<DispatchInfo>
  <Resources>
    <!-- Default (no hot reload) -->
    <MainPath>./index.html</MainPath>

    <!-- Dev build w/ hot reload -->
    <MainPath>./index-dev.html</MainPath>

    <!-- The above must be manually toggled between `npm run build` and `npm run serve` serve commands, then relaunch the host app to take effect. -->

    <!-- Make sure to include parameters for NodeJS: -->
    <CEFCommandLine>
      <Parameter>--enable-nodejs</Parameter>
      <!-- Doesn't show in Window > Extensions unless mixed content is enabled -->
      <Parameter>--mixed-context</Parameter>
      <!-- Cannot use require('fs') inside index-dev.html's iframe -->
    </CEFCommandLine>
  </Resources>
```
