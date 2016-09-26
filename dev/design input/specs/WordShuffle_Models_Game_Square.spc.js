/**
 * WordShuffle_Models_Game_Square Class
 * This object works in conjunction with the directive, WordshuffleDirectivesGameSquare, to provide full functionality
 * of the game Square.  Principally, it provides the Square object structure for manipulation through the directive.
 *
 *
 * @extends     {App_Common_Abstracts_Model}
 * @returns     {WordShuffle_Models_Game_Square}           Model constructors usually returns itself
 *
 * Dependency injections:
 * @param {App_Common_Abstracts_Model}              Model      The abstract superclass
 *
 * Constructor parameters:
 * @param       {array} data        Array of class properties for setting during instantiation
 *
 **/

/**
 * PUBLIC PROPERTIES
 **/
/**
 * @property    letter
 * letter contained in square
 *
 * @type        string
 * @public
 **/
/**
 * @property    row
 * row index
 *
 * @type        int
 * @public
 **/
/**
 * @property    col
 * column index
 *
 * @type        int
 * @public
 **/
/**
 * @property    isSelected
 * flags if square is selected
 *
 * @type        boolean
 * @public
 **/
/**
 * @property    callOnClick
 * Call back function link to the selection of the square.  The Game object sets this function for appropriate
 * construction / destruction of the word.  The WordshuffleDirectivesGameSquare executes this function on click.
 *
 * @type        function()
 * @public
 **/

 