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
const classA = new StyleSelector( '.a' );
const classB = new StyleSelector( '.b' );
const classC = new StyleSelector( '.c' );
const classBC = new StyleSelector( '.b.c' );
const classCB = new StyleSelector( '.c.b' );
const classCD = new StyleSelector( '.c.d' );
const classD = new StyleSelector( '.d' );
const classE = new StyleSelector( '.e' );
const classF = new StyleSelector( '.f' );
const classG = new StyleSelector( '.g' );

const styleA = new TestStyle( 'black' );
const styleB = new TestStyle( 'blue' );
const styleC = new TestStyle( 'brown' );
const styleBC = new TestStyle( 'cyan' );
const styleCB = new TestStyle( 'gray' );
const styleCD = new TestStyle( 'green' );
const styleD = new TestStyle( 'magenta' );
const styleDE = new TestStyle( 'orange' );
const styleDEF = new TestStyle( 'red' );
const styleE = new TestStyle( 'white' );
const styleEG = new TestStyle( 'yellow' );

const styleSheet = new StyleSheet();

const ruleA = new StyleRule( classA, styleA );
const ruleB = new StyleRule( classB, styleB );
const ruleC = new StyleRule( classC, styleC );
const ruleBC = new StyleRule( classBC, styleBC );
const ruleCB = new StyleRule( classCB, styleCB );
const ruleCD = new StyleRule( classCD, styleCD );
const ruleD = new StyleRule( classD, styleD );
const ruleDE = new StyleRule( classE, styleDE );
const ruleDEF = new StyleRule( classF, styleDEF );
const ruleE = new StyleRule( classE, styleE );
const ruleEG = new StyleRule( classG, styleEG );

// Order does matter in style sheets.
styleSheet.addRule( ruleE );
ruleE.childRules.addRule( ruleEG );
styleSheet.addRule( ruleD );
ruleD.childRules.addRule( ruleDE );
ruleDE.childRules.addRule( ruleDEF );
styleSheet.addRule( ruleCD );
styleSheet.addRule( ruleCB );
styleSheet.addRule( ruleBC );
styleSheet.addRule( ruleA );
styleSheet.addRule( ruleB );
styleSheet.addRule( ruleC );

const styleProcessor = new StyleProcessor<TestStyle>();

describe( 'StyleProcessor', () => {
  describe( 'process', () => {
    it( 'should return a TestStyle object', () => {
      // Arrange
      const selectorChain = new StyleSelectorChain();
      selectorChain.addSelector( classA );

      // Act
      const result = styleProcessor.calculateStyle( styleSheet, selectorChain, TestStyle );

      // Assert
      expect( result ).to.be.instanceof( TestStyle );
    } );

    it( 'should set attribute to null if selector chain is empty', () => {
      // Arrange
      const selectorChain = new StyleSelectorChain();

      // Act
      const result = styleProcessor.calculateStyle( styleSheet, selectorChain, TestStyle );

      // Assert
      expect( result.fill ).to.be.null;
    } );

    it( 'should set attribute to null if style sheet is empty', () => {
      // Arrange
      const selectorChain = new StyleSelectorChain();
      selectorChain.addSelector( classA );

      const emptyStyleSheet = new StyleSheet();

      // Act
      const result = styleProcessor.calculateStyle( emptyStyleSheet, selectorChain, TestStyle );

      // Assert
      expect( result.fill ).to.be.null;
    } );

    it( 'should set attribute of a matching class', () => {
      // Arrange
      const selectorChain = new StyleSelectorChain();
      selectorChain.addSelector( classA );

      // Act
      const result = styleProcessor.calculateStyle( styleSheet, selectorChain, TestStyle );

      // Assert
      expect( result.fill ).to.equal( styleA.fill );
    } );

    it( 'should set attribute of a matching class for a child element', () => {
      // Arrange
      const selectorChain = new StyleSelectorChain();
      selectorChain.addSelector( classB );
      selectorChain.addSelector( classA );

      // Act
      const result = styleProcessor.calculateStyle( styleSheet, selectorChain, TestStyle );

      // Assert
      expect( result.fill ).to.equal( styleA.fill );
    } );

    it( 'should pass attribute of a matching class to a child element with a non-matching class',
      () => {
      // Arrange
      const selectorChain = new StyleSelectorChain();
      selectorChain.addSelector( classA );
      selectorChain.addSelector( classF );

      // Act
      const result = styleProcessor.calculateStyle( styleSheet, selectorChain, TestStyle );

      // Assert
      expect( result.fill ).to.equal( styleA.fill );
    } );

    it( 'should set attribute of a matching subclass', () => {
      // Arrange
      const selectorChain = new StyleSelectorChain();
      selectorChain.addSelector( classD );
      selectorChain.addSelector( classE );

      // Act
      const result = styleProcessor.calculateStyle( styleSheet, selectorChain, TestStyle );

      // Assert both styleD and styleE don't apply
      expect( result.fill ).to.equal( styleDE.fill );
    } );

    it( 'should set attribute of a matching subclass ignoring unused intermediate classes', () => {
      // Arrange
      const classX = new StyleSelector( '.x' );

      const selectorChain = new StyleSelectorChain();
      selectorChain.addSelector( classD );
      selectorChain.addSelector( classX );
      selectorChain.addSelector( classE );

      // Act
      const result = styleProcessor.calculateStyle( styleSheet, selectorChain, TestStyle );

      // Assert
      expect( result.fill ).to.equal( styleDE.fill );
    } );

    it( 'should pass attribute of a matching subclass to a child element with a non-matching class',
      () => {
      // Arrange
      const classX = new StyleSelector( '.x' );

      const selectorChain = new StyleSelectorChain();
      selectorChain.addSelector( classX );
      selectorChain.addSelector( classD );
      selectorChain.addSelector( classE );
      selectorChain.addSelector( classX );

      // Act
      const result = styleProcessor.calculateStyle( styleSheet, selectorChain, TestStyle );

      // Assert
      expect( result.fill ).to.equal( styleDE.fill );
    } );

    it( 'should set attribute of the lower subclass', () => {
      // Arrange
      const selectorChain = new StyleSelectorChain();
      selectorChain.addSelector( classD );
      selectorChain.addSelector( classE );
      selectorChain.addSelector( classG );

      // Act
      const result = styleProcessor.calculateStyle( styleSheet, selectorChain, TestStyle );

      // Assert styleEG overrules styleDE
      expect( result.fill ).to.equal( styleEG.fill );
    } );

    it( 'should set attribute of a matching subsubclass', () => {
      // Arrange
      const selectorChain = new StyleSelectorChain();
      selectorChain.addSelector( classD );
      selectorChain.addSelector( classE );
      selectorChain.addSelector( classF );

      // Act
      const result = styleProcessor.calculateStyle( styleSheet, selectorChain, TestStyle );

      // Assert
      expect( result.fill ).to.equal( styleDEF.fill );
    } );

    it( 'should set attribute of more specific style rule', () => {
      // Arrange
      const selectorChain = new StyleSelectorChain();
      selectorChain.addSelector( classCB );

      // Act
      const result = styleProcessor.calculateStyle( styleSheet, selectorChain, TestStyle );

      // Assert styleBC overrules styleB and styleC
      expect( result.fill ).to.equal( styleBC.fill );
    } );

    it( 'should ignore order in selector and use the style last in the style sheet', () => {
      // Arrange
      // Test only works if there are no rules for classAB and classBA in the style sheet.
      const classAB = new StyleSelector( '.a.b' );
      const selectorChainAB = new StyleSelectorChain();
      selectorChainAB.addSelector( classAB );

      const classBA = new StyleSelector( '.b.a' );
      const selectorChainBA = new StyleSelectorChain();
      selectorChainBA.addSelector( classBA );

      // Act
      const resultAB = styleProcessor.calculateStyle( styleSheet, selectorChainAB, TestStyle );
      const resultBA = styleProcessor.calculateStyle( styleSheet, selectorChainBA, TestStyle );

      // Assert
      expect( resultAB.fill ).to.equal( styleB.fill );
      expect( resultBA.fill ).to.equal( styleB.fill );
    } );

    it( 'should ignore order in selector and use the combinated style last in the style sheet',
      () => {
      // Arrange
      const selectorChainBC = new StyleSelectorChain();
      selectorChainBC.addSelector( classBC );

      const selectorChainCB = new StyleSelectorChain();
      selectorChainCB.addSelector( classCB );

      // Act
      const resultBC = styleProcessor.calculateStyle( styleSheet, selectorChainBC, TestStyle );
      const resultCB = styleProcessor.calculateStyle( styleSheet, selectorChainCB, TestStyle );

      // Assert
      expect( resultBC.fill ).to.equal( styleBC.fill );
      expect( resultCB.fill ).to.equal( styleBC.fill );
    } );

    it( 'should ignore order of subgroups in selector and use the style last in the style sheet',
      () => {
      // Arrange
      const classBCD = new StyleSelector( '.b.c.d' );

      const selectorChain = new StyleSelectorChain();
      selectorChain.addSelector( classBCD );

      // Act
      const result = styleProcessor.calculateStyle( styleSheet, selectorChain, TestStyle );

      // Assert styleBC overrules styleCD
      expect( result.fill ).to.equal( styleBC.fill );
    } );

    xit( 'should set attribute of the deepest matching class', () => {
      // Arrange
      const selectorChain = new StyleSelectorChain();
      selectorChain.addSelector( classD );
      selectorChain.addSelector( classE );
      selectorChain.addSelector( classA );

      // Act
      const result = styleProcessor.calculateStyle( styleSheet, selectorChain, TestStyle );

      // Assert styleA overrules styleDE
      expect( result.fill ).to.equal( styleA.fill );
    } );
  } );
} );
