import { expect } from 'chai';

import { StyleSelector } from '../lib';

describe( 'StyleSelector', () => {
  describe( 'constructor', () => {
    it( 'should initialize with empty class names list', () => {
      // Act
      const selector = new StyleSelector();

      // Assert
      expect( ( selector as any ).classNames.length ).to.equal( 0 );
    } );

    it( 'should initialize with class names parsed from string if provided', () => {
      // Act
      const selector = new StyleSelector( '.a.testClass.selected' );

      // Assert
      expect( ( selector as any ).classNames.length ).to.equal( 3 );
      expect( ( selector as any ).classNames[ 0 ] ).to.equal( 'a' );
      expect( ( selector as any ).classNames[ 1 ] ).to.equal( 'testClass' );
      expect( ( selector as any ).classNames[ 2 ] ).to.equal( 'selected' );
    } );

    it( 'should ignore parameter if the string passed does not start with a period', () => {
      // Act
      const selector = new StyleSelector( 'selected' );

      // Assert
      expect( ( selector as any ).classNames.length ).to.equal( 0 );
    } );
  } );

  describe( 'match', () => {
    it( 'should return true if selectors are equal', () => {
      // Arrange
      const elementClass = new StyleSelector( '.a' );
      const ruleSelector = new StyleSelector( '.a' );

      // Act
      const result = elementClass.match( ruleSelector );

      // Assert
      expect( result ).to.be.true;
    } );

    it( 'should return true if selectors are equal but order is different', () => {
      // Arrange
      const elementClass = new StyleSelector( '.a.b' );
      const ruleSelector = new StyleSelector( '.b.a' );

      // Act
      const result = elementClass.match( ruleSelector );

      // Assert
      expect( result ).to.be.true;
    } );

    it( 'should return false if selectors are different', () => {
      // Arrange
      const elementClass = new StyleSelector( '.a' );
      const ruleSelector = new StyleSelector( '.b' );

      // Act
      const result = elementClass.match( ruleSelector );

      // Assert
      expect( result ).to.be.false;
    } );

    it( 'should return true if class names are all contained in element class', () => {
      // Arrange
      const elementClass = new StyleSelector( '.a.b.c' );
      const ruleSelector = new StyleSelector( '.a.c' );

      // Act
      const result = elementClass.match( ruleSelector );

      // Assert
      expect( result ).to.be.true;
    } );

    it( 'should return false if element class is missing class names from rule selector', () => {
      // Arrange
      const elementClass = new StyleSelector( '.a.c' );
      const ruleSelector = new StyleSelector( '.a.b.c' );

      // Act
      const result = elementClass.match( ruleSelector );

      // Assert
      expect( result ).to.be.false;
    } );

    it( 'should return false if element class is empty', () => {
      // Arrange
      const elementClass = new StyleSelector();
      const ruleSelector = new StyleSelector( '.a' );

      // Act
      const result = elementClass.match( ruleSelector );

      // Assert
      expect( result ).to.be.false;
    } );

    it( 'should return false if both selectors are empty', () => {
      // Arrange
      const elementClass = new StyleSelector();
      const ruleSelector = new StyleSelector();

      // Act
      const result = elementClass.match( ruleSelector );

      // Assert
      expect( result ).to.be.false;
    } );
  } );
} );
