/**
 * WordShuffle_Models_Game Class
 *
 * Implements the WordShuffle game.  This constructor excludes all appropriate properties from requests to the
 * backend by itemizing in the "excludeFromPost" array and it set the rootURL for the backend data source.  In
 * addition, this method sets a watcher against "keypress" events.  If the keyed pressed is the ENTER key, the
 * watcher fires the "submitWord" method.
 *
 * @extends     {App_Common_Abstracts_Model}
 * @returns     {WordShuffle_Models_Game}       - Model constructor usually returns self
 *
 * Dependency injections:
 * @param   {App_Common_Abstracts_Model}                        Model      superclass
 * @param   {function(new:WordShuffle_Models_Game_Round)}       Round      Round object that create the game
 * @param   {function(new:WordShuffle_Models_Game_Square)}      Square     game square object constructor
 * @param   {function(new:WordShuffle_Models_Game_Clock)}       Clock      game clock constructor
 *
 * Constructor parameters:
 * @param       {array} data        - Array of class properties for setting during instantiation
 *
 **/

/**
 * PUBLIC PROPERTIES
 **/
/**
 * @property    idPlayer
 * Player unique id
 *
 * @type        int
 * @public
 */
/**
 * @property    round
 * Index to the active Round
 *
 * @type        int
 * @public
 */
/**
 * @property    roundsPerGame
 * Number of rounds in the game as selected by player
 *
 * @type        int
 * @public
 */
/**
 * @property    secondsPerRound
 * Number of seconds in each Round
 *
 * @type        int
 * @public
 */
/**
 * @property    points
 * Total points for the game
 *
 * @type        int
 * @public
 */
/**
 * @property    start
 * Datetime stamp for the start of the game
 *
 * @type        date
 * @public
 */
/**
 * @property    end
 * Datetime stamp recorded when game ends
 *
 * @type        date
 * @public
 */
/**
 * @property    Rounds
 * Array of rounds for the game, number of rounds dictated by roundPerGame
 *
 * @type        {WordShuffle_Models_Game_Round[]}
 * @public
 */
/**
 * @property    roundAvg
 * Average points per round
 *
 * @type        int
 * @public
 **/
/**
 * @property    Squares
 * Array of game Square objects
 *
 * @type        WordShuffle_Models_Game_Square[]
 * @public
 **/
/**
 * @property    state
 * Tracks game state as COMPLETED, IN_PROGRESS, or ABANDONED
 *
 * @type        string
 * @public
 **/
/**
 * @property    Clock
 * The Game clock
 *
 * @type        WordShuffle_Models_Game_Clock
 * @public
 **/
/**
 * @property    word
 * Current word being built by player
 *
 * @type        string
 * @public
 **/
/**
 * @property    wordSquares
 * The Square objects that created the current word.  This will be used by the backend to validate against session
 * information.  This will insure that the player submits a legitimate word.  The word does not only need to be a
 * valid dictionary word, it must derive from the current square matrix, built from adjacent squares that do not
 * repeat.
 *
 * @type        WordShuffle_Models_Game_Square[]
 * @public
 **/
/**
 * @property    scoreBoard
 * Array of score objects for active Round.  The score objects are keyed with "word" and "points".  The "word" key is
 * a successful word built from the Squares array.  The "points" key stores the points associated with the word as
 * determined by the backend after execution of submitWord.
 *
 * @type        {{word:string,points:int}[]}
 * @public
 **/
/**
 * @property    newGame
 * Flags the start of new Game.  When the backend receives this flag, it will start the game and populate the Squares
 * array with the Squares for the first Round.  After service of this flag, the backend resets it.
 *
 * @type        boolean
 * @public
 **/
/**
 * @property    newRound
 * Flags start of new Round.  The backend maintains the start of each Round.  Though the frontend controls the Clock,
 * the backend is the absolute keeper of start and stop of a Round.  When a Round does elapsed, the backend sets this
 * flag to signify the start of a newRound.  The backend starts the next Round and refreshes the Squares array to
 * service this new Round, which the frontend must update for the player.
 *
 * @type        boolean
 * @public
 **/
/**
 * @property    timeRemaining
 * Seconds remaining in active round.  This is for use by the frontend to update the clock as necessary.  This may be
 * because the player refreshed the application.  In this case, it is necessary to update the clock.
 *
 * @type        int
 * @public
 **/

/**
 * PUBLIC METHODS
 * The following provides the core functionality of the model.
 */
/**
 * @method   clockExpired
 * Callback function registered to the Clock for trigger when clock elapses.  At that time, if the
 * game state is not COMPLETED or ABANDONED, this method executes a save of the Game state.
 *
 * @public
 */
/**
 * @method   buildWord
 * Callback function registered with every Square object.  Once the user selects a Square, the object
 * triggers this method.  At that time, this method will validate the Game state.  If the game state
 * is COMPLETED or ABANDONED, the method will deselect the Square.  Otherwise, this method proceeds
 * to validate if the selection is allowed.  Any Square can be selected first.  Afterwards, all other
 * selection must be immediately adjacent to the selected Square (one row and/or one column away).  If
 * this is not true, the method will deselect the Square.  If it does met the criteria, the method
 * pushes the Square onto the "wordSquares" array and appends the letter to the "word" property.
 *
 * If the Square passed into this method was deselected, this method will identify that Square within
 * the "wordSquares" array, remove it and any preceding Squares from the array and set each as
 * deselected, and then remove the associated letters from the "word" property.  In this way, the
 * method allows the user to deconstruct a word in progress.  If the deselection results in all Squares
 * removed from the "wordSquares" array, this method sets the "word" property to its default "???" value.
 *
 * @public
 * @param    {WordShuffle_Models_Game_Square}   Square  - game square object initiating call
 */
/**
 * @method   quit
 * Quit the game.  This method stops the Clock and relays itself to the backend for follow-up logic.  The
 * relay requires the return of the model state for UI update as appropriate. Upon receipt of a quit command from
 * the frontend, the backend will simply set the game state to ABANDONED, save the Game, and return the Game state
 * afterwards.
 *
 * @public
 * @return  object  - promise object from http request to quit game
 */
/**
 * @method   submitWord
 * Submit word to backend for processing if word length > 1 and the state is active.  This method is simply
 * a relay to the backend.  It does expect the model state in the response to implement follow-up logic and
 * update the UI.  Upon return from the backend, the associated post-relay method must post the "msg"
 * contained in the result to the "word" property.  The messages returned from the backend in oResults.msg follow:
 *
 * 1) "SUCCESS!" if submitted word validates with dictionary lookup.
 * 2) "REJECTED!" if submitted word does not validate.
 * 3) "DUPLICATE!" if submitted word exist in current word list.
 * 4) "GAME OVER!" if last round and time elapsed.
 * 5) "???" if new round.
 *
 * Refer to DETAILED SPECIFICATION section on BACKEND BUSINESS LOGIC ON SUBMIT WORD for explanation of backend logic
 * requirements.
 *
 * The method must also clear all of the selected Squares contained within "wordSquares" and empty the array.
 * The results object returning from the backend will have the following properties:
 *
 *    {boolean}   oResults.success          - flags successful submit of word
 *    {string}    oResults.msg              - message to display to user
 *    {int}       oResults.gamePoints       - total game points
 *    {int}       oResults.roundPoints      - points for current round
 *    {string}    oResults.gameState        - current game state
 *    {boolean}   oResults.newRound         - flags start of new round
 *
 * Given the above information, this method will update the Game state and newRound flag with the
 * corresponding result property.  It will also update the "scoreBoard" property and update the points for
 * the active Round with "roundPoints".  If the Game state is COMPLETED or ABANDONED, this method will
 * stop the clock.  In addition, if the response flags "newRound", the method will stop the Clock and
 * execute an immediate Game.save operation.  As soon as the save returns, the method will start the Clock.
 *
 * @public
 */

/**
 * DETAILED SPECIFICATION
 *
 * This is the workhorse model for the entire WordShuffle game.  The backend plays a large role validating the game
 * play.  As with every model within a dynamic web application, there is logic handled by the frontend application
 * and there is logic handled by the backend application.  There are properties relevant to and controlled by the
 * frontend application and vice-versa.  It is paramount to Game functionality that the frontend and backend
 * applications do their designated jobs.  The frontend controls UI and general game functionality linked therein.
 * The backend provides retrieval and save of data as well as the business rules dictating proper play.  Business
 * logic can and should be embedded in the frontend; however, the backend cannot simply trust information received
 * from the frontend.  It must validate and control properties that are not to be manipulated by the frontend.
 *
 * BUSINESS LOGIC ON SAVE
 * The backend validates the game state on every save event and processes the state.  On construction of the Game
 * model by the backend, the logic checks the following:
 * 1) It removes all properties passed from the frontend that are not allowed to be set by the
 * frontend.  Those properties are the following:  'round', 'start', 'end', 'points', 'idPlayer', 'roundAvg',
 * 'scoreBoard', 'Rounds', and 'state'.  The frontend application should have excluded these properties from post, but
 * URL mashing must be handled.  The frontend is passive in regards to these properties, it cannot set these properties.
 * Some of these properties derive from the session variables controlled by SysMan, others are updated by the backend
 * based on the current game state.
 * 2) It validates the "signInState" stored in SysMan->Session and sets the state to ANONYMOUS_PLAY if the state is
 * not SIGNED_IN.  This explicitly identifies anonymous play if the user has not authenticated.
 * 3) Reviews the "newGame" flag and determines if game state allows new game (i.e. game not IN_PROGRESS).  If new
 * game allowed, it resets the SysMan->Session->idGame to 0, which insures the save operation will result in the
 * creation of a new game as opposed to an update.  In all cases, it sets its "id" to that stored in session as
 * SysMan->Session->idGame.  This is because the session is the keeper of this information no matter what.
 * 4) If there is currently and active game, the logic will insure that the game settings do not change.  Specifically,
 * that is "roundsPerGame" and "secondsPerRound".  The player cannot change this information during an active game.
 * If there is an attempt to do so, the Game.msg records a "INFO" type message to the player indicating that such
 * a change is not allowed.  The frontend will display this to the player.
 * 5) Since the Game object must support ANONYMOUS_PLAY, the SysMan->Session must store and maintain the array of
 * Rounds for the active game.  The Game->Rounds array of Rounds must derive from this information.  If the player
 * state is SIGNED_IN, then Round information will save to the database and update the SysMan->Session storage as
 * appropriate.
 * 6) After construction, regardless as to whether the save creates a new record or updates an existing record, it
 * must validate the game state based logic explained the the PROCESS GAME STATE section.
 *
 * PROCESS GAME STATE
 * 1) If it is a new Game, the model resets the SysMan->Session->idGame to 0 and sets the SysMan->Session->round
 * to 1.  It will also initialized the Game properties for a new game:  "start" to current date time,
 * "points" to 0, "roundAvg" to 0, empty the "scoreBoard" array, "word" to an empty string, and set "state" to
 * IN_PROGRESS.  The Game object also creates new Rounds to service the game per the "roundsPerGame" and
 * "secondsPerRound".  The first round "start" and "end" properties are set accordingly.  The Game proceeds to
 * search the database records for any uncompleted games for the player.  If it finds these, it sets these to
 * ABANDONED.  Finally, since it is a new Game, all Squares are set to a new random letter based on the LETTER FREQUENCY
 * shown below.  The new Squares are written to SysMan->Session->Squares for validation later against submitted
 * words.
 * 2) If the Game is IN_PROGRESS, then it verifies if the Round has ended.  If true, then it verifies if the game
 * has ended.  If yes, it sets the game state as COMPLETED and "end" to the current datetime stamp.  If the game is
 * not completed, it saves the current Round, sets the "newRound" flag, increments the active "round" (also, the
 * SysMan->Session->round memory), sets the new active Round's "start" and "end" properties and saves it, and
 * empties the "scoreBoard".  Since it is a new Round, all Squares are set to a new randow letter based on the LETTER
 * FREQUENCY shown below.  The new Squares are written to SysMan->Session->Squares for validation later against
 * submitted words.
 *
 * After successful save, if Game state is COMPLETED, post "Game Over" to the "word" property.  Otherwise, if it is
 * a new round or a new game, start the Clock, set the "word" to "???", and reset the newGame and newRound flags.
 *
 * BACKEND BUSINESS LOGIC ON SUBMIT WORD
 * For the frontend, the submitWord method is largely a relay method to the backend for processing.  The backend
 * applies the validation logic for word submission and returns the response as described in the "submitWord" method
 * above.  Upon submit of word, if the game state is active, the method will always execute the PROCESS GAME STATE
 * as described above.  Submissions should only occur when game state is IN_PROGRESS.  The backend will process
 * the word and build a response object based on the processing results.  The Game validates the following:
 *
 * 1) The word consist of a minimum of 2 letters.  If it does not, the method records FALSE to response.success and
 * records response.msg as "Word too short!".  The frontend must disallow submission of anything less that 2 letters, but the
 * backend must still check for thoroughness.
 * 2) The Game validates that the word recorded within "wordSquares" matches a valid letter pattern within the
 * SysMan->Session->Squares matrix saved to session memory.  If it does not, it sets the response.success as false
 * and records "Board Mismatch!" to response.msg.  It will do the same if Game.word does not match with the letter pattern
 * derived from the "wordSquares" queue.
 * 3) If the submitted word matches with an existing word submitted previously, it records response.success as FALSE
 * and "Duplicate!" to response.msg.
 * 4) If it passes the above, it validates the word with the database dictionary.  If the word exists, it records
 * TRUE to response.success and "Success!" to response.msg.
 * 5) If submitted word does not validate within database dictionary, it records FALSE to response.success
 * and "Rejected!" to response.msg.
 * 6) If the time elapsed during last round, it records FALSE to response.success and "Game Over!" to response.msg.
 *
 * Given successful validation of the word, the logic must score the word based on the following word length:
 *
 * 1) If 2 or 3, then score is equal to length.
 * 2) If 4, 5, or 6 then score is equal to length + 2.
 * 3) If larger, then score is length + 3.
 *
 * The backend must store the score word and points to session storage along with other previous scores for the round.
 * Additionally, the Game object updates the current Round->points based on the new score and increments the
 * Round->wordCount.  The Round information must be saved to session storage to insure proper tracking of score during
 * anonymous play.  At this time, it is also important to execute Round->save() for the active round for those
 * authenticated users.
 *
 * FREQUENCY OF LETTERS
 * Relative frequency of the letters in the English language, ref http://en.wikipedia.org/wiki/Letter_frequency
 *      'A' => 8.167%
 *      'B' => 1.482%
 *      'C' => 2.782%
 *      'D' => 4.253%
 *      'E' => 12.702%
 *      'F' => 2.228%
 *      'G' => 2.015%
 *      'H' => 6.094%
 *      'I' => 6.966%
 *      'J' => 0.153%
 *      'K' => 0.772%
 *      'L' => 4.025%
 *      'M' => 2.406%
 *      'N' => 6.749%
 *      'O' => 7.507%
 *      'P' => 1.929%
 *      'Q' => 0.095%
 *      'R' => 5.987%
 *      'S' => 6.327%
 *      'T' => 9.056%
 *      'U' => 2.758%
 *      'V' => 0.978%
 *      'W' => 2.361%
 *      'X' => 0.150%
 *      'Y' => 1.974%
 *      'Z' => 0.074%
 *
 **/
