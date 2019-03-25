import { IStyleDeclaration } from '../lib';

/**
 * Implementation of IStyleDeclaration for the tests.
 */
export class TestStyle implements IStyleDeclaration {
  public fill: string | null = null;
  public stroke: string | null = null;

  /**
   * Returns whether the declaration is empty (all attributes are equal null).
   */
  public get isEmpty(): boolean {
    return ( this.fill === null && this.stroke === null );
  }

  /**
   * Constructor.
   */
  public constructor( fill?: string, stroke?: string ) {
    if ( fill ) {
      this.fill = fill;
    }
    if ( stroke ) {
      this.stroke = stroke;
    }
  }

  /**
   * Copy style attributes from given style declaration but don't override already existing values.
   * @param declaration The style declaration whose values to use.
   */
  public complementWith( declaration: TestStyle ): void {
    if ( this.fill === null ) {
      this.fill = declaration.fill;
    }
    if ( this.stroke === null ) {
      this.stroke = declaration.stroke;
    }
  }
}
