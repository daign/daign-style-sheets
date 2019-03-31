import { expect } from 'chai';

import { TestStyle } from './testStyle';

describe( 'TestStyle', () => {
  describe( 'getter isEmpty', () => {
    it( 'should return true if all attributes are equal null', () => {
      // Arrange
      const style = new TestStyle();

      // Act
      const result = style.isEmpty;

      // Assert
      expect( result ).to.be.true;
    } );

    it( 'should return false if one attribute is not null', () => {
      // Arrange
      const style = new TestStyle();
      style.stroke = 'green';

      // Act
      const result = style.isEmpty;

      // Assert
      expect( result ).to.be.false;
    } );
  } );

  describe( 'constructor', () => {
    it( 'should initialize all values with null', () => {
      // Act
      const style = new TestStyle();

      // Assert
      expect( style.fill ).to.be.null;
      expect( style.stroke ).to.be.null;
      expect( style.strokeWidth ).to.be.null;
    } );

    it( 'should set values if parameters are passed', () => {
      // Act
      const style = new TestStyle( 'green', 'red', 1.23 );

      // Assert
      expect( style.fill ).to.equal( 'green' );
      expect( style.stroke ).to.equal( 'red' );
      expect( style.strokeWidth ).to.equal( 1.23 );
    } );
  } );

  describe( 'parseAttribute', () => {
    it( 'should set the string value for attribute fill', () => {
      // Arrange
      const style = new TestStyle();

      // Act
      style.parseAttribute( 'fill', 'green' );

      // Assert
      expect( style.fill ).to.equal( 'green' );
    } );

    it( 'should parse from string to float for attribute stroke width', () => {
      // Arrange
      const style = new TestStyle();

      // Act
      style.parseAttribute( 'stroke-width', '1.23' );

      // Assert
      expect( style.strokeWidth ).to.equal( 1.23 );
    } );
  } );

  describe( 'complementWith', () => {
    it( 'should set values that are null in the target style', () => {
      // Arrange
      const targetStyle = new TestStyle();
      const sourceStyle = new TestStyle( 'green', 'red', 1.23 );

      // Act
      targetStyle.complementWith( sourceStyle );

      // Assert
      expect( targetStyle.fill ).to.equal( 'green' );
      expect( targetStyle.stroke ).to.equal( 'red' );
      expect( targetStyle.strokeWidth ).to.equal( 1.23 );
    } );

    it( 'should not override values that are not null in the target style', () => {
      // Arrange
      const targetStyle = new TestStyle( 'green', 'red', 1.23 );
      const sourceStyle = new TestStyle( 'black', 'white', 2.34 );

      // Act
      targetStyle.complementWith( sourceStyle );

      // Assert
      expect( targetStyle.fill ).to.equal( 'green' );
      expect( targetStyle.stroke ).to.equal( 'red' );
      expect( targetStyle.strokeWidth ).to.equal( 1.23 );
    } );

    it( 'should not override with null values', () => {
      // Arrange
      const targetStyle = new TestStyle( 'green', 'red', 1.23 );
      const sourceStyle = new TestStyle();

      // Act
      targetStyle.complementWith( sourceStyle );

      // Assert
      expect( targetStyle.fill ).to.equal( 'green' );
      expect( targetStyle.stroke ).to.equal( 'red' );
      expect( targetStyle.strokeWidth ).to.equal( 1.23 );
    } );

    it( 'should decide to set or not for each attribute individually', () => {
      // Arrange
      const targetStyle = new TestStyle( undefined, 'red', 1.23 );
      const sourceStyle = new TestStyle( 'green', 'white' );

      // Act
      targetStyle.complementWith( sourceStyle );

      // Assert
      expect( targetStyle.fill ).to.equal( 'green' );
      expect( targetStyle.stroke ).to.equal( 'red' );
      expect( targetStyle.strokeWidth ).to.equal( 1.23 );
    } );
  } );
} );
