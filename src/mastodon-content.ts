import { WebComponent } from 'web-component-base'

/**
 * @see https://webcomponent.io/prop-access/#opt-in-typed-props-in-typescript
 */
type MastodonContentProps = {
  server: string
  tagUrl: string
}

/**
 * Enhances a Mastodon status's `content` HTML, given as this element's own
 * light-DOM children (server-rendered, or otherwise already in the DOM):
 *
 * - Rewrites hashtag links — `<a class="hashtag" href="{server}/tags/{tag}">`,
 *   the markup Mastodon's status renderer emits — to point at `tagUrl`
 *   instead of the origin server. When `tagUrl` isn't given, the link is
 *   left pointing at the server's own tag page (`{server}/tags/{tag}`), so
 *   the tag opens in the server's own UI rather than breaking.
 * - Marks a line that consists only of hashtag links (Mastodon's convention
 *   for a trailing "tag list" on a post) with a `tag-bar` class on the line
 *   and a `pill` class on each link, so they can be styled as pills instead
 *   of inline text links.
 *
 * This assumes Mastodon's own hashtag markup convention. Other ActivityPub
 * server software (Pleroma, Akkoma, GoToSocial, ...) is not guaranteed to
 * render hashtags identically. The tag-bar check is also whitespace-strict —
 * it only tolerates a single `" "` text node between links, matching
 * Mastodon's own (unindented) HTML — so hand-authored or pretty-printed
 * markup with newlines/indentation between the links won't be recognized.
 *
 * There is no template here — this component enhances markup it's given
 * rather than owning its own render, so `render()` is overridden as a no-op.
 * Without that, wcb's default (empty) template would clear these
 * already-enhanced children right after `onInit()` runs.
 * @see https://webcomponent.io/template-vs-render/
 */
export class MastodonContent extends WebComponent<MastodonContentProps> {
  static props: MastodonContentProps = {
    server: '',
    tagUrl: '',
  }

  render() {}

  onInit() {
    const el = this.getElementsByClassName('hashtag')
    const { server, tagUrl } = this.props
    // no local route configured: send the tag back to the server's own UI
    const effectiveTagUrl = tagUrl || `${server}/tags/`

    for (let i = 0; i < el.length; i++) {
      const tagEl = el.item(i) as HTMLAnchorElement
      const currentHref = tagEl.getAttribute('href') ?? ''
      const tagName = currentHref.replace(`${server}/tags/`, '')
      tagEl.setAttribute('href', effectiveTagUrl + tagName)

      const parentEl = tagEl.parentElement
      if (!parentEl) continue

      const siblings = parentEl.childNodes
      let validSiblingsCount = 0

      for (const sibling of siblings) {
        if (!(sibling.nodeType === 3 && sibling.textContent === ' ')) {
          validSiblingsCount++
        }
      }

      const childrenTags = parentEl.getElementsByClassName('hashtag')
      const isTagBar = validSiblingsCount === childrenTags.length

      if (isTagBar) {
        parentEl.classList.add('tag-bar')
        tagEl.textContent = tagName
        tagEl.classList.add('pill')
      }
    }
  }
}

customElements.define('mastodon-content', MastodonContent)
