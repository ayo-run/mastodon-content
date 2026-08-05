# mastodon-content

A custom element, built on [web-component-base](https://webcomponent.io),
that progressively enhances the `content` HTML of a Mastodon status:

- Rewrites hashtag links — `<a class="hashtag" href="{server}/tags/{tag}">`,
  the markup Mastodon's status renderer emits — to point at a `tag-url` of
  your choosing instead of the origin server. `tag-url` is optional: leave it
  out and the link stays on the server's own tag page, so hashtags still open
  somewhere useful without any local tag route configured.
- Marks a line consisting only of hashtag links (Mastodon's convention for a
  trailing "tag list" on a post) with a `tag-bar` class, and each of its
  links with a `pill` class, so they can be styled as pills instead of inline
  text links.

```html
<!-- rewrite hashtags to a local route -->
<mastodon-content server="https://mastodon.social" tag-url="/tags/">
  <!-- a Mastodon status's `content` field, rendered server-side -->
</mastodon-content>

<!-- or leave tag-url out to keep hashtags pointing at the server's own UI -->
<mastodon-content server="https://mastodon.social">
  <!-- ... -->
</mastodon-content>
```

It has no template of its own — it enhances the light-DOM markup it's given
rather than rendering — so give it real HTML up front (server-rendered, or
otherwise already in the DOM) for it to enhance on connect.

This assumes Mastodon's own hashtag markup convention. Other ActivityPub
server software (Pleroma, Akkoma, GoToSocial, ...) is not guaranteed to
render hashtags identically.

Scaffolded with `npm create wcb@latest`.

## Commands

- `npm run dev` — start the Vite dev server on the `index.html` demo page
- `npm run build` — build the demo page
- `npm run build:lib` — build the library: ESM + UMD bundles and `.d.ts`
  types in `dist/`, with `web-component-base` left external (it is a
  peerDependency)
- `npm run analyze` — generate `custom-elements.json` from the component's
  `static props`

## Publishing

`npm publish` (or `npm pack`) runs the `prepack` script, which rebuilds the
library and regenerates `custom-elements.json` — both ship inside the
package, and the `customElements` field in `package.json` is how Storybook,
editors, and other tooling discover the manifest. In the repo itself the
manifest stays gitignored; it is a build artifact.

See the [CEM plugin guide](https://webcomponent.io/cem-plugin/) for setting
it up with Storybook and code editors.

---

_Just keep building._
