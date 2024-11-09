### Byte Ordering

All multi-byte numeric values in the Cryptdatum header, metadata, signature, and checksum table are stored in little endian byte order. This means that the least significant byte (LSB) is stored at the lowest memory address, and the most significant byte (MSB) is stored at the highest memory address. This enables modern hardware to access individual bytes more efficiently.

::: tip **Note:** 
The **`<cryptdatum_header>`**, **`<cryptdatum_metadata>`**, **`<signature>`**, and **`<checksum_table>`** MUST use little endian byte order for numeric values. The data **`<payload>`** is treated as a raw byte sequence and does not have this requirement.
:::

## Handling Different Byte Orders in Payloads

The Cryptdatum format processes the payload as a raw byte sequence. This means that any byte order or data format can be stored within the payload without affecting the Cryptdatum operations.

::: tip Example: Storing and Retrieving a Text File in Cryptdatum

1. **Original Text File (Big Endian System)**: `Hello World 123`
2. **Creating Cryptdatum Container**:
   - The header, metadata, signature, and checksum are written in little endian for numeric values.
   - The payload (text file content) is encrypted and compressed as a raw byte sequence.
3. **Extracting and Processing (Little Endian System)**:
   - The payload is extracted and processed (e.g., decrypted, decompressed) as a raw byte sequence.
   - The resulting file content is `Hello World 123`, preserving the original data.
:::

## 2's Complement

All signed integers in the Cryptdatum header, metadata, signature, and checksum table are represented using 2's complement notation. Where the most significant bit (MSB) indicates the sign of the number: a '0' represents a positive number and a '1' represents a negative number.

**Example of 8-bit 2's complement representation:**

- **$+127$**: $( 0111\ 1111 )$
- **$-127$**: $( 1000\ 0001 )$

In 2's complement, to obtain the negative of a number, you invert all bits and add one to the least significant bit (LSB).

### Important Points:
- **Overflow Handling**: When performing arithmetic operations, if the result exceeds the maximum value that can be represented in the given bit-width, it wraps around, consistent with 2's complement arithmetic.
- **Signed vs Unsigned**: Be cautious when interpreting byte sequences; ensure that the correct signed or unsigned context is applied based on the field definitions.


### Mathematical Explanation:

To compute the 2's complement of a number $( x )$:

$$
\text{2's complement of } x = \text{NOT}(x) + 1
$$


Where $(\text{NOT}(x))\text{ is the bitwise NOT of } ( x )$.

For example, to find the 2's complement of 127 in an 8-bit system:

1. Represent +127 in binary: $( 0111\ 1111 )$
2. Invert the bits: $( 1000\ 0000 )$
3. Add 1 to the result: $( 1000\ 0000 + 1 = 1000\ 0001 )$

Thus, the 2's complement representation of $-127$ is $( 1000\ 0001 )$.

$$
+5: \quad 0000\ 0101
$$

$$
-5: \quad 1111\ 1011
$$
