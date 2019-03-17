import { expect } from 'chai';

import {
  IStyleDeclaration, StyleProcessor, StyleRule, StyleSelector, StyleSelectorChain, StyleSheet
} from '../lib';

/**
 * Implementation of IStyleDeclaration for the tests.
 */
class TestStyle implements IStyleDeclaration {
  public fill: string | null = null;
  public stroke: string | null = null;

  public constructor( fill?: string, stroke?: string ) {
    if ( fill ) {
      this.fill = fill;
    }
    if ( stroke ) {
      this.stroke = stroke;
    }
  }

  public overrideWith( style: TestStyle ): void {
    if ( style.fill !== null ) {
      this.fill = style.fill;
    }
    if ( style.stroke !== null ) {
      this.stroke = style.stroke;
    }
  }
}

/**
 * Create a style sheet for the tests.
 */
const classA = new StyleSelector();
classA.classNames.push( 'a' );
const classB = new StyleSelector();
classB.classNames.push( 'b' );
const classBC = new StyleSelector();
classBC.classNames.push( 'b' );
classBC.classNames.push( 'c' );
const classCB = new StyleSelector();
classCB.classNames.push( 'c' );
classCB.classNames.push( 'b' );
const classD = new StyleSelector();
classD.classNames.push( 'd' );

const styleA = new TestStyle( 'black' );
const styleB = new TestStyle( 'blue' );
const styleBC = new TestStyle( 'cyan' );
const styleCB = new TestStyle( 'green' );
const styleD = new TestStyle( 'magenta', 'white' );
const styleDA = new TestStyle( 'red' );
const styleDAB = new TestStyle( 'yellow' );

const styleSheet = new StyleSheet();

const ruleA = new StyleRule( classA, styleA );
styleSheet.rules.push( ruleA );
const ruleB = new StyleRule( classB, styleB );
styleSheet.rules.push( ruleB );
const ruleBC = new StyleRule( classBC, styleBC );
styleSheet.rules.push( ruleBC );
const ruleCB = new StyleRule( classCB, styleCB );
styleSheet.rules.push( ruleCB );
const ruleD = new StyleRule( classD, styleD );
styleSheet.rules.push( ruleD );
const ruleDA = new StyleRule( classA, styleDA );
ruleD.childRules.push( ruleDA );
const ruleDAB = new StyleRule( classB, styleDAB );
ruleDA.childRules.push( ruleDAB );

const styleProcessor = new StyleProcessor<TestStyle>();

describe( 'StyleProcessor', () => {
  describe( 'process', () => {
    it( 'should return a TestStyle object', () => {
      // Arrange
      const selectorChain = new StyleSelectorChain();
      selectorChain.chain.push( classA );

      // Act
      const result = styleProcessor.calculateStyle( styleSheet, selectorChain, TestStyle );

      // Assert
      expect( result ).to.be.instanceof( TestStyle );
    } );

    it( 'should set attribute of a matching class', () => {
      // Arrange
      const selectorChain = new StyleSelectorChain();
      selectorChain.chain.push( classA );

      // Act
      const result = styleProcessor.calculateStyle( styleSheet, selectorChain, TestStyle );

      // Assert
      expect( result.fill ).to.equal( styleA.fill );
    } );

    it( 'should set attribute of a matching class for a child element', () => {
      // Arrange
      const selectorChain = new StyleSelectorChain();
      selectorChain.chain.push( classA );
      selectorChain.chain.push( classB );

      // Act
      const result = styleProcessor.calculateStyle( styleSheet, selectorChain, TestStyle );

      // Assert
      expect( result.fill ).to.equal( styleB.fill );
    } );

    it( 'should set attribute of a matching subclass', () => {
      // Arrange
      const selectorChain = new StyleSelectorChain();
      selectorChain.chain.push( classD );
      selectorChain.chain.push( classA );

      // Act
      const result = styleProcessor.calculateStyle( styleSheet, selectorChain, TestStyle );

      // Assert
      expect( result.fill ).to.equal( styleDA.fill );
    } );

    it( 'should set attribute of a matching subsubclass', () => {
      // Arrange
      const selectorChain = new StyleSelectorChain();
      selectorChain.chain.push( classD );
      selectorChain.chain.push( classA );
      selectorChain.chain.push( classB );

      // Act
      const result = styleProcessor.calculateStyle( styleSheet, selectorChain, TestStyle );

      // Assert
      expect( result.fill ).to.equal( styleDAB.fill );
    } );
  } );
} );
