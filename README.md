# pratt

Pratt parser practical example written in Javascript.

Works with Node.js

```
node pratt.js
```

Or paste the code into a web browser console.

Output:

```
c^2 > 1-2+3 + d(4) * -((a+1)) + 8 * -5^4^3^2 + 1
{ gt 
  { pow 
    { var c } 
    { num 2 } } 
  { add 
    { add 
      { add 
        { add 
          { sub 
            { num 1 } 
            { num 2 } } 
          { num 3 } } 
        { mul 
          { call 
            { var d } 
            { num 4 } } 
          { neg 
            { add 
              { var a } 
              { num 1 } } } } } 
      { mul 
        { num 8 } 
        { neg 
          { pow 
            { num 5 } 
            { pow 
              { num 4 } 
              { pow 
                { num 3 } 
                { num 2 } } } } } } } 
    { num 1 } } }
```
