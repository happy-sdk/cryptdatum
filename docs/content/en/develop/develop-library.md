# Develop Cryptdatum library

## Constants

Every official Cryptdatum client library **MUST** export the following public constants.

| | | |
| --- | --- | --- |
| **Version** | unsigned 16-bit integer | Library implementing Cryptdatum format **MUST** set that value to latest specification version the library supports |
| **Min Version** | unsigned 16-bit integer | Minimum specification version this library knows to handle |

:::tabs key:plang

== Go
```go
const (
  Version     uint16  = 1
  MinVersion  uint16  = 1
)
```

== C/C++
```c
// C
#include <stdint.h>

const uint16_t VERSION = 1;
const uint16_t MIN_VERSION = 1;

//  C++
#include <cstdint>

constexpr uint16_t Version = 1;
constexpr uint16_t MinVersion = 1;
```

== Py
```python
VERSION = 1
MIN_VERSION = 1
```

== Java
```java
public final class CryptdatumConstants {
    public static final int VERSION = 1;
    public static final int MIN_VERSION = 1;

    private CryptdatumConstants() {
        // Prevent instantiation
    }
}
```

== js/ts
```js
// js
export const VERSION = 1;
export const MIN_VERSION = 1;

// ts
export const VERSION: number = 1;
export const MIN_VERSION: number = 1;

```

== C#
```cs
public static class CryptdatumConstants {
    public const ushort Version = 1;
    public const ushort MinVersion = 1;
}
```

== PHP
```php
const VERSION = 1;
const MIN_VERSION = 1;
```

== Swift
```swift
let VERSION: UInt16 = 1
let MIN_VERSION: UInt16 = 1
```

== Rust
```rust
pub const VERSION: u16 = 1;
pub const MIN_VERSION: u16 = 1;
```

== Zig
```zig
pub const VERSION: u16 = 1;
pub const MIN_VERSION: u16 = 1;
```

== Haskell
```haskell
version :: Int
version = 1

minVersion :: Int
minVersion = 1
```

== Lua
```lua
VERSION = 1
MIN_VERSION = 1
```

== Scala
```scala
object Cryptdatum {
  val Version: Int = 1
  val MinVersion: Int = 1
}
```
:::











