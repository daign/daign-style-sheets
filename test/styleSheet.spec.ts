import { expect } from 'chai';
import * as sinon from 'sinon';

import { StyleSheet } from '../lib';
import { TestStyle } from './testStyle';

describe( 'StyleSheet', () => {
  describe( 'forEach', () => {
    it( 'should call callback with each rule', () => {
      // Arrange
      const text =
      `.a {
        fill: green;
      }
      .b {
        fill: red;
      }`;

      const styleSheet = new StyleSheet<TestStyle>();
      styleSheet.parseFromString( text, TestStyle );
      const rule1 = ( styleSheet as any ).rules[ 0 ];
      const rule2 = ( styleSheet as any ).rules[ 1 ];

      // Act
      const spy = sinon.spy();
      styleSheet.forEach( spy );

      // Assert
      expect( spy.calledTwice ).to.be.true;
      expect( spy.getCall( 0 ).args[ 0 ] ).to.equal( rule1 );
      expect( spy.getCall( 1 ).args[ 0 ] ).to.equal( rule2 );
    } );
  } );

  describe( 'parseFromString', () => {
    it( 'should add rule to style sheet', () => {
      // Arrange
      const text =
      `.a.b {
        .c {
          fill: green;
        }
      }`;
      const styleSheet = new StyleSheet<TestStyle>();
      const spy = sinon.spy( ( styleSheet as any ), 'addRule' );

      // Act
      styleSheet.parseFromString( text, TestStyle );

      // Assert
      expect( spy.calledOnce ).to.be.true;
      expect( ( styleSheet as any ).rules.length ).to.equal( 1 );
      const rule = ( styleSheet as any ).rules[ 0 ];
      expect( rule.declaration.fill ).to.equal( 'green' );
      expect( rule.selectorChain.length ).to.equal( 2 );
      expect(
        ( rule.selectorChain.getSelector( 0 ) as any ).classNames
      ).to.deep.equal( [ 'a', 'b' ] );
      expect(
        ( rule.selectorChain.getSelector( 1 ) as any ).classNames
      ).to.deep.equal( [ 'c' ] );
    } );

    it( 'should add rule that comes last in style sheet to first position in list', () => {
      // Arrange
      const text =
      `.a {
        fill: green;
      }
      .b {
        fill: green;
      }`;
      const styleSheet = new StyleSheet<TestStyle>();

      // Act
      styleSheet.parseFromString( text, TestStyle );

      // Assert
      const firstRule = ( styleSheet as any ).rules[ 0 ];
      expect( ( firstRule.selectorChain.getSelector( 0 ) as any ).classNames[ 0 ] ).to.equal( 'b' );
    } );

    it( 'should add rule with higher selector priority to first position in list', () => {
      // Arrange
      const text =
      `.a.b {
        fill: green;
      }
      .c {
        fill: green;
      }`;
      const styleSheet = new StyleSheet<TestStyle>();

      // Act
      styleSheet.parseFromString( text, TestStyle );

      // Assert
      const firstRule = ( styleSheet as any ).rules[ 0 ];
      expect(
        ( firstRule.selectorChain.getSelector( 0 ) as any ).classNames
      ).to.deep.equal( [ 'a', 'b' ] );
    } );

    it( 'should add rule with higher chain priority to first position in list', () => {
      // Arrange
      const text =
      `.a {
        .b {
          fill: green;
        }
      }
      .c {
        fill: green;
      }`;
      const styleSheet = new StyleSheet<TestStyle>();

      // Act
      styleSheet.parseFromString( text, TestStyle );

      // Assert
      const firstRule = ( styleSheet as any ).rules[ 0 ];
      expect( ( firstRule.selectorChain.getSelector( 0 ) as any ).classNames[ 0 ] ).to.equal( 'a' );
    } );

    it( 'should not add rule if no attributes are declared', () => {
      // Arrange
      const text =
      `.a {
        // Just a comment.
      }`;
      const styleSheet = new StyleSheet<TestStyle>();
      const spy = sinon.spy( ( styleSheet as any ), 'addRule' );

      // Act
      styleSheet.parseFromString( text, TestStyle );

      // Assert
      expect( spy.notCalled ).to.be.true;
      expect( ( styleSheet as any ).rules.length ).to.equal( 0 );
    } );

    it( 'should throw error if there are too many closing brackets', () => {
      // Arrange
      const text =
      `.a {
        fill: green;
        }
      }`;
      const styleSheet = new StyleSheet<TestStyle>();

      // Act
      const badFn = (): void => {
        styleSheet.parseFromString( text, TestStyle );
      };

      // Assert
      expect( badFn ).to.throw( 'Too many closing brackets in style sheet.' );
    } );

    it( 'should throw error if there are not enough closing brackets', () => {
      // Arrange
      const text =
      `.a {
        fill: green;
        .b {
          fill: red;
      }`;
      const styleSheet = new StyleSheet<TestStyle>();

      // Act
      const badFn = (): void => {
        styleSheet.parseFromString( text, TestStyle );
      };

      // Assert
      expect( badFn ).to.throw( 'Missing closing brackets in style sheet.' );
    } );

    it( 'should throw error if a line cannot be parsed', () => {
      // Arrange
      const text =
      `.a {
        fill: green;
        cannot be parsed
      }`;
      const styleSheet = new StyleSheet<TestStyle>();

      // Act
      const badFn = (): void => {
        styleSheet.parseFromString( text, TestStyle );
      };

      // Assert
      expect( badFn ).to.throw( 'Line 3 in style sheet could not be parsed.' );
    } );

    it( 'should throw error if attribute name starts with a hyphen', () => {
      // Arrange
      const text =
      `.a {
        -fill: green;
      }`;
      const styleSheet = new StyleSheet<TestStyle>();

      // Act
      const badFn = (): void => {
        styleSheet.parseFromString( text, TestStyle );
      };

      // Assert
      expect( badFn ).to.throw( 'Line 2 in style sheet could not be parsed.' );
    } );

    it( 'should throw error if selector contains whitespace', () => {
      // Arrange
      const text =
      `.alpha.bravo .charlie {
        fill: green;
      }`;
      const styleSheet = new StyleSheet<TestStyle>();

      // Act
      const badFn = (): void => {
        styleSheet.parseFromString( text, TestStyle );
      };

      // Assert
      expect( badFn ).to.throw( 'Line 1 in style sheet could not be parsed.' );
    } );
  } );
} );
