/**
 * Configuration for the application.
 */
var config = {
    "textAssembleAnimation": {
        "color": "red",
        "partCount": 900, // 49, 100, 225, 400, 900, 1600 | recommended: <=100 | 2500: laggy; 10'000: Browser crash
        "duration_inS": 10,
        "startDelay_inS": 1,
        "fontSize": "30rem",
        "minScreenPadding": 20 // 20%: Between text and screen is at minimum a padding of 20%.
    },
    "textMoveAnimation": {
        "color": "rgba(150, 150, 150)",
        "duration_inS": 3,
        "startDelay_inS": 11,
        "fontSize": "10rem",
        "minScreenPadding": 40,
        "direction": "left" // "left" or "right" is allowed
    },
    "firstName": "Jonas",
    "lastName": "Fehrenbacher"
}