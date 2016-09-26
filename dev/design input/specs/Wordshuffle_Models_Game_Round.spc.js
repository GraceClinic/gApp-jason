/**
 * Wordshuffle_Models_Game_Round Class
 * One round within a WordShuffle game
 *
 * @extends     {App_Common_Abstracts_Model}
 * @returns     {Wordshuffle_Models_Game_Round}           Model constructors usually returns itself
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
 * @property    idGame
 * id of the associated Game object
 *
 * @type        {int}
 * @public
 **/
/**
 * @property    Time
 * total number of seconds to complete the round
 *
 * @type        {int}
 * @public
 **/
/**
 * @property    wordCount
 * number of words created during round
 *
 * @type        {int}
 * @public
 **/
/**
 * @property    points
 * number of points scored during the round
 *
 * @type        {int}
 * @public
 **/
/**
 * @property    start
 * date / time started
 *
 * @type        {date}
 * @public
 **/
/**
 * @property    end
 * date / time ended
 *
 * @type        {date}
 * @public
 **/
/**
 * @property    index
 * index position of round within game
 *
 * @type        {int}
 * @public
 **/

/**
 * DETAILED SPECIFICATION
 * For ANONYMOUS play, Round data saved to the session variable.  If player sign-in state is SIGNED_IN, then Round
 * data saves to the database for use in creation of statistical information. The Round.index identifies the Round
 * sequential position in the Game for proper save to session variables and database.
 **/
 