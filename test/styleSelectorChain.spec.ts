import { expect } from 'chai';

import { StyleSelector, StyleSelectorChain } from '../lib';

describe( 'StyleSelectorChain', () => {
  describe( 'getter length', () => {
    it( 'should return the length of the chain', () => {
      // Arrange
      const selectorChain = new StyleSelectorChain();
      selectorChain.addSelector( new StyleSelector( '.a' ) );
      selectorChain.addSelector( new StyleSelector( '.b' ) );
      selectorChain.addSelector( new StyleSelector( '.c' ) );

      // Act
      const result = selectorChain.length;

      // Assert
      expect( result ).to.equal( 3 );
    } );
  } );

  describe( 'constructor', () => {
    it( 'should initialize with empty chain', () => {
      // Act
      const selectorChain = new StyleSelectorChain();

      // Assert
      expect( selectorChain.length ).to.equal( 0 );
    } );
  } );

  describe( 'clone', () => {
    it( 'should return a clone with the same number of selectors', () => {
      // Arrange
      const selectorChain = new StyleSelectorChain();
      selectorChain.addSelector( new StyleSelector( '.a' ) );
      selectorChain.addSelector( new StyleSelector( '.b' ) );

      // Act
      const chainCopy = selectorChain.clone();

      // Assert
      expect( chainCopy.length ).to.equal( 2 );
    } );

    it( 'should keep selectors when original chain changes', () => {
      // Arrange
      const selectorChain = new StyleSelectorChain();
      selectorChain.addSelector( new StyleSelector( '.a' ) );
      selectorChain.addSelector( new StyleSelector( '.b' ) );

      // Act
      const chainCopy = selectorChain.clone();
      selectorChain.dropSelectors( 2 );

      // Assert
      expect( chainCopy.length ).to.equal( 2 );
    } );
  } );

  describe( 'addSelector', () => {
    it( 'should add a selector to the end of the chain', () => {
      // Arrange
      const selectorChain = new StyleSelectorChain();
      selectorChain.addSelector( new StyleSelector( '.a' ) );
      selectorChain.addSelector( new StyleSelector( '.b' ) );

      // Act
      const newSelector = new StyleSelector( '.c' );
      selectorChain.addSelector( newSelector );

      // Assert
      expect( selectorChain.getSelector( selectorChain.length - 1 ) ).to.equal( newSelector );
    } );
  } );

  describe( 'addSelectorToFront', () => {
    it( 'should add a selector to the front of the chain', () => {
      // Arrange
      const selectorChain = new StyleSelectorChain();
      selectorChain.addSelector( new StyleSelector( '.a' ) );
      selectorChain.addSelector( new StyleSelector( '.b' ) );

      // Act
      const newSelector = new StyleSelector( '.c' );
      selectorChain.addSelectorToFront( newSelector );

      // Assert
      expect( selectorChain.length ).to.equal( 3 );
      expect( selectorChain.getSelector( 0 ) ).to.equal( newSelector );
    } );
  } );

  describe( 'dropSelectors', () => {
    it( 'should remove selectors from the end of the chain', () => {
      // Arrange
      const selectorChain = new StyleSelectorChain();
      const firstSelector = new StyleSelector( '.a' );
      selectorChain.addSelector( firstSelector );
      selectorChain.addSelector( new StyleSelector( '.b' ) );
      selectorChain.addSelector( new StyleSelector( '.c' ) );

      // Act
      selectorChain.dropSelectors( 2 );

      // Assert
      expect( selectorChain.length ).to.equal( 1 );
      expect( selectorChain.getSelector( 0 ) ).to.equal( firstSelector );
    } );

    it( 'should keep length if parameter 0 is passed', () => {
      // Arrange
      const selectorChain = new StyleSelectorChain();
      selectorChain.addSelector( new StyleSelector( '.a' ) );
      selectorChain.addSelector( new StyleSelector( '.b' ) );
      selectorChain.addSelector( new StyleSelector( '.c' ) );

      // Act
      selectorChain.dropSelectors( 0 );

      // Assert
      expect( selectorChain.length ).to.equal( 3 );
    } );
  } );

  describe( 'getSelector', () => {
    it( 'should get selector by index', () => {
      // Arrange
      const selectorChain = new StyleSelectorChain();
      const secondSelector = new StyleSelector( '.b' );
      selectorChain.addSelector( new StyleSelector( '.a' ) );
      selectorChain.addSelector( secondSelector );
      selectorChain.addSelector( new StyleSelector( '.c' ) );

      // Act
      const result = selectorChain.getSelector( 1 );

      // Assert
      expect( result ).to.equal( secondSelector );
    } );

    it( 'should throw error if the index is out of bounds', () => {
      // Arrange
      const selectorChain = new StyleSelectorChain();

      // Act
      const badFn = (): void => {
        selectorChain.getSelector( 0 );
      };

      // Assert
      expect( badFn ).to.throw( 'Selector index out of bounds.' );
    } );
  } );

  describe( 'matchFromEnd', () => {
    it( 'should return true if chains are equal', () => {
      // Arrange
      const elementChain = new StyleSelectorChain();
      elementChain.addSelector( new StyleSelector( '.a' ) );
      elementChain.addSelector( new StyleSelector( '.b' ) );

      const ruleChain = new StyleSelectorChain();
      ruleChain.addSelector( new StyleSelector( '.a' ) );
      ruleChain.addSelector( new StyleSelector( '.b' ) );

      // Act
      const result = elementChain.matchFromEnd( ruleChain );

      // Assert
      expect( result ).to.be.true;
    } );

    it( 'should return true if selectors in second chain are subsets of first chain', () => {
      // Arrange
      const elementChain = new StyleSelectorChain();
      elementChain.addSelector( new StyleSelector( '.a.b.c' ) );
      elementChain.addSelector( new StyleSelector( '.d.e' ) );

      const ruleChain = new StyleSelectorChain();
      ruleChain.addSelector( new StyleSelector( '.b' ) );
      ruleChain.addSelector( new StyleSelector( '.d' ) );

      // Act
      const result = elementChain.matchFromEnd( ruleChain );

      // Assert
      expect( result ).to.be.true;
    } );

    it( 'should return true if second chain is a subset of first chain', () => {
      // Arrange
      const elementChain = new StyleSelectorChain();
      elementChain.addSelector( new StyleSelector( '.a' ) );
      elementChain.addSelector( new StyleSelector( '.b' ) );
      elementChain.addSelector( new StyleSelector( '.c' ) );
      elementChain.addSelector( new StyleSelector( '.d' ) );

      const ruleChain = new StyleSelectorChain();
      ruleChain.addSelector( new StyleSelector( '.b' ) );
      ruleChain.addSelector( new StyleSelector( '.d' ) );

      // Act
      const result = elementChain.matchFromEnd( ruleChain );

      // Assert
      expect( result ).to.be.true;
    } );

    it( 'should return false if second chain is a subset of first chain but end is different',
      () => {
      // Arrange
      const elementChain = new StyleSelectorChain();
      elementChain.addSelector( new StyleSelector( '.a' ) );
      elementChain.addSelector( new StyleSelector( '.b' ) );
      elementChain.addSelector( new StyleSelector( '.c' ) );

      const ruleChain = new StyleSelectorChain();
      ruleChain.addSelector( new StyleSelector( '.a' ) );
      ruleChain.addSelector( new StyleSelector( '.b' ) );

      // Act
      const result = elementChain.matchFromEnd( ruleChain );

      // Assert
      expect( result ).to.be.false;
    } );

    it( 'should return false if end of chains are equal but rest is not',
      () => {
      // Arrange
      const elementChain = new StyleSelectorChain();
      elementChain.addSelector( new StyleSelector( '.a' ) );
      elementChain.addSelector( new StyleSelector( '.b' ) );

      const ruleChain = new StyleSelectorChain();
      ruleChain.addSelector( new StyleSelector( '.c' ) );
      ruleChain.addSelector( new StyleSelector( '.b' ) );

      // Act
      const result = elementChain.matchFromEnd( ruleChain );

      // Assert
      expect( result ).to.be.false;
    } );

    it( 'should return false if first chain is empty', () => {
      // Arrange
      const elementChain = new StyleSelectorChain();
      elementChain.addSelector( new StyleSelector( '.a' ) );
      elementChain.addSelector( new StyleSelector( '.b' ) );

      const ruleChain = new StyleSelectorChain();

      // Act
      const result = elementChain.matchFromEnd( ruleChain );

      // Assert
      expect( result ).to.be.false;
    } );

    it( 'should return false if second chain is empty', () => {
      // Arrange
      const elementChain = new StyleSelectorChain();

      const ruleChain = new StyleSelectorChain();
      ruleChain.addSelector( new StyleSelector( '.a' ) );
      ruleChain.addSelector( new StyleSelector( '.b' ) );

      // Act
      const result = elementChain.matchFromEnd( ruleChain );

      // Assert
      expect( result ).to.be.false;
    } );
  } );

  describe( 'comparePriority', () => {
    it( 'should return 1 if first chain is longer', () => {
      // Arrange
      const firstChain = new StyleSelectorChain();
      firstChain.addSelector( new StyleSelector( '.a' ) );
      firstChain.addSelector( new StyleSelector( '.b' ) );
      firstChain.addSelector( new StyleSelector( '.c' ) );

      const secondChain = new StyleSelectorChain();
      secondChain.addSelector( new StyleSelector( '.d' ) );
      secondChain.addSelector( new StyleSelector( '.e' ) );

      // Act
      const result = firstChain.comparePriority( secondChain );

      // Assert
      expect( result ).to.equal( 1 );
    } );

    it( 'should return -1 if first chain is shorter', () => {
      // Arrange
      const firstChain = new StyleSelectorChain();
      firstChain.addSelector( new StyleSelector( '.a' ) );
      firstChain.addSelector( new StyleSelector( '.b' ) );

      const secondChain = new StyleSelectorChain();
      secondChain.addSelector( new StyleSelector( '.c' ) );
      secondChain.addSelector( new StyleSelector( '.d' ) );
      secondChain.addSelector( new StyleSelector( '.e' ) );

      // Act
      const result = firstChain.comparePriority( secondChain );

      // Assert
      expect( result ).to.equal( -1 );
    } );

    it( 'should return 1 if chains have equal lengths but first chain has longer selectors', () => {
      // Arrange
      const firstChain = new StyleSelectorChain();
      firstChain.addSelector( new StyleSelector( '.a.b.c.d' ) );
      firstChain.addSelector( new StyleSelector( '.e.f' ) );
      firstChain.addSelector( new StyleSelector( '.g' ) );

      const secondChain = new StyleSelectorChain();
      secondChain.addSelector( new StyleSelector( '.h.i.j' ) );
      secondChain.addSelector( new StyleSelector( '.k.l' ) );
      secondChain.addSelector( new StyleSelector( '.m' ) );

      // Act
      const result = firstChain.comparePriority( secondChain );

      // Assert
      expect( result ).to.equal( 1 );
    } );

    it( 'should return -1 if chains have equal lengths but first chain has shorter selectors',
      () => {
      // Arrange
      const firstChain = new StyleSelectorChain();
      firstChain.addSelector( new StyleSelector( '.a.b.c' ) );
      firstChain.addSelector( new StyleSelector( '.d.e' ) );
      firstChain.addSelector( new StyleSelector( '.f' ) );

      const secondChain = new StyleSelectorChain();
      secondChain.addSelector( new StyleSelector( '.g.h.i.j' ) );
      secondChain.addSelector( new StyleSelector( '.k.l' ) );
      secondChain.addSelector( new StyleSelector( '.m' ) );

      // Act
      const result = firstChain.comparePriority( secondChain );

      // Assert
      expect( result ).to.equal( -1 );
    } );

    it( 'should return 0 if both chains and all its selectors have the same length', () => {
      // Arrange
      const firstChain = new StyleSelectorChain();
      firstChain.addSelector( new StyleSelector( '.a' ) );
      firstChain.addSelector( new StyleSelector( '.b.c' ) );
      firstChain.addSelector( new StyleSelector( '.d.e.f' ) );

      const secondChain = new StyleSelectorChain();
      secondChain.addSelector( new StyleSelector( '.g' ) );
      secondChain.addSelector( new StyleSelector( '.h.i' ) );
      secondChain.addSelector( new StyleSelector( '.j.k.l' ) );

      // Act
      const result = firstChain.comparePriority( secondChain );

      // Assert
      expect( result ).to.equal( 0 );
    } );
  } );
} );
