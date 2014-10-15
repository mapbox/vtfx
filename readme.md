# vtfx

vector tile post-processors that make it easy to make performant vector tiles.

Summary of main motivations/goals/challenges:

> **What are the appropriate minzoom/maxzoom's for a given datasource? How can we determine those automatically?**
>
> For a given dataset there's definitely an appropriate maxzoom which I would say is roughly some combo of:
>
> - The point at which increasing the encoding of 4096 integer coordinates in the vector tiles affects geometries minimally.
> - The point at which each vector tile contains so little data it is more I/O overhead to load more zooms than to load a larger tile and hold onto it.
>
> Minzoom is trickier and is currently:
>
> - The point at which vector tiles start holding too much data to be efficient to transfer/load/parse (defined as 500k in our checks).
>
> **How can we make low minzooms work for dense datasources?**
>
> The definition of the minzoom is not ideal -- there are many datasets (think dense building footprints) where visually there are use cases where you'd like to see lower zoom levels but the data is too dense/difficult to fit into reasonable size limits.
>
> The tricks we've used to date are something like
>
> - Drop features randomly,
> - Drop features based on some heuristic like area or importance rank,
> - Simplify geometries in an ugly/aggressive way
>
> These tricks are not generalized, usually tied to postgres or data-specific configurations. A rough goal here might be to move these to postprocessors/datasource-agnostic libraries that can be used across projects.

#### Tests

`npm test`

for benchmarks on the garbage collector:

`node test/benchmark.js`
