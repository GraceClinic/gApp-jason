/**
 * WordShuffle_Models_Instructions_Page Class
 *
 * A page of content for a game
 *
 * @extends     {App_Common_Abstracts_Model}
 * @returns     {WordShuffle_Models_Instructions_Page}       - Model constructor usually returns self
 *
 * Dependency injections:
 * @param       {App_Common_Abstracts_Model}    Model       The abstract superclass
 * @param       {object}                        $sce        ngSantize module's "Strict Contextual Escaping" service
 *
 * Constructor parameters:
 * @param       {array} data        - Array of class properties for setting during instantiation
 *
 **/

/**
 * PUBLIC PROPERTIES
 **/
/**
 * @property    idInstructions
 * Foreign key to Instructions object as retrieved from the data source
 *
 * @type        int
 * @public
 **/
/**
 * @property    body
 * HTML content to display
 *
 * @type        string
 * @public
 **/
/**
 * @property    sequence
 * Order of page
 *
 * @type        int
 * @public
 **/

/**
 * DETAILED SPECIFICATION
 *
 * The database only contains a reference to the HTML file location that serves the "body" property.  The backend
 * logic loads those files into the "body" property and then transfers to the frontend.  The backend does not save
 * HTML content to the database.  All the HTML files reside in "/app/assets/wordshuffle/instructions/" for
 * retrieval by the Page model mapper and loading into the page body.
 *
 * This model only serves data saved in the database.  The model does not save Page data to the data source.  It is
 * a read-only model.
 *
 **/

