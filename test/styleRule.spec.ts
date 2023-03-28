import { expect } from 'chai';
import { spy } from 'sinon';

import { StyleRule, StyleSelector, StyleSelectorChain } from '../lib';
import { TestStyle } from './testStyle';

describe( 'StyleRule', (): void => {
  describe( 'constructor', (): void => {
    it( 'should set selector chain and declaration', (): void => {
      // Arrange
      const selectorChain = new StyleSelectorChain();
      selectorChain.addSelector( new StyleSelector( '.a' ) );

      const declaration = new TestStyle( 'green' );

      // Act
      const styleRule = new StyleRule( selectorChain, declaration );

      // Assert
      expect( styleRule.selectorChain ).to.equal( selectorChain );
      expect( styleRule.declaration ).to.equal( declaration );
    } );
  } );

  describe( 'comparePriority', (): void => {
    it( 'should call comparePriority on selectorChain', (): void => {
      // Arrange
      const declaration = new TestStyle( 'green' );

      const firstChain = new StyleSelectorChain();
      const firstRule = new StyleRule( firstChain, declaration );
      const comparePrioritySpy = spy( firstChain, 'comparePriority' );

      const secondChain = new StyleSelectorChain();
      const secondRule = new StyleRule( secondChain, declaration );

      // Act
      firstRule.comparePriority( secondRule );

      // Assert
      expect( comparePrioritySpy.calledOnce ).to.be.true;
      expect( comparePrioritySpy.getCall( 0 ).calledWithExactly( secondChain ) ).to.be.true;
    } );
  } );
} );
