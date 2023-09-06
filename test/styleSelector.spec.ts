import { expect } from 'chai';

import { StyleSelector } from '../lib';

describe( 'StyleSelector', (): void => {
  describe( 'constructor', (): void => {
    it( 'should initialize with empty class names list', (): void => {
      // Act
      const selector = new StyleSelector();

      // Assert
      expect( ( selector as any ).classNames.length ).to.equal( 0 );
    } );

    it( 'should initialize with class names parsed from string if provided', (): void => {
      // Act
      const selector = new StyleSelector( '.a.testClass.selected' );

      // Assert
      expect( ( selector as any ).classNames.length ).to.equal( 3 );
      expect( ( selector as any ).classNames[ 0 ] ).to.equal( 'a' );
      expect( ( selector as any ).classNames[ 1 ] ).to.equal( 'testClass' );
      expect( ( selector as any ).classNames[ 2 ] ).to.equal( 'selected' );
    } );

    it( 'should ignore parameter if the string passed does not start with a period', (): void => {
      // Act
      const selector = new StyleSelector( 'selected' );

      // Assert
      expect( ( selector as any ).classNames.length ).to.equal( 0 );
    } );
  } );

  describe( 'match', (): void => {
    it( 'should return true if selectors are equal', (): void => {
      // Arrange
      const elementClass = new StyleSelector( '.a' );
      const ruleSelector = new StyleSelector( '.a' );

      // Act
      const result = elementClass.match( ruleSelector );

      // Assert
      expect( result ).to.be.true;
    } );

    it( 'should return true if selectors are equal but order is different', (): void => {
      // Arrange
      const elementClass = new StyleSelector( '.a.b' );
      const ruleSelector = new StyleSelector( '.b.a' );

      // Act
      const result = elementClass.match( ruleSelector );

      // Assert
      expect( result ).to.be.true;
    } );

    it( 'should return false if selectors are different', (): void => {
      // Arrange
      const elementClass = new StyleSelector( '.a' );
      const ruleSelector = new StyleSelector( '.b' );

      // Act
      const result = elementClass.match( ruleSelector );

      // Assert
      expect( result ).to.be.false;
    } );

    it( 'should return true if class names are all contained in element class', (): void => {
      // Arrange
      const elementClass = new StyleSelector( '.a.b.c' );
      const ruleSelector = new StyleSelector( '.a.c' );

      // Act
      const result = elementClass.match( ruleSelector );

      // Assert
      expect( result ).to.be.true;
    } );

    it( 'should return false if element class is missing class names from rule selector',
      (): void => {
        // Arrange
        const elementClass = new StyleSelector( '.a.c' );
        const ruleSelector = new StyleSelector( '.a.b.c' );

        // Act
        const result = elementClass.match( ruleSelector );

        // Assert
        expect( result ).to.be.false;
      }
    );

    it( 'should return false if element class is empty', (): void => {
      // Arrange
      const elementClass = new StyleSelector();
      const ruleSelector = new StyleSelector( '.a' );

      // Act
      const result = elementClass.match( ruleSelector );

      // Assert
      expect( result ).to.be.false;
    } );

    it( 'should return false if rule selector is empty', (): void => {
      // Arrange
      const elementClass = new StyleSelector( '.a' );
      const ruleSelector = new StyleSelector();

      // Act
      const result = elementClass.match( ruleSelector );

      // Assert
      expect( result ).to.be.false;
    } );
  } );

  describe( 'comparePriority', (): void => {
    it( 'should return 0 if number of class names is equal', (): void => {
      // Arrange
      const elementClass = new StyleSelector( '.a.b.c' );
      const ruleSelector = new StyleSelector( '.d.e.f' );

      // Act
      const result = elementClass.comparePriority( ruleSelector );

      // Assert
      expect( result ).to.equal( 0 );
    } );

    it( 'should return 1 if first selector has more class names', (): void => {
      // Arrange
      const elementClass = new StyleSelector( '.a.b.c' );
      const ruleSelector = new StyleSelector( '.d.e' );

      // Act
      const result = elementClass.comparePriority( ruleSelector );

      // Assert
      expect( result ).to.equal( 1 );
    } );

    it( 'should return -1 if first selector has less class names', (): void => {
      // Arrange
      const elementClass = new StyleSelector( '.a.b' );
      const ruleSelector = new StyleSelector( '.c.d.e' );

      // Act
      const result = elementClass.comparePriority( ruleSelector );

      // Assert
      expect( result ).to.equal( -1 );
    } );

    it( 'should return 0 if both selectors are empty', (): void => {
      // Arrange
      const elementClass = new StyleSelector();
      const ruleSelector = new StyleSelector();

      // Act
      const result = elementClass.comparePriority( ruleSelector );

      // Assert
      expect( result ).to.equal( 0 );
    } );

    it( 'should return 1 if second selector is empty', (): void => {
      // Arrange
      const elementClass = new StyleSelector( '.a.b.c' );
      const ruleSelector = new StyleSelector();

      // Act
      const result = elementClass.comparePriority( ruleSelector );

      // Assert
      expect( result ).to.equal( 1 );
    } );

    it( 'should return -1 if first selector is empty', (): void => {
      // Arrange
      const elementClass = new StyleSelector();
      const ruleSelector = new StyleSelector( '.a.b.c' );

      // Act
      const result = elementClass.comparePriority( ruleSelector );

      // Assert
      expect( result ).to.equal( -1 );
    } );
  } );

  describe( 'printSelector', (): void => {
    it( 'should return the concatenated class names', (): void => {
      // Arrange
      const selector = new StyleSelector( '.a.b.c' );

      // Act
      const result = selector.printSelector();

      // Assert
      expect( result ).to.equal( '.a.b.c' );
    } );

    it( 'should return the empty string for empty selector', (): void => {
      // Arrange
      const selector = new StyleSelector( '' );

      // Act
      const result = selector.printSelector();

      // Assert
      expect( result ).to.equal( '' );
    } );
  } );

  describe( 'printSelectorSpaced', (): void => {
    it( 'should return the concatenated class names', (): void => {
      // Arrange
      const selector = new StyleSelector( '.a.b.c' );

      // Act
      const result = selector.printSelectorSpaced();

      // Assert
      expect( result ).to.equal( 'a b c' );
    } );

    it( 'should return the empty string for empty selector', (): void => {
      // Arrange
      const selector = new StyleSelector( '' );

      // Act
      const result = selector.printSelectorSpaced();

      // Assert
      expect( result ).to.equal( '' );
    } );
  } );
} );
