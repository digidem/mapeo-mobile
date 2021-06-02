### `avvio`

A helper function relies on `require.cache`, which is unset in the implementation of `require` created by `noderify`. This code can be safely ignored.

### `dns-discovery`

This is a small patch to format debug logs to a single line. This is because the dns-discovery debug logs can tend to take-over the log, because they were emitting lots of multi-line logs for response and query objects.
