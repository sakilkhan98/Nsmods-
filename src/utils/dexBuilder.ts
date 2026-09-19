/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Encodes a number into a ULEB128 byte array.
 */
function writeUleb128(val: number): number[] {
  const bytes = [];
  let remaining = val;
  while (remaining > 0x7f) {
    bytes.push((remaining & 0x7f) | 0x80);
    remaining >>>= 7;
  }
  bytes.push(remaining & 0x7f);
  return bytes;
}

/**
 * Pure JavaScript SHA-1 implementation.
 * Standard SHA-1 algorithm computed over a Uint8Array.
 */
function sha1(buffer: Uint8Array): Uint8Array {
  const words = new Uint32Array((buffer.length + 8 >> 6) + 1 << 4);
  for (let i = 0; i < buffer.length; i++) {
    words[i >> 2] |= buffer[i] << (24 - (i & 3) * 8);
  }
  words[buffer.length >> 2] |= 0x80 << (24 - (buffer.length & 3) * 8);
  words[words.length - 1] = buffer.length * 8;

  let h0 = 0x67452301;
  let h1 = 0xEFCDAB89;
  let h2 = 0x98BADCFE;
  let h3 = 0x10325476;
  let h4 = 0xC3D2E1F0;

  const w = new Uint32Array(80);
  for (let i = 0; i < words.length; i += 16) {
    for (let j = 0; j < 16; j++) w[j] = words[i + j];
    for (let j = 16; j < 80; j++) {
      const val = w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16];
      w[j] = (val << 1) | (val >>> 31);
    }

    let a = h0;
    let b = h1;
    let c = h2;
    let d = h3;
    let e = h4;

    for (let j = 0; j < 80; j++) {
      let f = 0;
      let k = 0;
      if (j < 20) {
        f = (b & c) | (~b & d);
        k = 0x5A827999;
      } else if (j < 40) {
        f = b ^ c ^ d;
        k = 0x6ED9EBA1;
      } else if (j < 60) {
        f = (b & c) | (b & d) | (c & d);
        k = 0x8F1BBCDC;
      } else {
        f = b ^ c ^ d;
        k = 0xCA62C1D6;
      }

      const temp = ((a << 5) | (a >>> 27)) + f + e + k + w[j];
      e = d;
      d = c;
      c = (b << 30) | (b >>> 2);
      b = a;
      a = temp | 0;
    }

    h0 = (h0 + a) | 0;
    h1 = (h1 + b) | 0;
    h2 = (h2 + c) | 0;
    h3 = (h3 + d) | 0;
    h4 = (h4 + e) | 0;
  }

  const result = new Uint8Array(20);
  for (let i = 0; i < 5; i++) {
    const h = [h0, h1, h2, h3, h4][i];
    result[i * 4] = (h >>> 24) & 0xff;
    result[i * 4 + 1] = (h >>> 16) & 0xff;
    result[i * 4 + 2] = (h >>> 8) & 0xff;
    result[i * 4 + 3] = h & 0xff;
  }
  return result;
}

/**
 * Calculates standard Adler-32 checksum of a byte buffer.
 */
function calculateAdler32(data: Uint8Array): number {
  let s1 = 1;
  let s2 = 0;
  for (let i = 0; i < data.length; i++) {
    s1 = (s1 + data[i]) % 65521;
    s2 = (s2 + s1) % 65521;
  }
  return (s2 << 16) | s1;
}

interface DexMethod {
  classType: string;
  proto: number; // 0 or 1
  name: string; // "<init>" or "showDialog"
}

/**
 * Programmatically builds a 100% valid Android DEX (classes.dex) binary.
 * This generator includes complete method blocks, headers, prototypes, type-lists,
 * code items, and class data descriptors to be decompileable in MT Manager and APK tools.
 *
 * @param stringPool Custom strings to include in the string pool of the DEX file.
 * @param classNames Custom class names (descriptors like "Lcom/nsmods/dialog/simpledialog;") to register.
 * @returns Uint8Array containing the compiled classes.dex bytes.
 */
export function generateDexBytes(stringPool: string[], classNames: string[]): Uint8Array {
  const superclass = "Ljava/lang/Object;";
  const sourceFile = "simpledialog.java";

  // Deduplicate and filter strings
  const cleanStrings = stringPool.map(s => s ? s.trim() : "").filter(Boolean);
  const cleanClassNames = classNames.map(c => c ? c.trim() : "").filter(Boolean);

  // In DEX, types are sorted.
  const typeNames = Array.from(new Set([
    "Landroid/content/Context;",
    "Ljava/lang/Object;",
    "V",
    "I",
    "Ljava/lang/String;",
    ...cleanClassNames
  ])).sort();

  // Pick the main class (which will contain the static showDialog method)
  const mainClass = cleanClassNames.find(c => !c.includes('$')) || cleanClassNames[0] || "Lcom/nsmods/dialog/simpledialog;";

  // Methods list (direct constructor `<init>()V` for all classes, and `showDialog` for main class)
  const methodList: DexMethod[] = [
    // Ljava/lang/Object; constructor so we can call super
    { classType: "Ljava/lang/Object;", proto: 0, name: "<init>" }
  ];

  for (const c of cleanClassNames) {
    methodList.push({ classType: c, proto: 0, name: "<init>" });
    if (c === mainClass) {
      methodList.push({ classType: c, proto: 1, name: "showDialog" });
    }
  }

  // Combine all strings: type names, custom string pool, method names, and source file metadata
  const allStrings = Array.from(new Set([
    "<init>",
    "showDialog",
    "V",
    "VL",
    superclass,
    sourceFile,
    "Landroid/content/Context;",
    "Ljava/lang/Object;",
    "I",
    "Ljava/lang/String;",
    ...cleanStrings,
    ...typeNames
  ])).sort();

  // Sort methods: first by class type index, then by name index, then by proto index
  const sortedMethods = methodList.sort((a, b) => {
    const aClassIdx = typeNames.indexOf(a.classType);
    const bClassIdx = typeNames.indexOf(b.classType);
    if (aClassIdx !== bClassIdx) return aClassIdx - bClassIdx;

    const aNameIdx = allStrings.indexOf(a.name);
    const bNameIdx = allStrings.indexOf(b.name);
    if (aNameIdx !== bNameIdx) return aNameIdx - bNameIdx;

    return a.proto - b.proto;
  });

  const N = allStrings.length;
  const numTypes = typeNames.length;
  const numClasses = cleanClassNames.length;
  const numMethods = sortedMethods.length;

  // Header sizes and section offsets
  const headerSize = 112;
  const stringIdsOff = headerSize;
  const typeIdsOff = stringIdsOff + N * 4;
  const protoIdsOff = typeIdsOff + numTypes * 4;
  const fieldIdsOff = protoIdsOff + 2 * 12; // exactly 2 prototypes (0 and 1)
  const methodIdsOff = fieldIdsOff + 0; // 0 fields
  const classDefsOff = methodIdsOff + numMethods * 8;
  const dataStartOff = classDefsOff + numClasses * 32;

  // 1. Write the parameters type-list for Proto 1 ((Landroid/content/Context;)V)
  const proto1ParamsOff = dataStartOff;
  const contextTypeIdx = typeNames.indexOf("Landroid/content/Context;");
  const typeListBytes: number[] = [
    1, 0, 0, 0, // size (1)
    contextTypeIdx & 0xff, (contextTypeIdx >> 8) & 0xff, // Landroid/content/Context; type idx
    0, 0 // padding to 4-byte boundary
  ];

  // 2. Write the Code Items
  // Find index of Ljava/lang/Object;-><init>()V
  const superInitMethodIdx = sortedMethods.findIndex(m => m.classType === "Ljava/lang/Object;" && m.name === "<init>");

  // Constructor Code Item (registers_size=1, ins_size=1, outs_size=1, tries_size=0, debug_info_off=0, insns_size=4)
  const constructorCodeOff = proto1ParamsOff + typeListBytes.length;
  const constructorCodeBytes: number[] = [
    1, 0, // registers_size
    1, 0, // ins_size
    1, 0, // outs_size
    0, 0, // tries_size
    0, 0, 0, 0, // debug_info_off
    4, 0, 0, 0, // insns_size (4 code units)
    // invoke-direct {p0}, Ljava/lang/Object;-><init>()V
    0x70, 0x10, superInitMethodIdx & 0xff, (superInitMethodIdx >> 8) & 0xff, 0x00, 0x00,
    // return-void
    0x0e, 0x00
  ];

  // showDialog Code Item with dynamically generated const-string instructions.
  // This ensures MT Manager and other DEX parsers find and list these strings under the STRINGS tab.
  const referencedStrings = allStrings.filter(s => {
    return s !== "" && s !== "V" && s !== "VL" && s !== "<init>" && s !== "showDialog";
  });

  const insns: number[] = [];
  for (const s of referencedStrings) {
    const stringIdx = allStrings.indexOf(s);
    if (stringIdx !== -1 && stringIdx < 65536) {
      // const-string v0, stringIdx
      insns.push(0x1a, 0x00, stringIdx & 0xff, (stringIdx >> 8) & 0xff);
    }
  }

  // return-void
  insns.push(0x0e, 0x00);

  const insnsSize = insns.length / 2; // in 16-bit code units
  const showDialogCodeOff = constructorCodeOff + constructorCodeBytes.length;
  const showDialogCodeBytes: number[] = [
    2, 0, // registers_size (v0 is local, v1 is p0)
    1, 0, // ins_size
    0, 0, // outs_size
    0, 0, // tries_size
    0, 0, 0, 0, // debug_info_off
    insnsSize & 0xff, (insnsSize >> 8) & 0xff, (insnsSize >> 16) & 0xff, (insnsSize >> 24) & 0xff, // insns_size (uint)
    ...insns
  ];

  // Align to 4-byte boundary
  while (showDialogCodeBytes.length % 4 !== 0) {
    showDialogCodeBytes.push(0);
  }

  // 3. Write Class Data Items
  const currentClassDataOff = showDialogCodeOff + showDialogCodeBytes.length;
  const classDataBytes: number[] = [];
  const classDataOffsets: number[] = [];

  // In DEX, classDefs must be sorted by their type index
  const sortedClassNames = [...cleanClassNames].sort((a, b) => {
    return typeNames.indexOf(a) - typeNames.indexOf(b);
  });

  for (let i = 0; i < numClasses; i++) {
    const className = sortedClassNames[i];
    classDataOffsets.push(currentClassDataOff + classDataBytes.length);

    const methodsInClass = sortedMethods.filter(m => m.classType === className);

    // static_fields_size, instance_fields_size
    classDataBytes.push(...writeUleb128(0));
    classDataBytes.push(...writeUleb128(0));
    // direct_methods_size, virtual_methods_size
    classDataBytes.push(...writeUleb128(methodsInClass.length));
    classDataBytes.push(...writeUleb128(0));

    let lastMethodIdx = 0;
    for (const m of methodsInClass) {
      const mIdx = sortedMethods.indexOf(m);
      const diff = mIdx - lastMethodIdx;
      classDataBytes.push(...writeUleb128(diff));

      let flags = 0x0001; // ACC_PUBLIC
      let codeOff = constructorCodeOff;
      if (m.name === "<init>") {
        flags |= 0x10000; // ACC_CONSTRUCTOR
        codeOff = constructorCodeOff;
      } else if (m.name === "showDialog") {
        flags |= 0x0008; // ACC_STATIC
        codeOff = showDialogCodeOff;
      }

      classDataBytes.push(...writeUleb128(flags));
      classDataBytes.push(...writeUleb128(codeOff));

      lastMethodIdx = mIdx;
    }
  }

  // Align class data bytes to 4-byte boundary
  while (classDataBytes.length % 4 !== 0) {
    classDataBytes.push(0);
  }

  // 4. Write String Data Items
  const stringDataStartOff = currentClassDataOff + classDataBytes.length;
  const stringDataBytes: number[] = [];
  const stringOffsets: number[] = [];

  for (let i = 0; i < N; i++) {
    const s = allStrings[i];
    stringOffsets.push(stringDataStartOff + stringDataBytes.length);

    // Convert string to MUTF-8 (Modified UTF-8)
    const mutf8Bytes: number[] = [];
    for (let j = 0; j < s.length; j++) {
      const c = s.charCodeAt(j);
      if (c === 0) {
        // Null character is encoded as a 2-byte sequence in MUTF-8
        mutf8Bytes.push(0xc0, 0x80);
      } else if (c >= 0x01 && c <= 0x7f) {
        mutf8Bytes.push(c);
      } else if (c <= 0x7ff) {
        mutf8Bytes.push(0xc0 | (c >> 6));
        mutf8Bytes.push(0x80 | (c & 0x3f));
      } else {
        mutf8Bytes.push(0xe0 | (c >> 12));
        mutf8Bytes.push(0x80 | ((c >> 6) & 0x3f));
        mutf8Bytes.push(0x80 | (c & 0x3f));
      }
    }

    // DEX expects UTF-16 length encoded as ULEB128 first
    const lenBytes = writeUleb128(s.length);
    stringDataBytes.push(...lenBytes);
    stringDataBytes.push(...mutf8Bytes);
    stringDataBytes.push(0); // Null terminator
  }

  // Align stringDataBytes length to a multiple of 4 to ensure mapListOff is 4-byte aligned
  while (stringDataBytes.length % 4 !== 0) {
    stringDataBytes.push(0);
  }

  const mapListOff = stringDataStartOff + stringDataBytes.length;

  // Build DEX Map List
  const mapEntries = [
    { type: 0x0000, size: 1, offset: 0 },                                  // Header
    { type: 0x0001, size: N, offset: stringIdsOff },                       // StringIds
    { type: 0x0002, size: numTypes, offset: typeIdsOff },                  // TypeIds
    { type: 0x0003, size: 2, offset: protoIdsOff },                        // ProtoIds
    { type: 0x0005, size: numMethods, offset: methodIdsOff },              // MethodIds
    { type: 0x0006, size: numClasses, offset: classDefsOff },              // ClassDefs
    { type: 0x1001, size: 1, offset: proto1ParamsOff },                    // TypeList
    { type: 0x2001, size: 2, offset: constructorCodeOff },                 // CodeItems (constructor & showDialog)
    { type: 0x2000, size: numClasses, offset: classDataOffsets[0] },       // ClassDataItems
    { type: 0x2002, size: N, offset: stringDataStartOff },                 // StringDataItems
    { type: 0x1000, size: 1, offset: mapListOff }                          // MapList
  ];

  const mapListBytes: number[] = [];
  const mapSize = mapEntries.length;
  mapListBytes.push(mapSize & 0xff, (mapSize >> 8) & 0xff, (mapSize >> 16) & 0xff, (mapSize >> 24) & 0xff);
  for (const entry of mapEntries) {
    mapListBytes.push(entry.type & 0xff, (entry.type >> 8) & 0xff); // type (ushort)
    mapListBytes.push(0, 0); // unused (ushort)
    mapListBytes.push(entry.size & 0xff, (entry.size >> 8) & 0xff, (entry.size >> 16) & 0xff, (entry.size >> 24) & 0xff); // size (uint)
    mapListBytes.push(entry.offset & 0xff, (entry.offset >> 8) & 0xff, (entry.offset >> 16) & 0xff, (entry.offset >> 24) & 0xff); // offset (uint)
  }

  const totalFileSize = mapListOff + mapListBytes.length;
  const fileBytes = new Uint8Array(totalFileSize);

  // 1. Magic Header (dex\n035\0)
  const magic = [0x64, 0x65, 0x78, 0x0a, 0x30, 0x33, 0x35, 0x00];
  fileBytes.set(magic, 0);

  // Checksum (offset 8) & Signature (offset 12) placeholders are zero

  // 4. File size (offset 32)
  fileBytes[32] = totalFileSize & 0xff;
  fileBytes[33] = (totalFileSize >> 8) & 0xff;
  fileBytes[34] = (totalFileSize >> 16) & 0xff;
  fileBytes[35] = (totalFileSize >> 24) & 0xff;

  // 5. Header size (offset 36)
  fileBytes[36] = headerSize & 0xff;
  fileBytes[37] = 0;
  fileBytes[38] = 0;
  fileBytes[39] = 0;

  // 6. Endian Tag (offset 40)
  fileBytes[40] = 0x78;
  fileBytes[41] = 0x56;
  fileBytes[42] = 0x34;
  fileBytes[43] = 0x12;

  // 7. Map offset (offset 52)
  fileBytes[52] = mapListOff & 0xff;
  fileBytes[53] = (mapListOff >> 8) & 0xff;
  fileBytes[54] = (mapListOff >> 16) & 0xff;
  fileBytes[55] = (mapListOff >> 24) & 0xff;

  // 8. String IDs count & offset (offset 56-63)
  fileBytes[56] = N & 0xff;
  fileBytes[57] = (N >> 8) & 0xff;
  fileBytes[58] = (N >> 16) & 0xff;
  fileBytes[59] = (N >> 24) & 0xff;

  fileBytes[60] = stringIdsOff & 0xff;
  fileBytes[61] = (stringIdsOff >> 8) & 0xff;
  fileBytes[62] = (stringIdsOff >> 16) & 0xff;
  fileBytes[63] = (stringIdsOff >> 24) & 0xff;

  // 9. Type IDs count & offset (offset 64-71)
  fileBytes[64] = numTypes & 0xff;
  fileBytes[65] = (numTypes >> 8) & 0xff;
  fileBytes[66] = (numTypes >> 16) & 0xff;
  fileBytes[67] = (numTypes >> 24) & 0xff;

  fileBytes[68] = typeIdsOff & 0xff;
  fileBytes[69] = (typeIdsOff >> 8) & 0xff;
  fileBytes[70] = (typeIdsOff >> 16) & 0xff;
  fileBytes[71] = (typeIdsOff >> 24) & 0xff;

  // Proto IDs (offset 72-79)
  fileBytes[72] = 2 & 0xff; // size (2 prototypes)
  fileBytes[73] = 0;
  fileBytes[74] = 0;
  fileBytes[75] = 0;

  fileBytes[76] = protoIdsOff & 0xff;
  fileBytes[77] = (protoIdsOff >> 8) & 0xff;
  fileBytes[78] = (protoIdsOff >> 16) & 0xff;
  fileBytes[79] = (protoIdsOff >> 24) & 0xff;

  // Field IDs remain 0

  // Method IDs (offset 88-95)
  fileBytes[88] = numMethods & 0xff;
  fileBytes[89] = (numMethods >> 8) & 0xff;
  fileBytes[90] = (numMethods >> 16) & 0xff;
  fileBytes[91] = (numMethods >> 24) & 0xff;

  fileBytes[92] = methodIdsOff & 0xff;
  fileBytes[93] = (methodIdsOff >> 8) & 0xff;
  fileBytes[94] = (methodIdsOff >> 16) & 0xff;
  fileBytes[95] = (methodIdsOff >> 24) & 0xff;

  // 10. Class Defs count & offset (offset 96-103)
  fileBytes[96] = numClasses & 0xff;
  fileBytes[97] = (numClasses >> 8) & 0xff;
  fileBytes[98] = (numClasses >> 16) & 0xff;
  fileBytes[99] = (numClasses >> 24) & 0xff;

  fileBytes[100] = classDefsOff & 0xff;
  fileBytes[101] = (classDefsOff >> 8) & 0xff;
  fileBytes[102] = (classDefsOff >> 16) & 0xff;
  fileBytes[103] = (classDefsOff >> 24) & 0xff;

  // 11. Data size & offset (offset 104-111)
  const dataSize = totalFileSize - dataStartOff;
  fileBytes[104] = dataSize & 0xff;
  fileBytes[105] = (dataSize >> 8) & 0xff;
  fileBytes[106] = (dataSize >> 16) & 0xff;
  fileBytes[107] = (dataSize >> 24) & 0xff;

  fileBytes[108] = dataStartOff & 0xff;
  fileBytes[109] = (dataStartOff >> 8) & 0xff;
  fileBytes[110] = (dataStartOff >> 16) & 0xff;
  fileBytes[111] = (dataStartOff >> 24) & 0xff;

  // --- Write String IDs offsets ---
  let writePtr = stringIdsOff;
  for (let i = 0; i < N; i++) {
    const off = stringOffsets[i];
    fileBytes[writePtr++] = off & 0xff;
    fileBytes[writePtr++] = (off >> 8) & 0xff;
    fileBytes[writePtr++] = (off >> 16) & 0xff;
    fileBytes[writePtr++] = (off >> 24) & 0xff;
  }

  // --- Write Type IDs indices ---
  writePtr = typeIdsOff;
  for (let i = 0; i < numTypes; i++) {
    const stringIdx = allStrings.indexOf(typeNames[i]);
    fileBytes[writePtr++] = stringIdx & 0xff;
    fileBytes[writePtr++] = (stringIdx >> 8) & 0xff;
    fileBytes[writePtr++] = (stringIdx >> 16) & 0xff;
    fileBytes[writePtr++] = (stringIdx >> 24) & 0xff;
  }

  // --- Write Proto IDs ---
  writePtr = protoIdsOff;
  const voidTypeIdx = typeNames.indexOf("V");
  const shortyVIdx = allStrings.indexOf("V");
  const shortyVLIdx = allStrings.indexOf("VL");

  // Proto 0: ()V
  fileBytes[writePtr++] = shortyVIdx & 0xff;
  fileBytes[writePtr++] = (shortyVIdx >> 8) & 0xff;
  fileBytes[writePtr++] = (shortyVIdx >> 16) & 0xff;
  fileBytes[writePtr++] = (shortyVIdx >> 24) & 0xff;

  fileBytes[writePtr++] = voidTypeIdx & 0xff;
  fileBytes[writePtr++] = (voidTypeIdx >> 8) & 0xff;
  fileBytes[writePtr++] = (voidTypeIdx >> 16) & 0xff;
  fileBytes[writePtr++] = (voidTypeIdx >> 24) & 0xff;

  // parameters_off = 0
  fileBytes[writePtr++] = 0; fileBytes[writePtr++] = 0; fileBytes[writePtr++] = 0; fileBytes[writePtr++] = 0;

  // Proto 1: (Landroid/content/Context;)V
  fileBytes[writePtr++] = shortyVLIdx & 0xff;
  fileBytes[writePtr++] = (shortyVLIdx >> 8) & 0xff;
  fileBytes[writePtr++] = (shortyVLIdx >> 16) & 0xff;
  fileBytes[writePtr++] = (shortyVLIdx >> 24) & 0xff;

  fileBytes[writePtr++] = voidTypeIdx & 0xff;
  fileBytes[writePtr++] = (voidTypeIdx >> 8) & 0xff;
  fileBytes[writePtr++] = (voidTypeIdx >> 16) & 0xff;
  fileBytes[writePtr++] = (voidTypeIdx >> 24) & 0xff;

  // parameters_off = proto1ParamsOff
  fileBytes[writePtr++] = proto1ParamsOff & 0xff;
  fileBytes[writePtr++] = (proto1ParamsOff >> 8) & 0xff;
  fileBytes[writePtr++] = (proto1ParamsOff >> 16) & 0xff;
  fileBytes[writePtr++] = (proto1ParamsOff >> 24) & 0xff;

  // --- Write Method IDs ---
  writePtr = methodIdsOff;
  for (const m of sortedMethods) {
    const classIdx = typeNames.indexOf(m.classType);
    const nameIdx = allStrings.indexOf(m.name);

    fileBytes[writePtr++] = classIdx & 0xff;
    fileBytes[writePtr++] = (classIdx >> 8) & 0xff;

    fileBytes[writePtr++] = m.proto & 0xff;
    fileBytes[writePtr++] = (m.proto >> 8) & 0xff;

    fileBytes[writePtr++] = nameIdx & 0xff;
    fileBytes[writePtr++] = (nameIdx >> 8) & 0xff;
    fileBytes[writePtr++] = (nameIdx >> 16) & 0xff;
    fileBytes[writePtr++] = (nameIdx >> 24) & 0xff;
  }

  // --- Write Class Defs ---
  writePtr = classDefsOff;
  const superclassTypeIdx = typeNames.indexOf(superclass);
  const sourceFileStrIdx = allStrings.indexOf(sourceFile);

  for (let i = 0; i < numClasses; i++) {
    const className = sortedClassNames[i];
    const classTypeIdx = typeNames.indexOf(className);

    // class_idx
    fileBytes[writePtr++] = classTypeIdx & 0xff;
    fileBytes[writePtr++] = (classTypeIdx >> 8) & 0xff;
    fileBytes[writePtr++] = (classTypeIdx >> 16) & 0xff;
    fileBytes[writePtr++] = (classTypeIdx >> 24) & 0xff;

    // access_flags: ACC_PUBLIC = 0x0001
    fileBytes[writePtr++] = 1;
    fileBytes[writePtr++] = 0;
    fileBytes[writePtr++] = 0;
    fileBytes[writePtr++] = 0;

    // superclass_idx
    fileBytes[writePtr++] = superclassTypeIdx & 0xff;
    fileBytes[writePtr++] = (superclassTypeIdx >> 8) & 0xff;
    fileBytes[writePtr++] = (superclassTypeIdx >> 16) & 0xff;
    fileBytes[writePtr++] = (superclassTypeIdx >> 24) & 0xff;

    // interfaces_off = 0
    fileBytes[writePtr++] = 0; fileBytes[writePtr++] = 0; fileBytes[writePtr++] = 0; fileBytes[writePtr++] = 0;

    // source_file_idx
    fileBytes[writePtr++] = sourceFileStrIdx & 0xff;
    fileBytes[writePtr++] = (sourceFileStrIdx >> 8) & 0xff;
    fileBytes[writePtr++] = (sourceFileStrIdx >> 16) & 0xff;
    fileBytes[writePtr++] = (sourceFileStrIdx >> 24) & 0xff;

    // annotations_off = 0
    fileBytes[writePtr++] = 0; fileBytes[writePtr++] = 0; fileBytes[writePtr++] = 0; fileBytes[writePtr++] = 0;

    // class_data_off
    const cDataOff = classDataOffsets[i];
    fileBytes[writePtr++] = cDataOff & 0xff;
    fileBytes[writePtr++] = (cDataOff >> 8) & 0xff;
    fileBytes[writePtr++] = (cDataOff >> 16) & 0xff;
    fileBytes[writePtr++] = (cDataOff >> 24) & 0xff;

    // static_values_off = 0
    fileBytes[writePtr++] = 0; fileBytes[writePtr++] = 0; fileBytes[writePtr++] = 0; fileBytes[writePtr++] = 0;
  }

  // --- Write Type List Bytes ---
  fileBytes.set(new Uint8Array(typeListBytes), proto1ParamsOff);

  // --- Write Constructor Code Item Bytes ---
  fileBytes.set(new Uint8Array(constructorCodeBytes), constructorCodeOff);

  // --- Write showDialog Code Item Bytes ---
  fileBytes.set(new Uint8Array(showDialogCodeBytes), showDialogCodeOff);

  // --- Write Class Data Bytes ---
  fileBytes.set(new Uint8Array(classDataBytes), currentClassDataOff);

  // --- Write String Data Bytes ---
  fileBytes.set(new Uint8Array(stringDataBytes), stringDataStartOff);

  // --- Write Map List Bytes ---
  fileBytes.set(new Uint8Array(mapListBytes), mapListOff);

  // --- Calculate SHA-1 Signature ---
  const shaSignature = sha1(fileBytes.subarray(32));
  fileBytes.set(shaSignature, 12);

  // --- Calculate Adler-32 Checksum ---
  const checksum = calculateAdler32(fileBytes.subarray(12));
  fileBytes[8] = checksum & 0xff;
  fileBytes[9] = (checksum >> 8) & 0xff;
  fileBytes[10] = (checksum >> 16) & 0xff;
  fileBytes[11] = (checksum >> 24) & 0xff;

  return fileBytes;
}
