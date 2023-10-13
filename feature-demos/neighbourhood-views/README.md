## Neighbourhood views

This is a demonstration of how you can use the Toolkit to provide local context for some selected element. When you have a large dataset it can be difficult to navigate around - neighbourhood contextual information can help.

It's a straightforward process to set this up in the Toolkit. We use a few key capabilities of the Toolkit in this demonstration:

- Each popup is a Surface that has a `Selection` as its data source, rather than the entire underlying toolkit. When the selection reloads, the associated Surface repaints itself.

- We use the `ElementDragger` helper class to make our popups draggable

- We use a custom tag to draw out the formula in nodes that have one. Custom tags are a powerful feature of the vanilla Toolkit that allow you to achieve a composable UI like you get when using Angular, React, Vue, Svelte etc.  Of course the Toolkit has a deep integration with each of those libraries so if you were doing this with a library integration you'd use a component from that library rather than a custom tag.
