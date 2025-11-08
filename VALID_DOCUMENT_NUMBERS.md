# Valid Document Numbers for Testing

## Aadhaar Numbers (10 valid numbers)
```
123456789012
234567890123
345678901234
456789012345
567890123456
678901234567
789012345678
890123456789
901234567890
012345678901
```

## Income Certificate Numbers (10 valid numbers)
```
INC001
INC002
INC003
INC004
INC005
INC006
INC007
INC008
INC009
INC010
```

## Student Registration Numbers (10 valid numbers)
```
STU001
STU002
STU003
STU004
STU005
STU006
STU007
STU008
STU009
STU010
```

## Testing

### Valid Registration Example:
- Aadhaar: `123456789012`
- Income Certificate: `INC001`
- Student Registration: `STU001`

Result: All verified ✅, borrower marked as trusted

### Invalid Registration Example:
- Aadhaar: `999999999999`
- Income Certificate: `INC999`
- Student Registration: `STU999`

Result: Not verified ❌

---

**Note:** Income Certificate and Student Registration numbers are case-insensitive (automatically converted to uppercase).

