### Writing parameters for VTFX

These parameters explain the API for each function, and allow Mapbox Studio to generate a UI for new VTFX filters.

``` javascript
module.exports.parameters = {
    // Function name
    "name": "orderby",
    // Name to display in UI
    "display": "Order by feature",
    // Clarifying/instructional information about function to display.
    "description": "Returns sorted layer features based on which field to order by and sort direction.",
    // arguments taken by function
    "options": [
        {
            "field": "field",
            "type": "string"
        },
        {
            "field": "sort",
            "type": "number",
            // If there are a limited number of acceptable inputs as argument, 
            // list machine value and display value.
            // This will displayed as a drop down menu.
            "options": [{ "1": "asc"}, {"-1": "desc" }],
            "default": 1
        }
    ],
    // If multiple sets of inputs can be submitted in an array, 
    // e.g. {"id":"select-fields","options":[{"field":"ACQYEAR"}, {"field": "UNITNAME"}]},
    // otherwise multiple instances of the same filter will be submitted.
    "chainable": false
}
```

Based on the above parameters, the Mapbox Studio UI would submit:

`{"id":"orderby","field":"ACQYEAR","sort":"1"}`

### Notes:
If the `chainable` flag is set to `false`, expected arguments would be:

`layer`: a decoded protobuf

`options`: `{"id":"drop", "limit": 100}`


If the `chainable` flag is set to `true`, expected arguments would be:

`layer`: a decoded protobuf

`options`: `{"id":"dropkey", "options": [{"field":"elevation"}, {"field":"population"}]}`