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
const classCD = new StyleSelector();
classCD.classNames.push( 'c' );
classCD.classNames.push( 'd' );
const classD = new StyleSelector();
classD.classNames.push( 'd' );
const classE = new StyleSelector();
classE.classNames.push( 'e' );
const classF = new StyleSelector();
classF.classNames.push( 'f' );
const classG = new StyleSelector();
classG.classNames.push( 'g' );

const styleA = new TestStyle( 'black' );
const styleB = new TestStyle( 'blue' );
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
const ruleBC = new StyleRule( classBC, styleBC );
const ruleCB = new StyleRule( classCB, styleCB );
const ruleCD = new StyleRule( classCD, styleCD );
const ruleD = new StyleRule( classD, styleD );
const ruleDE = new StyleRule( classE, styleDE );
const ruleDEF = new StyleRule( classF, styleDEF );
const ruleE = new StyleRule( classE, styleE );
const ruleEG = new StyleRule( classG, styleEG );

// Order does matter in style sheets.
styleSheet.rules.push( ruleE );
ruleE.childRules.push( ruleEG );
styleSheet.rules.push( ruleD );
ruleD.childRules.push( ruleDE );
ruleDE.childRules.push( ruleDEF );
styleSheet.rules.push( ruleCD );
styleSheet.rules.push( ruleCB );
styleSheet.rules.push( ruleBC );
styleSheet.rules.push( ruleA );
styleSheet.rules.push( ruleB );

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
      selectorChain.chain.push( classB );
      selectorChain.chain.push( classA );

      // Act
      const result = styleProcessor.calculateStyle( styleSheet, selectorChain, TestStyle );

      // Assert
      expect( result.fill ).to.equal( styleA.fill );
    } );

    it( 'should set attribute of a matching subclass', () => {
      // Arrange
      const selectorChain = new StyleSelectorChain();
      selectorChain.chain.push( classD );
      selectorChain.chain.push( classE );

      // Act
      const result = styleProcessor.calculateStyle( styleSheet, selectorChain, TestStyle );

      // Assert both styleD and styleE don't apply
      expect( result.fill ).to.equal( styleDE.fill );
    } );

    xit( 'should set attribute of a matching subclass ignoring unused intermediate classes', () => {
      // Arrange
      const classX = new StyleSelector();
      classX.classNames.push( 'x' );

      const selectorChain = new StyleSelectorChain();
      selectorChain.chain.push( classD );
      selectorChain.chain.push( classX );
      selectorChain.chain.push( classE );

      // Act
      const result = styleProcessor.calculateStyle( styleSheet, selectorChain, TestStyle );

      // Assert
      expect( result.fill ).to.equal( styleDE.fill );
    } );

    it( 'should set attribute of the lower subclass',
      () => {
      // Arrange
      const selectorChain = new StyleSelectorChain();
      selectorChain.chain.push( classD );
      selectorChain.chain.push( classE );
      selectorChain.chain.push( classG );

      // Act
      const result = styleProcessor.calculateStyle( styleSheet, selectorChain, TestStyle );

      // Assert styleEG overrules styleDE
      expect( result.fill ).to.equal( styleEG.fill );
    } );

    it( 'should set attribute of a matching subsubclass', () => {
      // Arrange
      const selectorChain = new StyleSelectorChain();
      selectorChain.chain.push( classD );
      selectorChain.chain.push( classE );
      selectorChain.chain.push( classF );

      // Act
      const result = styleProcessor.calculateStyle( styleSheet, selectorChain, TestStyle );

      // Assert
      expect( result.fill ).to.equal( styleDEF.fill );
    } );

    xit( 'should set attribute of more specific style rule',
      () => {
      // Arrange
      const selectorChain = new StyleSelectorChain();
      selectorChain.chain.push( classCB );

      // Act
      const result = styleProcessor.calculateStyle( styleSheet, selectorChain, TestStyle );

      // Assert styleCB overrules styleB
      expect( result.fill ).to.equal( styleCB.fill );
    } );

    it( 'should ignore order in selector and use the style last in the style sheet', () => {
      // Arrange
      // Test only works if there are no rules for classAB and classBA in the style sheet.
      const classAB = new StyleSelector();
      classAB.classNames.push( 'a' );
      classAB.classNames.push( 'b' );
      const selectorChainAB = new StyleSelectorChain();
      selectorChainAB.chain.push( classAB );

      const classBA = new StyleSelector();
      classBA.classNames.push( 'b' );
      classBA.classNames.push( 'a' );
      const selectorChainBA = new StyleSelectorChain();
      selectorChainBA.chain.push( classBA );

      // Act
      const resultAB = styleProcessor.calculateStyle( styleSheet, selectorChainAB, TestStyle );
      const resultBA = styleProcessor.calculateStyle( styleSheet, selectorChainBA, TestStyle );

      // Assert
      expect( resultAB.fill ).to.equal( styleB.fill );
      expect( resultBA.fill ).to.equal( styleB.fill );
    } );

    xit( 'should ignore order in selector and use the combinated style last in the style sheet',
      () => {
      // Arrange
      const selectorChainBC = new StyleSelectorChain();
      selectorChainBC.chain.push( classBC );

      const selectorChainCB = new StyleSelectorChain();
      selectorChainCB.chain.push( classCB );

      // Act
      const resultBC = styleProcessor.calculateStyle( styleSheet, selectorChainBC, TestStyle );
      const resultCB = styleProcessor.calculateStyle( styleSheet, selectorChainCB, TestStyle );

      // Assert
      expect( resultBC.fill ).to.equal( styleBC.fill );
      expect( resultCB.fill ).to.equal( styleBC.fill );
    } );

    xit( 'should ignore order of subgroups in selector and use the style last in the style sheet',
      () => {
      // Arrange
      const classBCD = new StyleSelector();
      classBCD.classNames.push( 'b' );
      classBCD.classNames.push( 'c' );
      classBCD.classNames.push( 'd' );

      const selectorChain = new StyleSelectorChain();
      selectorChain.chain.push( classBCD );

      // Act
      const result = styleProcessor.calculateStyle( styleSheet, selectorChain, TestStyle );

      // Assert styleBC overrules styleCD
      expect( result.fill ).to.equal( styleBC.fill );
    } );
  } );
} );
