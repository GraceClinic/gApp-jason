/**
 * wordshuffleDirectivesGameSquare Class
 *
 * Provides DOM connectivity for interacting with a WordShuffle_Models_Game_Square object.  This directive works in
 * conjunction with the WordShuffle_Models_Game_Square model to provide full functionally of a game square.
 *
 * Dependency injection:
 * @param {App_Common_Models_Tools_Logger}  Logger  - reference to Logger object
 * @param {object}  $interval   - reference to AngularJS $interval object
 *
 * @returns {appCommonDirectivesBanner}     - returns the singleton that services directive features and functions
 *
 **/

/**
 * PUBLIC PROPERTIES
 * @property    square         {WordShuffle_Models_Game_Square}   The Square object to present in DOM
 * @property    countPerRow    {int}                              Number of adjacent Squares on a row
 *
 **/

/**
 * DETAILED SPECIFICATION
 *
 * The Square Directive allows for display and manipulation of a WordShuffle_Models_Game_Square object in the DOM.  This object passes to the directive as the "square" property within the directive.  The "countPerRow" property allows the directive to adjust the width of the square for proper display within the window.  This directive works in conjunction with the WordShuffle_Models_Game object, which creates an array of squares that form the game board.
 *
 * On directive construction, the following occurs:
 *
 * 1) The square.idTag property set per the following naming convention:  'wordshuffle-model-game-square-' + square.row + '-' + square.col.  Once defined, the square.DOM property creates a link to the DOM object for manipulation (by virtual of extension of Model abstract).  Typically, this is not necessary since the directive link function provides access through the "element" parameter; however, there are some spurious behavior of the "element" parameter that can be circumvented with Jquery access directly to the named DOM object.  This provides a unique id for the associated DOM object.
 * 2) The "square" width set to the appropriate percentage given the "countPerRow" property.  For example, if "countPerRow" is five, the width of each square sets to 20%.  After setting this to the proper percentage, the "square" height is set to the resulting width's pixel amount, thus creating a square.
 * 3) Binds "mouseenter" event for square to change border-color to "#2328ff" (a bright blue) if not square.isSelected.  Regardless of square.isSelected, border-width always sets to 4px.
 * 4) Binds "mouseleave" event for square to change border-color back to "black" if not square.isSelected.  Regardless of square.isSelected, border-width always sets to 2px.
 * 5) Binds window "resize" event for square to resize height appropriately based on new square width resulting from window resize.  Also, update font-size to an appropriate value for display of letter within the square.
 * 6) Bind "click" event to toggle the value of square.isSelected on each click.  Also, execute the square.callOnClick() callback function registered with the square object (see WordShuffle_Models_Game_Square.spc.js).  The Game object will register this function upon creation of each square object.  This will insure that the word is built as the user selects each square.
 *
 *
 **/