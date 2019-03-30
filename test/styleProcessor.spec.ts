import { expect } from 'chai';

import { StyleProcessor, StyleSelector, StyleSelectorChain, StyleSheet } from '../lib';
import { TestStyle } from './testStyle';

const styleProcessor = new StyleProcessor<TestStyle>();

describe( 'StyleProcessor', () => {
  describe( 'calculateStyle', () => {
    it( 'should return a TestStyle object', () => {
      // Arrange
      const styleSheet = new StyleSheet<TestStyle>();
      styleSheet.parseFromString(
        `.a {
          fill: green;
        }`, TestStyle
      );

      const selectorChain = new StyleSelectorChain();
      selectorChain.addSelector( new StyleSelector( '.a' ) );

      // Act
      const result = styleProcessor.calculateStyle( styleSheet, selectorChain, TestStyle );

      // Assert
      expect( result ).to.be.instanceof( TestStyle );
    } );

    it( 'should set attribute to null if selector chain is empty', () => {
      // Arrange
      const styleSheet = new StyleSheet<TestStyle>();
      styleSheet.parseFromString(
        `.a {
          fill: green;
        }`, TestStyle
      );

      const selectorChain = new StyleSelectorChain();

      // Act
      const result = styleProcessor.calculateStyle( styleSheet, selectorChain, TestStyle );

      // Assert
      expect( result.fill ).to.be.null;
    } );

    it( 'should set attribute to null if style sheet is empty', () => {
      // Arrange
      const styleSheet = new StyleSheet<TestStyle>();

      const selectorChain = new StyleSelectorChain();
      selectorChain.addSelector( new StyleSelector( '.a' ) );

      // Act
      const result = styleProcessor.calculateStyle( styleSheet, selectorChain, TestStyle );

      // Assert
      expect( result.fill ).to.be.null;
    } );

    it( 'should set attribute of a matching class', () => {
      // Arrange
      const styleSheet = new StyleSheet<TestStyle>();
      styleSheet.parseFromString(
        `.a {
          fill: green;
        }`, TestStyle
      );

      const selectorChain = new StyleSelectorChain();
      selectorChain.addSelector( new StyleSelector( '.a' ) );

      // Act
      const result = styleProcessor.calculateStyle( styleSheet, selectorChain, TestStyle );

      // Assert
      expect( result.fill ).to.equal( 'green' );
    } );

    it( 'should set attribute of a matching class for a child element', () => {
      // Arrange
      const styleSheet = new StyleSheet<TestStyle>();
      styleSheet.parseFromString(
        `.a {
          fill: green;
        }
        .b {
          fill: red;
        }`, TestStyle
      );

      const selectorChain = new StyleSelectorChain();
      selectorChain.addSelector( new StyleSelector( '.b' ) );
      selectorChain.addSelector( new StyleSelector( '.a' ) );

      // Act
      const result = styleProcessor.calculateStyle( styleSheet, selectorChain, TestStyle );

      // Assert
      expect( result.fill ).to.equal( 'green' );
    } );

    it( 'should pass attribute of a matching class to a child element with a non-matching class',
      () => {
      // Arrange
      const styleSheet = new StyleSheet<TestStyle>();
      styleSheet.parseFromString(
        `.a {
          fill: green;
        }`, TestStyle
      );

      const selectorChain = new StyleSelectorChain();
      selectorChain.addSelector( new StyleSelector( '.a' ) );
      selectorChain.addSelector( new StyleSelector( '.b' ) );

      // Act
      const result = styleProcessor.calculateStyle( styleSheet, selectorChain, TestStyle );

      // Assert
      expect( result.fill ).to.equal( 'green' );
    } );

    it( 'should set attribute of a matching subclass', () => {
      // Arrange
      const styleSheet = new StyleSheet<TestStyle>();
      styleSheet.parseFromString(
        `.a {
          fill: red;
          .b {
            fill: green;
          }
        }
        .b {
          fill: red;
        }`, TestStyle
      );

      const selectorChain = new StyleSelectorChain();
      selectorChain.addSelector( new StyleSelector( '.a' ) );
      selectorChain.addSelector( new StyleSelector( '.b' ) );

      // Act
      const result = styleProcessor.calculateStyle( styleSheet, selectorChain, TestStyle );

      // Assert
      expect( result.fill ).to.equal( 'green' );
    } );

    it( 'should set attribute of a matching subclass ignoring unused intermediate classes', () => {
      // Arrange
      const styleSheet = new StyleSheet<TestStyle>();
      styleSheet.parseFromString(
        `.a {
          fill: red;
          .c {
            fill: green;
          }
        }`, TestStyle
      );

      const selectorChain = new StyleSelectorChain();
      selectorChain.addSelector( new StyleSelector( '.a' ) );
      selectorChain.addSelector( new StyleSelector( '.b' ) );
      selectorChain.addSelector( new StyleSelector( '.c' ) );

      // Act
      const result = styleProcessor.calculateStyle( styleSheet, selectorChain, TestStyle );

      // Assert
      expect( result.fill ).to.equal( 'green' );
    } );

    it( 'should pass attribute of a matching subclass to a child element with a non-matching class',
      () => {
      // Arrange
      const styleSheet = new StyleSheet<TestStyle>();
      styleSheet.parseFromString(
        `.b {
          fill: red;
          .c {
            fill: green;
          }
        }`, TestStyle
      );

      const selectorChain = new StyleSelectorChain();
      selectorChain.addSelector( new StyleSelector( '.a' ) );
      selectorChain.addSelector( new StyleSelector( '.b' ) );
      selectorChain.addSelector( new StyleSelector( '.c' ) );
      selectorChain.addSelector( new StyleSelector( '.d' ) );

      // Act
      const result = styleProcessor.calculateStyle( styleSheet, selectorChain, TestStyle );

      // Assert
      expect( result.fill ).to.equal( 'green' );
    } );

    it( 'should set attribute of the lower subclass', () => {
      // Arrange
      const styleSheet = new StyleSheet<TestStyle>();
      styleSheet.parseFromString(
        `.c {
          fill: red;
          .d {
            fill: green;
          }
        }
        .b {
          fill: red;
          .c {
            fill: red;
          }
        }
        .a {
          fill: red;
          .b {
            fill: red;
            .c {
              fill: red;
            }
          }
        }`, TestStyle
      );

      const selectorChain = new StyleSelectorChain();
      selectorChain.addSelector( new StyleSelector( '.a' ) );
      selectorChain.addSelector( new StyleSelector( '.b' ) );
      selectorChain.addSelector( new StyleSelector( '.c' ) );
      selectorChain.addSelector( new StyleSelector( '.d' ) );

      // Act
      const result = styleProcessor.calculateStyle( styleSheet, selectorChain, TestStyle );

      // Assert
      expect( result.fill ).to.equal( 'green' );
    } );

    it( 'should set attribute of the longest subclass if classes start equally deep', () => {
      // Arrange
      const styleSheet = new StyleSheet<TestStyle>();
      styleSheet.parseFromString(
        `.a {
          fill: red;
          .b {
            fill: red;
            .c {
              fill: green;
            }
          }
        }
        .a {
          fill: red;
          .c {
            fill: red;
          }
        }
        .b {
          fill: red;
          .c {
            fill: red;
          }
        }
        .c {
          fill: red;
        }`, TestStyle
      );

      const selectorChain = new StyleSelectorChain();
      selectorChain.addSelector( new StyleSelector( '.a' ) );
      selectorChain.addSelector( new StyleSelector( '.b' ) );
      selectorChain.addSelector( new StyleSelector( '.c' ) );
      selectorChain.addSelector( new StyleSelector( '.d' ) );

      // Act
      const result = styleProcessor.calculateStyle( styleSheet, selectorChain, TestStyle );

      // Assert
      expect( result.fill ).to.equal( 'green' );
    } );

    it( 'should set attribute of a matching subsubclass', () => {
      // Arrange
      const styleSheet = new StyleSheet<TestStyle>();
      styleSheet.parseFromString(
        `.a {
          fill: red;
          .b {
            fill: red;
            .c {
              fill: green;
            }
          }
        }
        .b {
          fill: red;
        }
        .c {
          fill: red;
        }`, TestStyle
      );

      const selectorChain = new StyleSelectorChain();
      selectorChain.addSelector( new StyleSelector( '.a' ) );
      selectorChain.addSelector( new StyleSelector( '.b' ) );
      selectorChain.addSelector( new StyleSelector( '.c' ) );

      // Act
      const result = styleProcessor.calculateStyle( styleSheet, selectorChain, TestStyle );

      // Assert
      expect( result.fill ).to.equal( 'green' );
    } );

    it( 'should set attribute of style rule with more specific selector', () => {
      // Arrange
      const styleSheet = new StyleSheet<TestStyle>();
      styleSheet.parseFromString(
        `.a.b {
          fill: green;
        }
        .a {
          fill: red;
        }
        .b {
          fill: red;
        }`, TestStyle
      );

      const selectorChain = new StyleSelectorChain();
      selectorChain.addSelector( new StyleSelector( '.a.b' ) );

      // Act
      const result = styleProcessor.calculateStyle( styleSheet, selectorChain, TestStyle );

      // Assert
      expect( result.fill ).to.equal( 'green' );
    } );

    it( 'should ignore order in selector and use the style last in the style sheet', () => {
      // Arrange
      const styleSheet = new StyleSheet<TestStyle>();
      styleSheet.parseFromString(
        `.a {
          fill: red;
        }
        .b {
          fill: green;
        }`, TestStyle
      );

      const selectorChainAB = new StyleSelectorChain();
      selectorChainAB.addSelector( new StyleSelector( '.a.b' ) );

      const selectorChainBA = new StyleSelectorChain();
      selectorChainBA.addSelector( new StyleSelector( '.b.a' ) );

      // Act
      const resultAB = styleProcessor.calculateStyle( styleSheet, selectorChainAB, TestStyle );
      const resultBA = styleProcessor.calculateStyle( styleSheet, selectorChainBA, TestStyle );

      // Assert
      expect( resultAB.fill ).to.equal( 'green' );
      expect( resultBA.fill ).to.equal( 'green' );
    } );

    it( 'should ignore order in selector and use the combinated style last in the style sheet',
      () => {
      // Arrange
      const styleSheet = new StyleSheet<TestStyle>();
      styleSheet.parseFromString(
        `.a.b {
          fill: red;
        }
        .b.a {
          fill: green;
        }`, TestStyle
      );

      const selectorChainAB = new StyleSelectorChain();
      selectorChainAB.addSelector( new StyleSelector( '.a.b' ) );

      const selectorChainBA = new StyleSelectorChain();
      selectorChainBA.addSelector( new StyleSelector( '.b.a' ) );

      // Act
      const resultAB = styleProcessor.calculateStyle( styleSheet, selectorChainAB, TestStyle );
      const resultBA = styleProcessor.calculateStyle( styleSheet, selectorChainBA, TestStyle );

      // Assert
      expect( resultAB.fill ).to.equal( 'green' );
      expect( resultBA.fill ).to.equal( 'green' );
    } );

    it( 'should ignore order of subgroups in selector and use the style last in the style sheet',
      () => {
      // Arrange
      const styleSheet = new StyleSheet<TestStyle>();
      styleSheet.parseFromString(
        `.b.c {
          fill: red;
        }
        .a.b {
          fill: green;
        }`, TestStyle
      );

      const selectorChain = new StyleSelectorChain();
      selectorChain.addSelector( new StyleSelector( '.a.b.c' ) );

      // Act
      const result = styleProcessor.calculateStyle( styleSheet, selectorChain, TestStyle );

      // Assert
      expect( result.fill ).to.equal( 'green' );
    } );

    it( 'should use the style last in the style sheet when both subclasses are equally long',
      () => {
      // Arrange
      const styleSheetAC = new StyleSheet<TestStyle>();
      styleSheetAC.parseFromString(
        `.b {
          fill: red;
          .c {
            fill: red;
          }
        }
        .a {
          fill: red;
          .c {
            fill: green;
          }
        }`, TestStyle
      );

      const styleSheetBC = new StyleSheet<TestStyle>();
      styleSheetBC.parseFromString(
        `.a {
          fill: red;
          .c {
            fill: red;
          }
        }
        .b {
          fill: red;
          .c {
            fill: green;
          }
        }`, TestStyle
      );

      const selectorChain = new StyleSelectorChain();
      selectorChain.addSelector( new StyleSelector( '.a' ) );
      selectorChain.addSelector( new StyleSelector( '.b' ) );
      selectorChain.addSelector( new StyleSelector( '.c' ) );

      // Act
      const resultAC = styleProcessor.calculateStyle( styleSheetAC, selectorChain, TestStyle );
      const resultBC = styleProcessor.calculateStyle( styleSheetBC, selectorChain, TestStyle );

      // Assert
      expect( resultAC.fill ).to.equal( 'green' );
      expect( resultBC.fill ).to.equal( 'green' );
    } );

    it( 'should set attribute of the deepest matching class', () => {
      // Arrange
      const styleSheet = new StyleSheet<TestStyle>();
      styleSheet.parseFromString(
        `.a {
          fill: red;
          .b {
            fill: red;
          }
        }
        .c {
          fill: green;
        }`, TestStyle
      );

      const selectorChain = new StyleSelectorChain();
      selectorChain.addSelector( new StyleSelector( '.a' ) );
      selectorChain.addSelector( new StyleSelector( '.b' ) );
      selectorChain.addSelector( new StyleSelector( '.c' ) );

      // Act
      const result = styleProcessor.calculateStyle( styleSheet, selectorChain, TestStyle );

      // Assert
      expect( result.fill ).to.equal( 'green' );
    } );

    it( 'should use parent class for attributes missing in the class of the child', () => {
      // Arrange
      const styleSheet = new StyleSheet<TestStyle>();
      styleSheet.parseFromString(
        `.a {
          fill: red;
          stroke: green;
        }
        .b {
          fill: green;
        }`, TestStyle
      );

      const selectorChain = new StyleSelectorChain();
      selectorChain.addSelector( new StyleSelector( '.a' ) );
      selectorChain.addSelector( new StyleSelector( '.b' ) );

      // Act
      const result = styleProcessor.calculateStyle( styleSheet, selectorChain, TestStyle );

      // Assert
      expect( result.fill ).to.equal( 'green' );
      expect( result.stroke ).to.equal( 'green' );
    } );
  } );
} );
