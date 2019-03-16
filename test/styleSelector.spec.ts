import { expect } from 'chai';

import { StyleSelector } from '../lib';

describe( 'StyleSelector', () => {
  describe( 'match', () => {
    it( 'should return true if selectors are equal', () => {
      // Arrange
      const elementClass = new StyleSelector();
      elementClass.classNames.push( 'a' );

      const ruleSelector = new StyleSelector();
      ruleSelector.classNames.push( 'a' );

      // Act
      const result = elementClass.match( ruleSelector );

      // Assert
      expect( result ).to.be.true;
    } );

    it( 'should return true if selectors are equal but order is different', () => {
      // Arrange
      const elementClass = new StyleSelector();
      elementClass.classNames.push( 'a' );
      elementClass.classNames.push( 'b' );

      const ruleSelector = new StyleSelector();
      ruleSelector.classNames.push( 'b' );
      ruleSelector.classNames.push( 'a' );

      // Act
      const result = elementClass.match( ruleSelector );

      // Assert
      expect( result ).to.be.true;
    } );

    it( 'should return false if selectors are different', () => {
      // Arrange
      const elementClass = new StyleSelector();
      elementClass.classNames.push( 'a' );

      const ruleSelector = new StyleSelector();
      ruleSelector.classNames.push( 'b' );

      // Act
      const result = elementClass.match( ruleSelector );

      // Assert
      expect( result ).to.be.false;
    } );

    it( 'should return true if class names are all contained in element class', () => {
      // Arrange
      const elementClass = new StyleSelector();
      elementClass.classNames.push( 'a' );
      elementClass.classNames.push( 'b' );
      elementClass.classNames.push( 'c' );

      const ruleSelector = new StyleSelector();
      ruleSelector.classNames.push( 'a' );
      ruleSelector.classNames.push( 'c' );

      // Act
      const result = elementClass.match( ruleSelector );

      // Assert
      expect( result ).to.be.true;
    } );

    it( 'should return false if element class is missing class names from rule selector', () => {
      // Arrange
      const elementClass = new StyleSelector();
      elementClass.classNames.push( 'a' );
      elementClass.classNames.push( 'c' );

      const ruleSelector = new StyleSelector();
      ruleSelector.classNames.push( 'a' );
      ruleSelector.classNames.push( 'b' );
      ruleSelector.classNames.push( 'c' );

      // Act
      const result = elementClass.match( ruleSelector );

      // Assert
      expect( result ).to.be.false;
    } );

    it( 'should return false if element class is empty', () => {
      // Arrange
      const elementClass = new StyleSelector();

      const ruleSelector = new StyleSelector();
      ruleSelector.classNames.push( 'a' );

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
