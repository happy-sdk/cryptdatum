# Constants

Specification defines following constant values

| | | | |
| ---  |--- | --- | --- |
| **version** | <Badge type="tip" text="public" /> | unsigned 16-bit integer | Library implementing Cryptdatum format **MUST** set that value to latest specification version the library supports |
| **min_version** |  <Badge type="tip" text="public" /> | unsigned 16-bit integer | Minimum specification version this library knows to handle |
| **magic_prefix** | <Badge type="danger" text="private" /> | 4 bytes | is fixed byte array of 4 bytes `0xA7, 0xF6, 0xE5, 0xD4`. If the Magic Number fieild is not recognized and matched at the beginning of the header, the header **MUST** be considered invalid. | 
| **delimiter** | <Badge type="danger" text="private" /> | 2 bytes | `0xA6, 0xE5`, If the Delimiter field is not recognized and matched at the end (last 2 bytes) of the header, the header **MUST** be considered invalid. |
| **magic_date** | <Badge type="danger" text="private" /> | unsigned 64-bit integer | `1652155382000000001` this the minimum possible value for Timestamp header field. |
