/**
 * wordshuffleDirectivesInstructionsSlideShow Class
 *
 * Continuously revolves through array of content as dictated by dwell time
 *
 **/

/**
 * PROPERTIES
 * @property    pages   {WordShuffle_Models_Instructions_Page[]}      Array of page content to display
 * @property    dwell   {int}       Time period in milliseconds to display each page
 * @property    index   {string}    The "body" content of the active page
 *
 **/

/**
 * DETAILED SPECIFICATION
 *
 * This directive displays the WordShuffle instruction pages as a slide show.  Each Page.body property is HTML text,
 * which the directive displays in sequential order.  Each Page.body will display for the time specified by "dwell".
 * When the directive reaches the last element of the array, it will loop to the beginning and play the cycle again,
 * continuously.  Since each Page.body can be different heights, the directive must set the display height as dictated
 * by the page with the largest height.  This will stop the footer from bouncing up and down as the pages display
 * within the HTML body.
 *
 * This directive binds to the DOM element and accepts "pages" and "dwell" as attributes of the element.  The "pages"
 * attribute will become the directive's "pages" property.  The "dwell" attribute will become the directive's "dwell"
 * property. Both are defined in the PROPERTIES section, and data passed therein must comply with those specifications.
 * 
 **/