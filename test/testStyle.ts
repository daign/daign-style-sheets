import { IStyleDeclaration } from '../lib';

/**
 * Implementation of IStyleDeclaration for the tests.
 */
export class TestStyle implements IStyleDeclaration {
  public fill: string | null = null;
  public stroke: string | null = null;
  public strokeWidth: number | null = null;

  /**
   * Returns whether the declaration is empty (all attributes are equal null).
   */
  public get isEmpty(): boolean {
    return ( this.fill === null && this.stroke === null && this.strokeWidth === null );
  }

  /**
   * Constructor.
   */
  public constructor( fill?: string, stroke?: string, strokeWidth?: number ) {
    if ( fill ) {
      this.fill = fill;
    }
    if ( stroke ) {
      this.stroke = stroke;
    }
    if ( strokeWidth ) {
      this.strokeWidth = strokeWidth;
    }
  }

  /**
   * Parse the value of an attribute from string.
   * @param name The name of the attribute.
   * @param value The value as a string.
   */
  public parseAttribute( name: string, value: string ): void {
    if ( name === 'fill' ) {
      this.fill = value;
    } else if ( name === 'stroke' ) {
      this.stroke = value;
    } else if ( name === 'stroke-width' ) {
      this.strokeWidth = parseFloat( value );
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
    if ( this.strokeWidth === null ) {
      this.strokeWidth = declaration.strokeWidth;
    }
  }
}
