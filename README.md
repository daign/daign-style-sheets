# daign-style-sheets

[![CI][ci-icon]][ci-url]
[![Coverage][coveralls-icon]][coveralls-url]
[![NPM package][npm-icon]][npm-url]

### Simple style sheet processor.

## Installation

```sh
npm install @daign/style-sheets --save
```

## Usage

### What is it for?

Given you have a tree like data structure that you want to render in the browser. You might want to
use CSS if you are using SVG to display your objects. But if you also want to support rendering on
the canvas element you can't use CSS, because canvas does not support it for its graphic elements.
This is where this library comes into play. Create a CSS-like style sheet, assign class names to
your objects and let the library calculate which style to apply to each element.

### Creating the style class

The library does not define which attributes you can use in a style. You have to define this
yourself by implementing the IStyleDeclaration interface.

```typescript
import { IStyleDeclaration } from '@daign/style-sheets';

/**
 * Implementation of IStyleDeclaration.
 */
class MyStyle implements IStyleDeclaration {
  public fill: string | null = null;
  public stroke: string | null = null;

  /**
   * Returns whether the declaration is empty (all attributes are equal null).
   */
  public get isEmpty(): boolean {
    return ( this.fill === null && this.stroke === null );
  }

  /**
   * Constructor.
   */
  public constructor( fill?: string, stroke?: string ) {
    if ( fill ) {
      this.fill = fill;
    }
    if ( stroke ) {
      this.stroke = stroke;
    }
  }

  /**
   * Parse the value of an attribute from string.
   * @param name The name of the attribute.
   * @param value The value as a string.
   */
  public parseAttribute( name: string, value: string ): void {
    // If your attributes have a different type than string, then define how they should be parsed.
    if ( name === 'fill' ) {
      this.fill = value;
    } else if ( name === 'stroke' ) {
      this.stroke = value;
    }
  }

  /**
   * Copy style attributes from given style declaration but don't override already existing values.
   * @param declaration The style declaration whose values to use.
   */
  public complementWith( declaration: MyStyle ): void {
    if ( this.fill === null ) {
      this.fill = declaration.fill;
    }
    if ( this.stroke === null ) {
      this.stroke = declaration.stroke;
    }
  }
}
```

### Defining a style sheet

The style sheet only supports a very minimal set of instructions. For selectors only class names are
allowed. Nesting has to be done in a SCSS like syntax. Create the style sheet as a string or read it
from file.

```typescript
import { StyleSheet } from '@daign/style-sheet';

const styleSheet = new StyleSheet<MyStyle>();
styleSheet.parseFromString(
  `.button.active {
    .rectangle {
      fill: light-blue;
      stroke: blue;
    }
    .text {
      fill: black;
    }
  }
  .button.inactive {
    .rectangle {
      fill: light-gray;
      stroke: gray;
    }
    .text {
      fill: gray;
    }
  }
  .button.hidden {
    fill: none;
    stroke: none;
  }`, MyStyle
);
```

### Constructing the selector chain

Construct a selector chain from your document tree for each element to render.

If your document would look like this when expressed in XML:

```xml
<elem class="document">
  <elem class="button active">
    <elem class="rectangle">
      <elem class="text">
        Click me!
      </elem>
    </elem>
  </elem>
</elem>
```

Then the selector chain for the text element should be created like this:

```typescript
import { StyleSelector, StyleSelectorChain } from '@daign/style-sheet';

const selectorChain = new StyleSelectorChain();
selectorChain.addSelector( new StyleSelector( '.document' ) );
selectorChain.addSelector( new StyleSelector( '.button.active' ) );
selectorChain.addSelector( new StyleSelector( '.rectangle' ) );
selectorChain.addSelector( new StyleSelector( '.text' ) );
// Or use .addSelectorToFront() when constructing the other way around.
```

### Calculating the style

The priority logic of which rule applies first should be the same as in CSS. If you find any error
in the calculation please look at our unit tests to see if we have wrongly defined test cases or are
missing some.

```typescript
import { StyleProcessor } from '@daign/style-sheet';

const styleProcessor = new StyleProcessor<MyStyle>();

const result = styleProcessor.calculateStyle( styleSheet, selectorChain, MyStyle );
console.log( result.fill, result.stroke );
```

## Scripts

```bash
# Build
npm run build

# Run lint analysis
npm run lint

# Run unit tests with code coverage
npm run test

# Get a full lcov report
npm run coverage
```

[ci-icon]: https://github.com/daign/daign-style-sheets/workflows/CI/badge.svg
[ci-url]: https://github.com/daign/daign-style-sheets/actions
[coveralls-icon]: https://coveralls.io/repos/github/daign/daign-style-sheets/badge.svg?branch=master
[coveralls-url]: https://coveralls.io/github/daign/daign-style-sheets?branch=master
[npm-icon]: https://img.shields.io/npm/v/@daign/style-sheets.svg
[npm-url]: https://www.npmjs.com/package/@daign/style-sheets
