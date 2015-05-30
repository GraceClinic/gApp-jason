/**
 * WordShuffle_Models_Instructions Class
 *
 * Game instructions.  On instantiation, this class sets its root URL that serves as the data source for the mode.
 * Also, since Instructions is a singleton, the constructor executes a find operation to load the content.
 *
 * @extends     {App_Common_Abstracts_Model}
 * @returns     {WordShuffle_Models_Instructions}       - Model constructor usually returns self
 *
 * Dependency injections:
 * @param {App_Common_Abstracts_Model}              Model      The abstract superclass
 * @param {WordShuffle_Models_Instructions_Page}    Page       The Page object constructor
 *
 * Constructor parameters:
 * @param       {array} data        - Array of class properties for setting during instantiation
 *
 **/

/**
 * PUBLIC PROPERTIES
 **/
/**
 * @property    title
 * Title to display over instructions slide show
 *
 * @type        string
 * @public
 **/
/**
 * @property    picture
 * File location of associated picture for display adjacent to instructions title
 *
 * @type        string
 * @public
 **/
/**
 * @property    Pages
 * Array of Page objects that form the game instructions
 *
 * @type        WordShuffle_Models_Instructions_Page[]
 * @public
 **/
/**
 * @property    idGame
 * Primary key for game object as retrieved from the data source URL
 *
 * @type        int
 * @public
 **/

/**
 * DETAILED SPECIFICATION
 *
 * The Instructions object presents information to the user regarding how to play the game.  It contains "pages" of
 * content.  Refer to the specification for WordShuffle_Models_Instructions_Page for more information.  This model
 * only contains properties for display of content to the user, it supports no methods.
 *
 * The model only reads information from the database.  It does not save Instruction information to the database
 * backend.  It is a read-only model.
 *
 **/






